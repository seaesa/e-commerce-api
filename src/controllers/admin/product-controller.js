import HttpError from '../../services/httpErrorService.js';
import ProductService from '../../services/dbServices/productService.js';

/**
 * Get product information.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the product information.
 */
const get = async (req, res, next) => {
    try {
        const result = await ProductService.get(req);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Store a new product in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the product is stored successfully.
 * @throws {HttpError} - If there is an error while storing the product.
 */
const store = async (req, res, next) => {
    try {
        const product = await ProductService.store(req.body);

        const response = {
            status: 'success',
            message: 'Product added successfully',
            data: {
                product
            }
        };
        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Edit product by productId.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the product is edited successfully.
 */
const edit = async (req, res, next) => {
    const productId = req.params.productId;

    try {
        const product = await ProductService.find(productId);

        const response = {
            status: 'success',
            message: 'Product found successfully',
            data: {
                product
            }
        };

        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Update a product record.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the updated product record.
 */
const update = async (req, res, next) => {
    const productId = req.params.productId;

    try {
        const product = await ProductService.update(productId, req.body);
        res.json({ status: 'success', message: 'Product updated successfully', data: { product } });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Deletes a product record by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the product is deleted successfully.
 * @throws {HttpError} - If there is an error while deleting the product.
 */
const destroy = async (req, res, next) => {
    const productId = req.params.productId;

    try {
        await ProductService.destroy(productId);
        res.json({ status: 'success', message: 'Product deleted successfully' });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Counts the total number of products.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The JSON response containing the total number of products.
 */
const count = async (req, res, next) => {
    let totalProducts;

    try {
        totalProducts = await ProductService.count();
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }

    res.json({ totalProducts });
};

/**
 * Performs a bulk action on products.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the bulk action is completed.
 * @throws {HttpError} - If an error occurs during the bulk action.
 */
const bulkAction = async (req, res, next) => {
    try {
        await ProductService.bulkAction(req.body);
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    res.json({ status: 'success', message: 'Product updated successfully' });
};

/**
 * Get product by slug.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the JSON response or rejects with an error.
 */
const getByProductSlug = async (req, res, next) => {
    try {
        const result = await ProductService.getByProductSlug(req.params.slug);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Retrieves the featured products.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the JSON response or rejects with an error.
 */
const getFeaturedProducts = async (req, res, next) => {
    try {
        const result = await ProductService.getFeaturedProducts();
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Retrieves products by category slug.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the products are retrieved.
 * @throws {HttpError} - If there is an error retrieving the products.
 */
const getProductsByCategorySlug = async (req, res, next) => {
    try {
        const result = await ProductService.getProductsByCategorySlug(req.params.slug);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Retrieves products and their categories.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the JSON response or rejects with an error.
 */
const getProductsAndItsCategory = async (req, res, next) => {
    try {
        const result = await ProductService.getProductsAndItsCategory();
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

export default { get, store, edit, update, destroy, bulkAction, count, getByProductSlug, getFeaturedProducts, getProductsByCategorySlug, getProductsAndItsCategory };
