import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * Middleware function to handle file uploads using multer.
 * @param {string} uploadFolder - The folder where the uploaded files will be stored.
 * @returns {function} - Multer middleware function.
 */
const singleImageUploader = (uploadFolder, fileFieldName = 'image') => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const destination = path.resolve(`${'./public/user-uploads'}/${uploadFolder}`);

      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }

      req.generatedFilePath = destination;

      cb(null, destination);
    },
    filename: function (req, file, cb) {
      const extension = file.mimetype.split('/')[1];
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileName = file.fieldname + '-' + uniqueSuffix + '.' + extension;

      // Set the generated file name on the request object
      req.generatedFileName = fileName;

      cb(null, fileName);
    }
  });

  const limits = {
    files: 1, // Set the maximum number of files to 1
    fileSize: 5 * 1024 * 1024 // Set the maximum file size to 5MB
  };

  return multer({ storage, limits }).single(fileFieldName);
};

const multiImageUploader = (uploadFolder, fileFieldName = 'images') => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const destination = path.resolve(`${'./public/user-uploads'}/${uploadFolder}`);

      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }

      req.generatedFilePath = destination;

      cb(null, destination);
    },
    filename: function (req, file, cb) {
      const extension = file.mimetype.split('/')[1];
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileName = file.fieldname + '-' + uniqueSuffix + '.' + extension;

      // Set the generated file name on the request object
      req.generatedFileName = fileName;

      cb(null, fileName);
    }
  });

  const limits = {
    files: 5, // Set the maximum number of files to 5
    fileSize: 5 * 1024 * 1024 // Set the maximum file size to 5MB
  };

  return multer({ storage, limits }).array(fileFieldName, 15);
};

export { singleImageUploader, multiImageUploader };
