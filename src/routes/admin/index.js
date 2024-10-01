import categoryRoute from './category-route.js';
import subCategoryRoute from './sub-category-route.js';
import brandRoute from './brand-route.js';
import companyRoute from './company-route.js';
import userRoute from './user-route.js';
import paymentRoute from './payment-route.js';
import authRoute from './auth-route.js';
import emailSettingRoute from './email-setting-route.js';
import smsSettingRoute from './sms-setting-route.js';
import couponRoute from './coupon-route.js';
import languageRoute from './language-route.js';
import productRoute from './product-route.js';
import taxRoute from './tax-route.js';
import orderRoute from './order-route.js';
import companySettingRoute from './company-setting-route.js';
import socialAuthSettingRoute from './social-auth-setting-route.js';
import pushNotificationSettingRoute from './push-notification-setting-route.js';
import express from 'express';
// import verifyToken from './../../middleware/verifyToken.js';
const app = express();

app.use('/auth', authRoute);

// Apply verifyToken middleware globally
// app.use(verifyToken);
app.use('/payments', paymentRoute);
app.use('/users', userRoute);
app.use('/brands', brandRoute);
app.use('/categories', categoryRoute);
app.use('/sub-categories', subCategoryRoute);
app.use('/companies', companyRoute);
app.use('/coupons', couponRoute);
app.use('/languages', languageRoute);
app.use('/products', productRoute);
app.use('/orders', orderRoute);
app.use('/taxes', taxRoute);
app.use('/email-settings', emailSettingRoute);
app.use('/sms-settings', smsSettingRoute);
app.use('/social-auth-settings', socialAuthSettingRoute);
app.use('/push-notification-settings', pushNotificationSettingRoute);
app.use('/company-settings', companySettingRoute);

export default app;
