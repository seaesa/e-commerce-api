import express from 'express';
import paymentController from '../../controllers/admin/payment-controller.js';
const router = express.Router();

// Store Payment
router.post('/store', paymentController.store);

export default router;
