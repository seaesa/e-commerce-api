import express from 'express';
import categoryController from '../../controllers/admin/category-controller.js';
import { singleImageUploader } from '../../services/uploadService.js';

const router = express.Router();

// Image upload routes...
router.post('/store', singleImageUploader('categories', 'image'), categoryController.store);
router.put('/update/:categoryId', singleImageUploader('categories', 'image'), categoryController.update);

// Other routes...
router.get('/', categoryController.get);
router.get('/edit/:categoryId', categoryController.edit);
router.delete('/delete/:categoryId', categoryController.destroy);
router.get('/total-categories', categoryController.count);
router.post('/bulk-action', categoryController.bulkAction);

export default router;
