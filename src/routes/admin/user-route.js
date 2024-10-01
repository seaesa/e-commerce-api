import express from 'express';
import userController from '../../controllers/admin/user-controller.js';
import { singleImageUploader } from '../../services/uploadService.js';
const router = express.Router();

// Image upload routes...
router.post('/store', singleImageUploader('users', 'image'), userController.store);
router.put('/update/:userId', singleImageUploader('users', 'image'), userController.update);

// Other routes...
router.get('/', userController.get);
router.get('/edit/:userId', userController.edit);
router.delete('/delete/:userId', userController.destroy);
router.get('/total-taxes', userController.count);
router.post('/bulk-action', userController.bulkAction);

export default router;
