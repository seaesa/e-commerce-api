import express from 'express';
import ShippingAddressController from '../../controllers/user/shipping-address-controller.js';

const router = express.Router();

router.get('/:userId', ShippingAddressController.getByUserId);
router.post('/store', ShippingAddressController.store);
router.get('/edit/:shippingAddressId', ShippingAddressController.edit);
router.put('/update/:shippingAddressId', ShippingAddressController.update);
router.delete('/delete/:shippingAddressId', ShippingAddressController.destroy);

export default router;
