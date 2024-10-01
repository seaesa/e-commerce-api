import express from 'express';
import productController from '../../controllers/admin/product-controller.js';

const router = express.Router();

router.get('/', productController.get);
router.post('/store', productController.store);
router.get('/edit/:productId', productController.edit);
router.put('/update/:productId', productController.update);
router.delete('/delete/:productId', productController.destroy);
router.get('/total-categories', productController.count);
router.post('/bulk-action', productController.bulkAction);

export default router;
