import HttpError from '../../services/httpErrorService.js';
import SMSSettingService from '../../services/dbServices/SMSSettingService.js';

/**
 * Retrieves SMS settings information.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The JSON response containing the status, message, and data.
 */
const show = async (req, res, next) => {
    let smsSetting;

    try {
        smsSetting = await SMSSettingService.find();
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }

    res.json({ status: 'success', message: 'SMS settings information retrieved successfully', data: smsSetting });
};

/**
 * Update SMS settings.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
const update = async (req, res, next) => {
    try {
        const result = await SMSSettingService.update(null, req, req.body);
        res.json({ status: 'success', message: 'SMS settings updated successfully', data: result });
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

export default { show, update };
