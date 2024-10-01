import HttpError from '../../services/httpErrorService.js';
import SubCategoryService from '../../services/dbServices/subCategoryService.js';

/**
 * Retrieves sub-categories based on the provided query parameters.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - Promise that resolves with the response object.
 */
const get = async (req, res, next) => {
    try {
        const response = await SubCategoryService.get(req);
        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Add a new sub-category.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {string} req.body.categoryId - The ID of the category to which the sub-category belongs.
 * @param {string} req.body.name - The name of the sub-category.
 * @param {string} req.body.status - The status of the sub-category.
 * @throws {HttpError} If there is an error while saving the sub-category.
 * @returns {Object} The newly created sub-category object.
 */
const store = async (req, res, next) => {
    try {
        const fileName = req.generatedFileName;
        const filePath = req.generatedFilePath;

        const response = await SubCategoryService.store(req.body, fileName, filePath);

        res.json({ status: 'success', message: 'Sub Category added successfully', data: response });
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Edit a subcategory by ID
 *
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {HttpError} If an error occurs while finding the subcategory
 * @returns {Object} JSON response containing the edited subcategory
 */
const edit = async (req, res, next) => {
    const subCategoryId = req.params.subCategoryId;

    try {
        const response = await SubCategoryService.find(subCategoryId);

        res.json({ status: 'success', message: 'Sub Category retrieved successfully', data: response });
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Updates a sub-category by ID.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - Promise that resolves with the updated sub-category object.
 * @throws {HttpError} - Throws an error if there was an issue updating the sub-category.
 */
const update = async (req, res, next) => {
    const fileName = req.generatedFileName;
    const filePath = req.generatedFilePath;

    try {
        const response = await SubCategoryService.update(req.params.subCategoryId, req.body, fileName, filePath);
        return res.json({ status: 'success', message: 'Sub Category updated successfully', data: response });
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Deletes a subcategory by ID.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {HttpError} If an error occurs while deleting the subcategory.
 * @returns {Object} The response object with a success message.
 */
const destroy = async (req, res, next) => {
    const subCategoryId = req.params.subCategoryId;

    try {
        await SubCategoryService.destroy(subCategoryId);
        return res.json({ status: 'success', message: 'Sub Category deleted successfully' });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Retrieves all subcategories for a given category ID.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {HttpError} If an error occurs while retrieving the subcategories.
 * @returns {Promise<void>} A Promise that resolves with the subcategories.
 */
const getSubCategoriesByCategoryId = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    let subCategories;

    try {
        subCategories = await SubCategoryService.findByCategoryId(categoryId);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }

    res.json(subCategories);
};

/**
 * Retrieves the total number of subcategories.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} - JSON response containing the total number of subcategories.
 * @throws {HttpError} - If an error occurs while retrieving the total number of subcategories.
 */
const count = async (req, res, next) => {
    let totalSubCategories;

    try {
        totalSubCategories = await SubCategoryService.count();
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }

    res.json({ totalSubCategories });
};

/**
 * Perform a bulk action on sub-categories.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the bulk action is completed.
 * @throws {HttpError} - If an error occurs during the bulk action.
 */
const bulkAction = async (req, res, next) => {
    try {
        await SubCategoryService.bulkAction(req.body);
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    res.json({ status: 'success', message: 'Sub Category updated successfully' });
};

export default { get, store, edit, update, destroy, getSubCategoriesByCategoryId, bulkAction, count };
