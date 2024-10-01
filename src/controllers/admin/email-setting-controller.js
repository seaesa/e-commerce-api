import HttpError from '../../services/httpErrorService.js';
import EmailSettingService from '../../services/dbServices/emailSettingService.js';
import emailTemplates from '../../utils/emailTemplates.js';

/**
 * Retrieves the email settings information.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The JSON response containing the status, message, and data.
 */
const show = async (req, res, next) => {
    let emailSetting;

    try {
        emailSetting = await EmailSettingService.find();
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }

    res.json({ status: 'success', message: 'Email settings information retrieved successfully', data: emailSetting });
};

/**
 * Update email settings.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the email settings are updated.
 */
const update = async (req, res, next) => {
    try {
        const result = await EmailSettingService.update(null, req, req.body);
        res.json({ status: 'success', message: 'Email settings updated successfully', data: result });
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Sends a test email.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the test email is sent successfully.
 */
const sendTestEmail = async (req, res, next) => {
    const { email } = req.body;
    const response = await emailTemplates.sendTestEmail(email);

    if (response) {
        res.json({ status: 'success', message: 'Test email sent successfully' });
    } else {
        const error = new HttpError('Error sending test email', 500);
        return next(error);
    }
};

export default { show, update, sendTestEmail };
