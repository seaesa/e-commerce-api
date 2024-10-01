import Razorpay from 'razorpay';
import 'dotenv/config';
import HttpError from './httpErrorService.js';

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const store = async (amount, currency, receipt) => {
    const options = {
        amount, // amount in smallest currency unit
        currency,
        receipt
    };

    try {
        const order = await instance.orders.create(options);

        if (!order) {
            return new HttpError('Order creation failed', 500);
        }

        return order;
    } catch (error) {
        return new HttpError(error.message, 500);
    }
};

export default { store };
