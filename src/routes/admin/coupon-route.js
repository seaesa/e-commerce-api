import express from 'express';
import couponController from '../../controllers/admin/coupon-controller.js';

const router = express.Router();

router.get('/', couponController.get);
router.post('/store', couponController.store);
router.get('/edit/:couponId', couponController.edit);
router.put('/update/:couponId', couponController.update);
router.delete('/delete/:couponId', couponController.destroy);
router.get('/total-categories', couponController.count);
router.post('/bulk-action', couponController.bulkAction);

export default router;
