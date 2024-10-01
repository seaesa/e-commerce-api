import express from 'express';
import categoryController from '../../controllers/admin/category-controller.js';
import productController from '../../controllers/admin/product-controller.js';
import taxController from '../../controllers/admin/tax-controller.js';
import couponController from '../../controllers/admin/coupon-controller.js';
import companyController from '../../controllers/admin/company-controller.js';
import sendMail from '../../services/mailerService.js';
import HttpError from '../../services/httpErrorService.js';
import companySettingsController from '../../controllers/admin/company-setting-controller.js';
import paymentController from '../../controllers/admin/payment-controller.js';
const router = express.Router();

// Other routes...
router.get('/get-categories-and-its-products', categoryController.getCategoriesAndItsProducts);

// Get products and its category
router.get('/get-products-and-its-category', productController.getProductsAndItsCategory);

router.get('/get-category-by-slug', categoryController.getByCategorySlug);
router.get('/get-product-by-slug/:slug', productController.getByProductSlug);
router.get('/get-featured-products', productController.getFeaturedProducts);
router.get('/get-taxes', taxController.get);
router.post('/apply-coupon', couponController.applyCoupon); // Apply coupon
router.post('/remove-coupon', couponController.removeCoupon); // Remove coupon
// Get company details
router.get('/get-company-details', companyController.show);

// Get products by category slug
router.get('/get-products-by-category-slug/:slug', productController.getProductsByCategorySlug);

// payment-methods
router.get('/get-payment-methods', companySettingsController.getPaymentMethods);

// Get in touch
router.post('/get-in-touch', async (req, res, next) => {
    const { email, subject, message } = req.body;

    // Send email to the admin
    const mailOptions = {
        from: email,
        to: ['rohineetandekar14@gmail.com'],
        subject,
        text: message
    };

    try {
        await sendMail(mailOptions.from, mailOptions.to, mailOptions.subject, mailOptions.text);
        const response = {
            status: 'success',
            message: 'Message sent successfully'
        };
        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
});

router.post('/create-order', paymentController.createOrder);

export default router;
