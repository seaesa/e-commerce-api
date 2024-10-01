import HttpError from '../../services/httpErrorService.js';
import Subscription from '../../models/subscription-model.js';

/**
 * Subscribes an email to the subscription service.
 * @param {Object} req - The request object containing the email to subscribe.
 * @param {string} req.email - The email to subscribe.
 * @returns {Promise<Object>} A promise that resolves to an object containing the status, message, and subscription details.
 * @throws {HttpError} If an error occurs during the subscription process.
 */
const subscribe = async (req) => {
    const { email } = req;

    try {
        let subscription = await Subscription.findOne({ email });

        if (subscription) {
            if (subscription.status === 'subscribed') {
                return {
                    status: 'error',
                    message: 'This email is already subscribed',
                    subscription
                };
            }
            subscription.status = 'subscribed';
            await subscription.save();

            return {
                status: 'error',
                message: 'Subscription successful',
                subscription
            };
        }

        subscription = new Subscription({ email });
        await subscription.save();

        return {
            status: 'success',
            message: 'Subscription successful',
            subscription
        };
    } catch (err) {
        throw new HttpError(400, err.message);
    }
};

/**
 * Unsubscribes a user from the subscription service.
 * @param {string} email - The email of the user to unsubscribe.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the status, message, and subscription details.
 * @throws {HttpError} - If the subscription is not found or an error occurs during the unsubscription process.
 */
const unsubscribe = async (email) => {
    try {
        const subscription = await Subscription.findOne({ email });
        if (!subscription) throw new HttpError(404, 'Subscription not found');

        subscription.status = 'unsubscribed';
        await subscription.save();

        return {
            status: 'success',
            message: 'Unsubscription successful',
            subscription
        };
    } catch (err) {
        throw new HttpError(400, err.message);
    }
};

export default {
    subscribe,
    unsubscribe
};
