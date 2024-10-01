import HttpError from '../../services/httpErrorService.js';
import CartService from '../../services/dbServices/cartService.js';

/**
 * Add an item to the cart.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the item is added to the cart.
 * @throws {HttpError} - If there is an error adding the item to the cart.
 */
const addToCart = async (req, res, next) => {
    try {
        const response = await CartService.addToCart(req.body);
        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Remove a product from the cart.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the product is removed from the cart.
 * @throws {HttpError} - If there is an error while removing the product from the cart.
 */
const removeFromCart = async (req, res, next) => {
    const sessionId = req.params.sessionId;
    const productId = req.query.productId;

    try {
        const response = await CartService.removeFromCart(sessionId, productId);
        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Decrements the quantity of an item in the cart.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the quantity is decremented successfully.
 * @throws {HttpError} - If there is an error while decrementing the quantity.
 */
const decrementQuantity = async (req, res, next) => {
    const sessionId = req.params.sessionId;

    try {
        const response = await CartService.decrementQuantity(sessionId, req.body);
        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Find a cart based on the given type and value.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the response JSON or rejects with an error.
 */
const findCart = async (req, res, next) => {
    const type = req.params.type;
    const value = req.params.value;

    try {
        const response = await CartService.findCart(type, value);
        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Saves the checkout data to the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the checkout data is saved.
 * @throws {HttpError} - If there is an error while saving the checkout data.
 */
const saveCheckoutData = async (req, res, next) => {
    try {
        const response = await CartService.saveCheckoutData(req);
        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

export default {
    addToCart,
    removeFromCart,
    decrementQuantity,
    findCart,
    saveCheckoutData
};
