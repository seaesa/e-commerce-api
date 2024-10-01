import HttpError from '../httpErrorService.js';
import PushNotificationSetting from '../../models/push-notification-setting-model.js';
import Company from '../../models/company-model.js';

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
    const { onesignalAppId, onesignalApiKey, notificationLogo, status } = requestBody;

    let company;

    try {
        company = await Company.findOne();
    } catch (err) {
        throw new HttpError(err, 500);
    }

    const pushNotificationSetting = await PushNotificationSetting.findOne();

    if (!pushNotificationSetting) {
        throw new HttpError('Unexpected error occured!', 500);
    }

    pushNotificationSetting.companyId = company._id;
    pushNotificationSetting.onesignalAppId = onesignalAppId;
    pushNotificationSetting.onesignalApiKey = onesignalApiKey;
    pushNotificationSetting.notificationLogo = notificationLogo;
    pushNotificationSetting.status = status;
    pushNotificationSetting.updatedAt = Date.now();

    try {
        await pushNotificationSetting.save();
        return { pushNotificationSetting };
    } catch (err) {
        throw new HttpError(err, 500);
    }
};

/**
 * Finds the push notification setting.
 * @returns {Promise<{ pushNotificationSetting: Object }>} The push notification setting object.
 * @throws {HttpError} If there is an error while finding the push notification setting.
 */
const find = async () => {
    let pushNotificationSetting;

    try {
        pushNotificationSetting = await PushNotificationSetting.findOne();
    } catch (err) {
        throw new HttpError(err, 500);
    }

    return { pushNotificationSetting };
};

export default { update, find };
