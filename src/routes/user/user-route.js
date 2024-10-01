import express from 'express';
import userController from '../../controllers/user/user-controller.js';
const router = express.Router();

router.post('/find-by-user-id/:userId', userController.findById);
router.put('/update/:userId', userController.update);

export default router;
