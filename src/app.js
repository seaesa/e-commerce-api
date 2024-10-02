import express from 'express';
import cors from 'cors';
import admin from './routes/admin/index.js';
import user from './routes/user/index.js';
import HttpError from './services/httpErrorService.js';
import fs from 'fs';
import dotenv from 'dotenv';
import DB from './db/db.js';

dotenv.config()
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
console.log(process.env.NODE_ENV)
app.use(cors());

// Image Upload to local storage
app.use('/public', express.static('public'));
app.use(express.static('./public/user-uploads'));

app.use('/api/v1/admin', admin);
app.use('/api/v1/user', user);

app.use((req, res, next) => {
  const error = new HttpError('không thể tìm thấy tuyến đường.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);

  const response = {
    status: 'error',
    message: error.message || 'lỗi không các định'
  };

  res.json(response);
});

DB(app);

export default app;
