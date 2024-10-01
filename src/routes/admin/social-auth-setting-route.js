import express from 'express';
import socialAuthSettingController from '../../controllers/admin/social-auth-setting-controller.js';

const router = express.Router();

router.get('/show', socialAuthSettingController.show);
router.put('/update', socialAuthSettingController.update);

export default router;
