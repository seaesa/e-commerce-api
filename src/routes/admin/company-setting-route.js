import express from 'express';
import companySettingController from '../../controllers/admin/company-setting-controller.js';

const router = express.Router();

router.get('/show', companySettingController.show);
router.put('/update', companySettingController.update);

export default router;
