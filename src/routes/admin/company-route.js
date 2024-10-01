import express from 'express';
import companyController from '../../controllers/admin/company-controller.js';
import { singleImageUploader } from '../../services/uploadService.js';

const router = express.Router();

router.post('/store', singleImageUploader('companies', 'image'), companyController.store);
router.get('/show', companyController.show);
router.put('/update', singleImageUploader('companies', 'image'), companyController.update);

export default router;
