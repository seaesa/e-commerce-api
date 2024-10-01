import express from 'express';
import orderController from '../../controllers/admin/order-controller.js';
const router = express.Router();
// Other routes...
router.post('/store/:sessionId', orderController.store);

export default router;
