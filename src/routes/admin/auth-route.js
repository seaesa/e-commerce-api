import express from 'express';
import authController from '../../controllers/admin/auth-controller.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh-tokens', authController.refreshTokens);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/send-verification-email', authController.sendVerificationEmail);
router.post('/logout', authController.logout);

export default router;
