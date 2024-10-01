import CompanySetting from '../../models/company-setting-model.js';
import HttpError from '../httpErrorService.js';

/**
 * Finds and returns the company setting.
 *
 * @returns {Promise<Object>} The company setting object.
 * @throws {HttpError} If there is an error while finding the company setting.
 */
const find = async () => {
    let companySetting;

    try {
        companySetting = await CompanySetting.findOne();
    } catch (err) {
        throw new HttpError(err, 500);
    }

    return companySetting;
};

/**
 * Updates the company settings with the provided request body.
 *
 * @param {string|null} companyId - The ID of the company (optional).
 * @param {Object} req - The request object.
 * @param {Object} requestBody - The request body containing the updated company settings.
 * @returns {Promise<Object>} - A promise that resolves to the updated company settings.
 * @throws {HttpError} - If there is an error while updating the company settings.
 */
const update = async (companyId = null, req, requestBody) => {
    const { paypalStatus, paypalEnvironment, paypalSandboxClientId, paypalSandboxClientSecret, paypalLiveClientId, paypalLiveClientSecret, stripeStatus, stripeEnvironment, stripeSandboxPublishableKey, stripeSandboxSecretKey, stripeLivePublishableKey, stripeLiveSecretKey, razorpayStatus, razorpayEnvironment, razorpaySandboxKeyId, razorpaySandboxKeySecret, razorpayLiveKeyId, razorpayLiveKeySecret } = requestBody;

    // Check if file is not selected
    const { filename, path } = req.file ? req.file : {};

    let companySetting;

    try {
        companySetting = await CompanySetting.findOne();
    } catch (err) {
        throw new HttpError(err, 500);
    }

    companySetting.paypalStatus = paypalStatus || companySetting.paypalStatus;
    companySetting.paypalEnvironment = paypalEnvironment || companySetting.paypalEnvironment;
    companySetting.paypalSandboxClientId = paypalSandboxClientId || companySetting.paypalSandboxClientId;
    companySetting.paypalSandboxClientSecret = paypalSandboxClientSecret || companySetting.paypalSandboxClientSecret;
    companySetting.paypalLiveClientId = paypalLiveClientId || companySetting.paypalLiveClientId;
    companySetting.paypalLiveClientSecret = paypalLiveClientSecret || companySetting.paypalLiveClientSecret;
    companySetting.stripeStatus = stripeStatus || companySetting.stripeStatus;
    companySetting.stripeEnvironment = stripeEnvironment || companySetting.stripeEnvironment;
    companySetting.stripeSandboxPublishableKey = stripeSandboxPublishableKey || companySetting.stripeSandboxPublishableKey;
    companySetting.stripeSandboxSecretKey = stripeSandboxSecretKey || companySetting.stripeSandboxSecretKey;
    companySetting.stripeLivePublishableKey = stripeLivePublishableKey || companySetting.stripeLivePublishableKey;
    companySetting.stripeLiveSecretKey = stripeLiveSecretKey || companySetting.stripeLiveSecretKey;
    companySetting.razorpayStatus = razorpayStatus || companySetting.razorpayStatus;
    companySetting.razorpayEnvironment = razorpayEnvironment || companySetting.razorpayEnvironment;
    companySetting.razorpaySandboxKeyId = razorpaySandboxKeyId || companySetting.razorpaySandboxKeyId;
    companySetting.razorpaySandboxKeySecret = razorpaySandboxKeySecret || companySetting.razorpaySandboxKeySecret;
    companySetting.razorpayLiveKeyId = razorpayLiveKeyId || companySetting.razorpayLiveKeyId;
    companySetting.razorpayLiveKeySecret = razorpayLiveKeySecret || companySetting.razorpayLiveKeySecret;
    companySetting.logo = req.file ? filename : companySetting.logo;
    companySetting.path = req.file ? path : companySetting.path;

    try {
        await companySetting.save();
        return { companySetting };
    } catch (err) {
        throw new HttpError(err, 500);
    }
};

/**
 * Retrieves the payment methods from the company settings.
 * @returns {Object} An object containing the status of different payment methods.
 * @throws {HttpError} If there is an error while retrieving the company settings.
 */
const getPaymentMethods = async () => {
    let companySetting;

    try {
        companySetting = await CompanySetting.findOne();
    } catch (err) {
        throw new HttpError(err, 500);
    }

    return {
        paypalStatus: companySetting.paypalStatus,
        stripeStatus: companySetting.stripeStatus,
        razorpayStatus: companySetting.razorpayStatus,
        razorpayKey: companySetting.razorpayStatus ? (companySetting.razorpayEnvironment === 'sandbox' ? companySetting.razorpaySandboxKeyId : companySetting.razorpayLiveKeyId) : null,
        paypalKey: companySetting.paypalStatus ? (companySetting.paypalEnvironment === 'sandbox' ? companySetting.paypalSandboxClientId : companySetting.paypalLiveClientId) : null,
        stripeKey: companySetting.stripeStatus ? (companySetting.stripeEnvironment === 'sandbox' ? companySetting.stripeSandboxPublishableKey : companySetting.stripeLivePublishableKey) : null
    };
};

export default { find, update, getPaymentMethods };
