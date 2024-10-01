import express from 'express';
import smsSettingController from '../../controllers/admin/sms-setting-controller.js';

const router = express.Router();

router.get('/show', smsSettingController.show);
router.put('/update', smsSettingController.update);

export default router;
