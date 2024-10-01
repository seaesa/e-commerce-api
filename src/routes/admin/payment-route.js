import express from 'express';
import paymentController from '../../controllers/admin/payment-controller.js';

const router = express.Router();

router.get('/', paymentController.get);
router.post('/create-order', paymentController.createOrder);
export default router;
