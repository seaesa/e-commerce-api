import express from 'express';
import subscriptionController from '../../controllers/user/subscription-controller.js';
const router = express.Router();

router.post('/subscribe', subscriptionController.subscribe);
router.post('/unsubscribe/:token', subscriptionController.unsubscribe);

export default router;
