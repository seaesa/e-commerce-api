import express from 'express';
import pushNotificationSettingController from '../../controllers/admin/push-notification-setting-controller.js';

const router = express.Router();

router.get('/show', pushNotificationSettingController.show);
router.put('/update', pushNotificationSettingController.update);

export default router;
