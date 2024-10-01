import express from 'express';
import emailSettingController from '../../controllers/admin/email-setting-controller.js';

const router = express.Router();

router.get('/show', emailSettingController.show);
router.put('/update', emailSettingController.update);
router.post('/send-test-email', emailSettingController.sendTestEmail);

export default router;
