import express from 'express';
import subCategoryController from '../../controllers/admin/sub-category-controller.js';
import { singleImageUploader } from '../../services/uploadService.js';

const router = express.Router();

// Image upload routes...
router.post('/store', singleImageUploader('sub-categories', 'image'), subCategoryController.store);
router.put('/update/:subCategoryId', singleImageUploader('sub-categories', 'image'), subCategoryController.update);

// Other routes...
router.get('/', subCategoryController.get);
router.get('/edit/:subCategoryId', subCategoryController.edit);
router.delete('/delete/:subCategoryId', subCategoryController.destroy);
router.get('/get-sub-categories-by-category-id/:categoryId', subCategoryController.getSubCategoriesByCategoryId);
router.get('/total-sub-categories', subCategoryController.count);
router.post('/bulk-action', subCategoryController.bulkAction);

export default router;
