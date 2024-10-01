import express from 'express';
import cartController from '../../controllers/user/cart-controller.js';
const router = express.Router();

// Other routes...
router.post('/add-to-cart/:sessionId', cartController.addToCart);
router.delete('/remove-from-cart/:sessionId', cartController.removeFromCart);
router.post('/decrement-quantity/:sessionId', cartController.decrementQuantity);
router.get('/details/:type/:value', cartController.findCart);
router.post('/save-checkout-data', cartController.saveCheckoutData); // Save checkout data

export default router;
