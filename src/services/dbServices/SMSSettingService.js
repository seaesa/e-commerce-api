import SMSSetting from '../../models/sms-setting-model.js';
import Company from '../../models/company-model.js';
import HttpError from '../httpErrorService.js';

/**
 * Updates the SMS settings for a company.
 *
 * @param {string} companyId - The ID of the company.
 * @param {Object} req - The request object.
 * @param {Object} requestBody - The request body containing the updated SMS settings.
 * @returns {Promise<Object>} - The updated SMS settings.
 * @throws {HttpError} - If an error occurs while updating the SMS settings.
 */
const update = async (companyId = null, req, requestBody) => {
    const { smsSid, smsAuthToken, smsFromNumber, status } = requestBody;

    let company;

    try {
        company = await Company.findOne();
    } catch (err) {
        throw new HttpError(err, 500);
    }

    const smsSetting = await SMSSetting.findOne();

    if (!smsSetting) {
        throw new HttpError('Unexpected error occured!', 500);
    }

    smsSetting.companyId = company._id;
    smsSetting.smsSid = smsSid || smsSetting.smsSid;
    smsSetting.smsAuthToken = smsAuthToken || smsSetting.smsAuthToken;
    smsSetting.smsFromNumber = smsFromNumber || smsSetting.smsFromNumber;
    smsSetting.status = status || smsSetting.status;
    smsSetting.updatedAt = Date.now();

    try {
        await smsSetting.save();
        return { smsSetting };
    } catch (err) {
        throw new HttpError(err, 500);
    }
};

/**
 * Find the SMS setting.
 * @returns {Promise<{smsSetting: Object}>} The SMS setting object.
 * @throws {HttpError} If there is an error while finding the SMS setting.
 */
const find = async () => {
    let smsSetting;

    try {
        smsSetting = await SMSSetting.findOne();
    } catch (err) {
        throw new HttpError(err, 500);
    }

    return { smsSetting };
};

export default { update, find };
