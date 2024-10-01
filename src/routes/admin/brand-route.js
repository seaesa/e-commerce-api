import express from 'express';
import brandController from '../../controllers/admin/brand-controller.js';
import { singleImageUploader } from '../../services/uploadService.js';

const router = express.Router();

// Image upload routes...
router.post('/store', singleImageUploader('brands', 'image'), brandController.store);
router.put('/update/:brandId', singleImageUploader('brands', 'image'), brandController.update);

// Other routes...
router.get('/', brandController.get);
router.get('/edit/:brandId', brandController.edit);
router.get('/show/:slug', brandController.findBySlug);
router.delete('/delete/:brandId', brandController.destroy);
router.post('/bulk-action', brandController.bulkAction);

export default router;
