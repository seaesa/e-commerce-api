import EmailSetting from '../../models/email-setting-model.js';
import Company from '../../models/company-model.js';
import HttpError from '../httpErrorService.js';

/**
 * Updates the email settings for a company.
 *
 * @param {string} companyId - The ID of the company.
 * @param {Object} req - The request object.
 * @param {Object} requestBody - The request body containing the updated email settings.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the updated email settings.
 * @throws {HttpError} - If an unexpected error occurs during the update process.
 */
const update = async (companyId = null, req, requestBody) => {
    const { mailFromName, mailFromAddress, driver, host, port, username, password, encryption, status } = requestBody;

    let company;

    try {
        company = await Company.findOne();
    } catch (err) {
        throw new HttpError(err, 500);
    }

    const emailSetting = await EmailSetting.findOne();

    if (!emailSetting) {
        throw new HttpError('Unexpected error occured!', 500);
    }

    emailSetting.companyId = company._id;
    emailSetting.mailFromName = mailFromName || emailSetting.mailFromName;
    emailSetting.mailFromAddress = mailFromAddress || emailSetting.mailFromAddress;
    emailSetting.driver = driver || emailSetting.driver;
    emailSetting.host = host || emailSetting.host;
    emailSetting.port = port || emailSetting.port;
    emailSetting.username = username || emailSetting.username;
    emailSetting.password = password || emailSetting.password;
    emailSetting.encryption = encryption || emailSetting.encryption;
    emailSetting.status = status || emailSetting.status;

    try {
        await emailSetting.save();
        return { emailSetting };
    } catch (err) {
        throw new HttpError(err, 500);
    }
};

/**
 * Finds the email setting.
 * @returns {Promise<{ emailSetting: any }>} The email setting.
 */
const find = async () => {
    let emailSetting;

    try {
        emailSetting = await EmailSetting.findOne();
    } catch (err) {
        throw new HttpError(err, 500);
    }

    return { emailSetting };
};

export default { update, find };
