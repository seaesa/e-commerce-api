import HttpError from '../../services/httpErrorService.js';
import CategoryService from '../../services/dbServices/categoryService.js';

/**
 * Retrieves a list of categories based on the provided query parameters.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves with the response object.
 */
const get = async (req, res, next) => {
    try {
        const result = await CategoryService.get(req);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Adds a new category to the database.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @param {string} req.body.name - The name of the category.
 * @param {string} req.body.status - The status of the category.
 * @throws {HttpError} If there was an error saving the category to the database.
 * @returns {Object} The newly created category object.
 */
const store = async (req, res, next) => {
    try {
        const fileName = req.generatedFileName;
        const filePath = req.generatedFilePath;
        const category = await CategoryService.store(req.body, fileName, filePath);

        const response = {
            status: 'success',
            message: 'Category added successfully.',
            data: {
                category
            }
        };
        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Edit a category by ID.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @throws {HttpError} If an error occurs while finding the category.
 * @returns {Object} JSON object containing the edited category.
 */
const edit = async (req, res, next) => {
    const categoryId = req.params.categoryId;

    try {
        const category = await CategoryService.find(categoryId);

        const response = {
            status: 'success',
            message: 'Category found successfully',
            data: {
                category
            }
        };

        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Updates a category by ID.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {HttpError} If an error occurs while updating the category.
 * @returns {Object} The updated category.
 */
const update = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    const fileName = req.generatedFileName;
    const filePath = req.generatedFilePath;

    try {
        const category = await CategoryService.update(categoryId, req.body, fileName, filePath);
        res.json({ status: 'success', message: 'Category updated successfully', data: { category } });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Deletes a category by ID.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @throws {HttpError} If an error occurs while deleting the category.
 * @returns {Object} JSON response indicating success.
 */
const destroy = async (req, res, next) => {
    const categoryId = req.params.categoryId;

    try {
        await CategoryService.destroy(categoryId);
        res.json({ status: 'success', message: 'Category deleted successfully' });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Retrieves the total number of categories in the database.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} - JSON response containing the total number of categories.
 * @throws {HttpError} - If there was an error retrieving the total number of categories.
 */
const count = async (req, res, next) => {
    let totalCategories;

    try {
        totalCategories = await CategoryService.countDocuments();
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }

    res.json({ totalCategories });
};

/**
 * Bulk action for deleting multiple categories, change status of multiple categories, etc.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the bulk action is completed.
 * @throws {HttpError} - If an error occurs during the bulk action.
 */
const bulkAction = async (req, res, next) => {
    try {
        await CategoryService.bulkAction(req.body);
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    res.json({ status: 'success', message: 'Categories updated successfully' });
};

/**
 * Get category by category slug.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the JSON response.
 * @throws {HttpError} - If there is an error while fetching the category.
 */
const getByCategorySlug = async (req, res, next) => {
    try {
        const result = await CategoryService.getByCategorySlug(req.query.slug);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Retrieves categories and their associated products.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the JSON response or rejects with an error.
 */
const getCategoriesAndItsProducts = async (req, res, next) => {
    try {
        const result = await CategoryService.getCategoriesAndItsProducts();
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

export default { get, store, edit, update, destroy, bulkAction, count, getByCategorySlug, getCategoriesAndItsProducts };
