import HttpError from '../../services/httpErrorService.js';
import PushNotificationSettingService from '../../services/dbServices/pushNotificationSettingService.js';

/**
 * Retrieves push notification setting information.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The response object with push notification setting information.
 */
const show = async (req, res, next) => {
    let pushNotificationSetting;

    try {
        pushNotificationSetting = await PushNotificationSettingService.find();
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }

    res.json({ status: 'success', message: 'Push notification setting information retrieved successfully', data: pushNotificationSetting });
};

/**
 * Update push notification settings.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the push notification settings are updated.
 */
const update = async (req, res, next) => {
    try {
        const result = await PushNotificationSettingService.update(null, req, req.body);
        res.json({ status: 'success', message: 'Push notification settings updated successfully', data: result });
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

export default { show, update };
