import express from 'express';
import orderController from '../../controllers/admin/order-controller.js';

const router = express.Router();

router.get('/', orderController.get);
router.get('/edit/:orderId', orderController.edit);
router.put('/update/:orderId', orderController.update);
router.delete('/delete/:orderId', orderController.destroy);
router.get('/total-categories', orderController.count);
router.post('/bulk-action', orderController.bulkAction);
router.get('/download/:orderId', orderController.download);

export default router;
