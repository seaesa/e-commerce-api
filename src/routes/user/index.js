import express from 'express';
import authRoute from './auth-route.js';
import cartRoute from './cart-route.js';
import commonRoute from './common-route.js';
import userRoute from './user-route.js';
import shippingRoute from './shipping-address-route.js';
import orderRoute from './order-route.js';
import subscriptionRoute from './subscription-route.js';
import paymentRoute from './payment-route.js';
const app = express();

app.use('/', subscriptionRoute);
app.use('/', commonRoute);
app.use('/auth', authRoute);
app.use('/users', userRoute);
// app.use('/carts', cartRoute);
app.use('/shipping-addresses', shippingRoute);
app.use('/orders', orderRoute);
app.use('/payments', paymentRoute);

export default app;
