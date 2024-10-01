import HttpError from '../../services/httpErrorService.js';
import SocialAuthSettingService from '../../services/dbServices/socialAuthSettingService.js';

/**
 * Retrieves social auth setting information.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The response object with status, message, and data.
 */
const show = async (req, res, next) => {
    let socialAuthSetting;

    try {
        socialAuthSetting = await SocialAuthSettingService.find();
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }

    res.json({ status: 'success', message: 'Social auth setting information retrieved successfully', data: socialAuthSetting });
};

/**
 * Updates the social auth settings.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
const update = async (req, res, next) => {
    try {
        const result = await SocialAuthSettingService.update(null, req, req.body);
        res.json({ status: 'success', message: 'Social auth settings updated successfully', data: result });
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

export default { show, update };
