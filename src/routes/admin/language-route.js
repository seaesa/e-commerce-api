import express from 'express';
import languageController from '../../controllers/admin/language-controller.js';

const router = express.Router();

router.get('/', languageController.get);
router.post('/store', languageController.store);
router.get('/edit/:languageId', languageController.edit);
router.put('/restore/:languageId', languageController.restore);
router.put('/update/:languageId', languageController.update);
router.delete('/delete/:languageId', languageController.destroy);
router.get('/total-categories', languageController.count);
router.put('/change-status/:languageId/:status', languageController.changeStatus);

export default router;
