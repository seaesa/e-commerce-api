import HttpError from '../../services/httpErrorService.js';
import SubscriptionService from '../../services/dbServices/subscriptionService.js';

/**
 * Subscribes a user to a subscription.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the subscription data or rejects with an error.
 */
const subscribe = async (req, res, next) => {
    try {
        const subscription = await SubscriptionService.subscribe(req.body);
        res.json(subscription);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Unsubscribes a user from the subscription service.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the user is unsubscribed.
 * @throws {HttpError} - If there is an error while unsubscribing the user.
 */
const unsubscribe = async (req, res, next) => {
    // Get token from URL
    const email = req.params.token;

    try {
        const subscription = await SubscriptionService.unsubscribe(email);
        res.json(subscription);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

export default {
    subscribe,
    unsubscribe
};
