import express from 'express';
import taxController from '../../controllers/admin/tax-controller.js';

const router = express.Router();

router.get('/', taxController.get);
router.post('/store', taxController.store);
router.get('/edit/:taxId', taxController.edit);
router.put('/restore/:taxId', taxController.restore);
router.put('/update/:taxId', taxController.update);
router.delete('/delete/:taxId', taxController.destroy);
router.get('/total-taxes', taxController.count);

export default router;
