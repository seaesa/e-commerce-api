import HttpError from '../../services/httpErrorService.js';
import CartService from '../../services/dbServices/cartService.js';

/**
 * Get cart by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the cart is retrieved.
 * @throws {HttpError} - If there is an error retrieving the cart.
 */
const getCartByID = async (req, res, next) => {
    try {
        const result = await CartService.get(req);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Retrieves the cart by session.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the cart data or rejects with an error.
 */
const getCartBySession = async (req, res, next) => {
    try {
        const result = await CartService.getBySession(req);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Updates the order ID for a cart.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the updated cart.
 * @throws {HttpError} - If there is an error updating the order ID.
 */
const updateOrderID = async (req, res, next) => {
    try {
        const result = await CartService.updateOrderID(req);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Empty the cart.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the cart is emptied.
 * @throws {HttpError} - If there is an error while emptying the cart.
 */
const emptyCart = async (req, res, next) => {
    try {
        const result = await CartService.empty(req);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Add an item to the cart.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the JSON result or rejects with an error.
 */
const addItem = async (req, res, next) => {
    try {
        const result = await CartService.store(req);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Removes an item from the cart.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the item is removed from the cart.
 * @throws {HttpError} - If there is an error while removing the item.
 */
const removeItem = async (req, res, next) => {
    try {
        const result = await CartService.destroy(req);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

export default {
    getCartByID,
    getCartBySession,
    updateOrderID,
    emptyCart,
    addItem,
    removeItem
};
