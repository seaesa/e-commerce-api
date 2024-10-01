import HttpError from '../httpErrorService.js';
import Company from '../../models/company-model.js';
import SocialAuthSetting from '../../models/social-auth-setting-model.js';

/**
 * Updates the push notification settings for a company.
 *
 * @param {string} companyId - The ID of the company.
 * @param {Object} req - The request object.
 * @param {Object} requestBody - The request body containing the updated push notification settings.
 * @param {string} requestBody.onesignalAppId - The OneSignal App ID.
 * @param {string} requestBody.onesignalRestApiKey - The OneSignal REST API Key.
 * @param {string} requestBody.notificationLogo - The URL of the notification logo.
 * @param {boolean} requestBody.status - The status of the push notification setting.
 * @returns {Object} - The updated push notification setting.
 * @throws {HttpError} - If an unexpected error occurs during the update process.
 */
const update = async (companyId = null, req, requestBody) => {
    const {
        googleClientId,
        googleClientSecret,
        googleStatus,
        facebookClientId,
        facebookClientSecret,
        facebookStatus,
        linkedinClientId,
        linkedinClientSecret,
        linkedinStatus,
        twitterClientId,
        twitterClientSecret,
        twitterStatus
    } = requestBody;

    let company;

    try {
        company = await Company.findOne();
    } catch (err) {
        throw new HttpError(err, 500);
    }

    const socialAuthSetting = await SocialAuthSetting.findOne();

    if (!socialAuthSetting) {
        throw new HttpError('Unexpected error occured!', 500);
    }

    socialAuthSetting.companyId = company._id;
    socialAuthSetting.facebookClientId = facebookClientId || socialAuthSetting.facebookClientId;
    socialAuthSetting.facebookClientSecret = facebookClientSecret || socialAuthSetting.facebookClientSecret;
    socialAuthSetting.facebookStatus = facebookStatus || socialAuthSetting.facebookStatus;
    socialAuthSetting.googleClientId = googleClientId || socialAuthSetting.googleClientId;
    socialAuthSetting.googleClientSecret = googleClientSecret || socialAuthSetting.googleClientSecret;
    socialAuthSetting.googleStatus = googleStatus || socialAuthSetting.googleStatus;
    socialAuthSetting.twitterClientId = twitterClientId || socialAuthSetting.twitterClientId;
    socialAuthSetting.twitterClientSecret = twitterClientSecret || socialAuthSetting.twitterClientSecret;
    socialAuthSetting.twitterStatus = twitterStatus || socialAuthSetting.twitterStatus;
    socialAuthSetting.linkedinClientId = linkedinClientId || socialAuthSetting.linkedinClientId;
    socialAuthSetting.linkedinClientSecret = linkedinClientSecret || socialAuthSetting.linkedinClientSecret;
    socialAuthSetting.linkedinStatus = linkedinStatus || socialAuthSetting.linkedinStatus;
    socialAuthSetting.updatedAt = Date.now();

    try {
        await socialAuthSetting.save();
        return { socialAuthSetting };
    } catch (err) {
        throw new HttpError(err, 500);
    }
};

/**
 * Finds the push notification setting.
 * @returns {Promise<{ socialAuthSetting: Object }>} The push notification setting object.
 * @throws {HttpError} If there is an error while finding the push notification setting.
 */
const find = async () => {
    let socialAuthSetting;

    try {
        socialAuthSetting = await SocialAuthSetting.findOne();
    } catch (err) {
        throw new HttpError(err, 500);
    }

    return { socialAuthSetting };
};

export default { update, find };
