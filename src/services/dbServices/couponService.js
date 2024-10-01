import HttpError from '../../services/httpErrorService.js';
import mongoose from 'mongoose';
import Coupon from '../../models/coupon-model.js';
import Cart from '../../models/cart-model.js';
import CartService from '../../services/dbServices/cartService.js';

const DEFAULTS = {
    LIMIT: 10,
    STATUS: 'all',
    NAME: 'All'
};

/**
 * Retrieves coupons based on the provided request parameters.
 * @param {Object} req - The request object.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the retrieved coupons.
 * @throws {HttpError} - If an error occurs while retrieving the coupons.
 */
const get = async req => {
    let coupons;

    try {
        const page = parseInt(req.query.currentPage, 10) || 1;
        const limit = parseInt(req.query.itemPerPage, 10) || DEFAULTS.LIMIT;
        const searchText = req.query.search || '';
        const code = req.query.code || DEFAULTS.NAME;
        const status = req.query.status || DEFAULTS.STATUS;
        const startDate = req.query.start || '';
        const endDate = req.query.end || '';
        const sort = req.query.sort === 'asc' ? 1 : -1;
        const regex = /\b[dD](e(l(et?)?)?|l(et?)?|l)\b/i;

        const filter = {
            $or: [
                { code: { $regex: searchText, $options: 'i' } },
                {
                    $and: [
                        { status: { $regex: searchText, $options: 'i' } },
                        { deletedAt: { $eq: null } }
                    ]
                }
            ]
        };

        if (code !== DEFAULTS.NAME) {
            filter.name = code;
        }

        if (status !== DEFAULTS.STATUS) {
            filter.status = status;
            filter.deletedAt = null;
        }

        // SearchText deleted data
        if (regex.test(searchText)) {
            filter.$or.push({ deletedAt: { $ne: null } });
        }

        // apply filter for price field only if searchText string is a number
        const priceRegex = /^\d+$/;

        if (priceRegex.test(searchText)) {
            filter.$or.push({ discount: { $eq: parseInt(searchText) } });
        }

        if (startDate && endDate) {
            // Convert startDate and endDate to Date objects
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Extract date part (year-month-day) from startDate and endDate
            const startYearMonthDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            const endYearMonthDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

            // Adjust end date to include the entire day
            endYearMonthDay.setDate(endYearMonthDay.getDate() + 1);

            // Filter createdAt field based on the date part
            filter.createdAt = {
                $gte: startYearMonthDay,
                $lt: endYearMonthDay
            };
        }

        const getBaseAggregation = () => {
            return Coupon.find(filter);
        };

        coupons = await getBaseAggregation()
            .sort({ code: sort })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const total = await getBaseAggregation().countDocuments(filter);

        return {
            status: 'success',
            total,
            page,
            limit,
            coupons
        };
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Stores a new coupon in the database.
 * @param {Object} data - The coupon data to be stored.
 * @param {string} data.code - The coupon code.
 * @param {string} data.type - The type of coupon.
 * @param {number} data.discount - The discount value.
 * @param {Date} data.fromDate - The start date of the coupon.
 * @param {Date} data.toDate - The end date of the coupon.
 * @param {string} data.status - The status of the coupon.
 * @returns {Promise<Object>} - The stored coupon object.
 * @throws {HttpError} - If there is an error while saving the coupon.
 */
const store = async data => {
    const {
        companyId,
        code,
        discount,
        discountType,
        fromDate,
        toDate,
        status
    } = data;

    const coupon = new Coupon({
        companyId,
        code,
        discount,
        discountType,
        fromDate,
        toDate,
        status,
        createdAt: Date.now()
    });

    try {
        await coupon.save();
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    return coupon;
};

/**
 * Finds a coupon by its ID.
 * @param {string} couponId - The ID of the coupon to find.
 * @returns {Promise<Object>} - A promise that resolves to the found coupon object.
 * @throws {HttpError} - If the coupon ID is invalid or the coupon is not found.
 */
const find = async couponId => {
    try {
        if (!mongoose.Types.ObjectId.isValid(couponId)) {
            throw new HttpError('Invalid Coupon ID format', 400);
        }

        couponId = mongoose.Types.ObjectId(couponId);
        const coupon = await Coupon.findById(couponId);

        if (!coupon) {
            throw new HttpError('Coupon not found', 404);
        }

        return coupon;
    } catch (err) {
        // If the error is already an HttpError, throw it as-is
        if (err instanceof HttpError) {
            throw err;
        }
        // Otherwise, wrap it in a generic HttpError
        throw new HttpError(err.message, 500);
    }
};

/**
 * Updates a coupon with the given data.
 * @param {string} couponId - The ID of the coupon to update.
 * @param {object} data - The data to update the coupon with.
 * @param {string} data.code - The new code for the coupon.
 * @param {string} data.type - The new type for the coupon.
 * @param {number} data.discount - The new discount for the coupon.
 * @param {Date} data.fromDate - The new start date for the coupon.
 * @param {Date} data.toDate - The new end date for the coupon.
 * @param {string} data.status - The new status for the coupon.
 * @returns {Promise<object>} The updated coupon.
 */
const update = async (couponId, data) => {
    const {
        companyId,
        code,
        type,
        discount,
        discountType,
        fromDate,
        toDate,
        status
    } = data;

    // eslint-disable-next-line prefer-const
    let coupon = await find(couponId);
    coupon.code = code;
    coupon.type = type;
    coupon.discount = discount;
    coupon.fromDate = fromDate;
    coupon.toDate = toDate;
    coupon.status = status;
    coupon.discountType = discountType;
    coupon.companyId = companyId;
    coupon.updatedAt = Date.now();

    try {
        await coupon.save();
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    return coupon;
};

/**
 * Deletes a coupon by setting its deletedAt property to the current date and time.
 * @param {string} couponId - The ID of the coupon to be deleted.
 * @returns {Promise<boolean>} - A promise that resolves to true if the coupon is successfully deleted.
 * @throws {HttpError} - If an error occurs while deleting the coupon.
 */
const destroy = async couponId => {
    try {
        // Soft delete
        const coupon = await find(couponId);
        coupon.deletedAt = Date.now();
        await coupon.save();

        return true;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Counts the number of coupons for a given company.
 * @param {string} companyId - The ID of the company.
 * @returns {Promise<number>} The number of coupons.
 * @throws {HttpError} If an error occurs while counting the coupons.
 */
const count = async companyId => {
    try {
        const coupon = await Coupon.countDocuments({ companyId });

        return coupon;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Performs bulk actions on coupons.
 * @param {Object} data - The data containing the action and coupon IDs.
 * @param {string} data.action - The action to perform (delete, active, inactive, restore).
 * @param {Array<string>} data.couponIds - The IDs of the coupons to perform the action on.
 * @returns {Promise<Object>} - A promise that resolves to the updated coupon object(s).
 * @throws {HttpError} - If an error occurs during the bulk action.
 */
const bulkAction = async data => {
    const { action, couponIds } = data;

    try {
        let coupon;

        switch (action) {
        case 'delete':
            coupon = await Coupon.updateMany(
                { _id: { $in: couponIds } },
                { deletedAt: Date.now() }
            );
            break;
        case 'active':
            coupon = await Coupon.updateMany(
                { _id: { $in: couponIds } },
                { status: 'active' }
            );
            break;
        case 'inactive':
            coupon = await Coupon.updateMany(
                { _id: { $in: couponIds } },
                { status: 'inactive' }
            );
            break;
        case 'restore':
            coupon = await Coupon.updateMany(
                { _id: { $in: couponIds } },
                { deletedAt: null }
            );
            break;
        default:
            throw new HttpError('Invalid action', 400);
        }

        return coupon;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Applies a coupon to the cart.
 * @param {Object} req - The request object.
 * @param {string} req.body.sessionId - The session ID.
 * @param {string} req.body.couponCode - The coupon code.
 * @returns {Object} - The response object containing the status, message, and updated cart.
 * @throws {HttpError} - If the coupon code is invalid or the cart is not found.
 */
const applyCoupon = async req => {
    const { sessionId, couponCode } = req.body;

    // Get coupon by code
    const coupon = await Coupon.findOne({ code: couponCode, status: 'active' });

    if (!coupon) {
        throw new HttpError('Invalid coupon code', 400);
    }

    // Get cart by sessionId
    let cart = await Cart.findOne({ sessionId });

    if (!cart) {
        throw new HttpError('Cart not found', 404);
    }

    // Check if coupon is already applied and remove it
    if (cart.coupon) {
        cart.coupon = null;
        cart.discount = 0;
        cart.total = cart.total + cart.discount;
        await cart.save();
    }

    // Calculate discount
    const discount = coupon.discountType === 'percentage' ? (cart.total * coupon.discount) / 100 : coupon.discount;

    // Apply coupon
    cart.couponId = coupon._id;
    cart.discount = discount;
    cart.total = cart.total - discount;
    cart = await cart.save();

    const response = await CartService.findCart('sessionID', sessionId);

    return {
        status: 'success',
        message: 'Coupon applied successfully',
        cart: response.cart
    };
};

/**
 * Removes the coupon from the cart and updates the cart total and discount.
 * @param {Object} req - The request object containing the sessionId.
 * @returns {Object} - The response object with status, message, and updated cart.
 * @throws {HttpError} - If the cart is not found.
 */
const removeCoupon = async req => {
    const { sessionId } = req.body;

    // Get cart by sessionId
    let cart = await Cart.findOne({ sessionId });

    if (!cart) {
        throw new HttpError('Cart not found', 404);
    }

    // Remove coupon
    cart.coupon = null;
    cart.total = cart.total + cart.discount;
    cart.discount = 0;
    cart.couponId = null;
    cart = await cart.save();

    const response = await CartService.findCart('sessionID', sessionId);

    return {
        status: 'success',
        message: 'Coupon removed successfully',
        cart: response.cart
    };
};

export default {
    get,
    store,
    find,
    update,
    destroy,
    bulkAction,
    count,
    applyCoupon,
    removeCoupon
};
