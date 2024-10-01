import HttpError from '../../services/httpErrorService.js';
import OrderService from '../../services/dbServices/orderService.js';

/**
 * Get order information.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the order information.
 */
const get = async (req, res, next) => {
    try {
        const result = await OrderService.get(req);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Edit order by productId.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the order is edited successfully.
 */
const edit = async (req, res, next) => {
    const orderId = req.params.orderId;

    try {
        const order = await OrderService.find(orderId);

        const response = {
            status: 'success',
            message: 'Order found successfully',
            data: {
                order
            }
        };

        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Update a order record.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the updated order record.
 */
const update = async (req, res, next) => {
    const productId = req.params.productId;

    try {
        const order = await OrderService.update(productId, req.body);
        res.json({ status: 'success', message: 'Order updated successfully', data: { order } });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Deletes a order record by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the order is deleted successfully.
 * @throws {HttpError} - If there is an error while deleting the order.
 */
const destroy = async (req, res, next) => {
    const productId = req.params.productId;

    try {
        await OrderService.destroy(productId);
        res.json({ status: 'success', message: 'Order deleted successfully' });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Counts the total number of orders.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The JSON response containing the total number of orders.
 */
const count = async (req, res, next) => {
    let totalProducts;

    try {
        totalProducts = await OrderService.count();
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }

    res.json({ totalProducts });
};

/**
 * Performs a bulk action on orders.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the bulk action is completed.
 * @throws {HttpError} - If an error occurs during the bulk action.
 */
const bulkAction = async (req, res, next) => {
    try {
        await OrderService.bulkAction(req.body);
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    res.json({ status: 'success', message: 'Order updated successfully' });
};

/**
 * Place an order.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the result of placing the order.
 * @throws {HttpError} - If there is an error while placing the order.
 */
const store = async (req, res, next) => {
    try {
        const result = await OrderService.store(req);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

const download = async (req, res, next) => {
    try {
        const result = await OrderService.download(req);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

export default { get, store, edit, update, destroy, bulkAction, count, download };
