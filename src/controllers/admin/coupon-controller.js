import HttpError from '../../services/httpErrorService.js';
import CouponService from '../../services/dbServices/couponService.js';

/**
 * Get coupon.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const get = async (req, res, next) => {
    try {
        const result = await CouponService.get(req);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Store a new coupon.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the coupon is stored.
 */
const store = async (req, res, next) => {
    try {
        const coupon = await CouponService.store(req.body);

        const response = {
            status: 'success',
            message: 'Coupon added successfully',
            data: {
                coupon
            }
        };
        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Edit a coupon.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the coupon is edited successfully.
 */
const edit = async (req, res, next) => {
    const couponId = req.params.couponId;

    try {
        const coupon = await CouponService.find(couponId);

        const response = {
            status: 'success',
            message: 'Coupon found successfully',
            data: {
                coupon
            }
        };

        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Update a coupon.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the coupon is updated.
 */
const update = async (req, res, next) => {
    const couponId = req.params.couponId;

    try {
        const coupon = await CouponService.update(couponId, req.body);
        res.json({ status: 'success', message: 'Coupon updated successfully', data: { coupon } });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Deletes a coupon by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the coupon is deleted successfully.
 * @throws {HttpError} - If there is an error while deleting the coupon.
 */
const destroy = async (req, res, next) => {
    const couponId = req.params.couponId;

    try {
        await CouponService.destroy(couponId);
        res.json({ status: 'success', message: 'Coupon deleted successfully' });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Retrieves the total number of coupons in the database.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} - JSON response containing the total number of coupons.
 * @throws {HttpError} - If there was an error retrieving the total number of coupons.
 */
const count = async (req, res, next) => {
    let totalCoupons;

    try {
        totalCoupons = await CouponService.countDocuments();
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }

    res.json({ totalCoupons });
};

/**
 * Performs a bulk action on coupons.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the bulk action is completed.
 * @throws {HttpError} - If an error occurs during the bulk action.
 */
const bulkAction = async (req, res, next) => {
    try {
        await CouponService.bulkAction(req.body);
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    res.json({ status: 'success', message: 'Coupon updated successfully' });
};

/**
 * Apply a coupon to the request and send the result as a JSON response.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the coupon is applied and the response is sent.
 */
const applyCoupon = async (req, res, next) => {
    try {
        const result = await CouponService.applyCoupon(req);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Removes a coupon.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the coupon is removed.
 * @throws {HttpError} - If an error occurs while removing the coupon.
 */
const removeCoupon = async (req, res, next) => {
    try {
        const result = await CouponService.removeCoupon(req);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

export default { get, store, edit, update, destroy, bulkAction, count, applyCoupon, removeCoupon };
