import HttpError from '../../services/httpErrorService.js';
import CompanySettingService from '../../services/dbServices/companySettingService.js';

/**
 * Retrieves the company settings information.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the company settings information.
 */
const show = async (req, res, next) => {
    let companySetting;

    try {
        companySetting = await CompanySettingService.find();
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }

    res.json({ status: 'success', message: 'Company settings information retrieved successfully', data: companySetting });
};

/**
 * Update company settings.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the company settings are updated successfully.
 */
const update = async (req, res, next) => {
    try {
        const result = await CompanySettingService.update(null, req, req.body);
        res.json({ status: 'success', message: 'Company settings updated successfully', data: result });
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Retrieves the payment methods.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the retrieved payment methods.
 * @throws {HttpError} - If there is an error retrieving the payment methods.
 */
const getPaymentMethods = async (req, res, next) => {
    try {
        const paymentMethods = await CompanySettingService.getPaymentMethods();
        res.json({ status: 'success', message: 'Payment methods retrieved successfully', data: paymentMethods });
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

export default { show, update, getPaymentMethods };
