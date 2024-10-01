import HttpError from '../../services/httpErrorService.js';
import ShippingAddressService from '../../services/dbServices/shippingAddressService.js';

/**
 * Get shipping address by user ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the shipping address is fetched successfully.
 * @throws {HttpError} - If there is an error while fetching the shipping address.
 */
const getByUserId = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        const result = await ShippingAddressService.findByUserId(userId);

        const response = {
            status: 'success',
            message: 'Shipping Address fetched successfully.',
            data: {
                result
            }
        };

        res.json(response);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Store a new shipping address.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the shipping address is stored.
 * @throws {HttpError} - If an error occurs while storing the shipping address.
 */
const store = async (req, res, next) => {
    try {
        const shippingAddress = await ShippingAddressService.store(req.body);

        const response = {
            status: 'success',
            message: 'Shipping Address added successfully.',
            data: {
                shippingAddress
            }
        };
        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Edit shipping address by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves when the shipping address is edited.
 */
const edit = async (req, res, next) => {
    const shippingAddressId = req.params.shippingAddressId;

    try {
        const shippingAddress = await ShippingAddressService.findById(shippingAddressId);

        const response = {
            status: 'success',
            message: 'Shipping Address found successfully',
            data: {
                shippingAddress
            }
        };

        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Update a shipping address.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the shipping address is updated.
 */
const update = async (req, res, next) => {
    const shippingAddressId = req.params.shippingAddressId;

    try {
        const shippingAddress = await ShippingAddressService.update(shippingAddressId, req.body);
        res.json({ status: 'success', message: 'Shipping Address updated successfully', data: { shippingAddress } });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Deletes a shipping address.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the shipping address is deleted.
 * @throws {HttpError} - If there is an error while deleting the shipping address.
 */
const destroy = async (req, res, next) => {
    const shippingAddressId = req.params.shippingAddressId;

    try {
        await ShippingAddressService.destroy(shippingAddressId);
        res.json({ status: 'success', message: 'Shipping Address deleted successfully' });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

export default { getByUserId, store, edit, update, destroy };
