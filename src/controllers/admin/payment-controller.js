import 'dotenv/config';
import HttpError from '../../services/httpErrorService.js';
import RazorpayService from '../../services/razorpayService.js';
import PaymentService from '../../services/dbServices/paymentService.js';

/**
 * Get payment details.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const get = async (req, res, next) => {
    try {
        const result = await PaymentService.get(req);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Creates a new order using Razorpay API.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves with the created order object or rejects with an error.
 * @throws {HttpError} - If order creation fails.
 */
const createOrder = async (req, res, next) => {
    const { amount, currency } = req.body;
    const receipt = 'order_rcptid_11';

    try {
        const order = await RazorpayService.store(amount, currency, receipt);

        if (!order) {
            const error = new HttpError('Order creation failed', 500);
            return next(error);
        }

        res.json(order);
    } catch (error) {
        const err = new HttpError(error.message, 500);
        return next(err);
    }
};

// store
const store = async (req, res, next) => {
    try {
        const result = await PaymentService.store(req);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

export default { createOrder, get, store };
