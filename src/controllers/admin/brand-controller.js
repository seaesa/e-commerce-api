import HttpError from '../../services/httpErrorService.js';
import BrandService from '../../services/dbServices/brandService.js';

/**
 * Retrieves a list of brands based on the query parameters.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - Promise that resolves with the response object.
 * @throws {HttpError} - Throws an error if there was an issue retrieving the brands.
 */
const get = async (req, res, next) => {
    try {
        const brands = await BrandService.get(req);
        res.json(brands);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Add a new brand to the database.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - Promise that resolves with the new brand object.
 * @throws {HttpError} - Throws an error if there was a problem saving the brand to the database.
 */
const store = async (req, res, next) => {
    try {
        const fileName = req.generatedFileName;
        const filePath = req.generatedFilePath;

        const brand = await BrandService.store(req.body, fileName, filePath);
        res.json({ status: 'success', message: 'Brand added successfully', data: brand });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Edit a brand by ID
 *
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {HttpError} If an error occurs while fetching the brand
 * @returns {Object} JSON response containing the edited brand
 */
const edit = async (req, res, next) => {
    const brandId = req.params.brandId;

    try {
        const brand = await BrandService.find(brandId);
        res.json({ status: 'success', message: 'Brand retrieved successfully', data: brand });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Updates a brand with the given brandId in the database.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {HttpError} Will throw an error if there is an issue finding or saving the brand.
 * @returns {Object} Returns a JSON object containing the updated brand.
 */
const update = async (req, res, next) => {
    try {
        const fileName = req.generatedFileName;
        const filePath = req.generatedFilePath;
        const result = await BrandService.update(req.params.brandId, req.body, fileName, filePath);
        res.json({ status: 'success', message: 'Brand updated successfully', data: result });
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Deletes a brand with the specified ID.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {HttpError} If an error occurs while deleting the brand.
 * @returns {Object} The response object with a success message.
 */
const destroy = async (req, res, next) => {
    try {
        await BrandService.destroy(req.params.brandId);
        res.json({ status: 'success', message: 'Brand deleted successfully' });
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Retrieves a brand by its slug.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} - JSON response containing the retrieved brand.
 * @throws {HttpError} - If an error occurs while retrieving the brand.
 */
const findBySlug = async (req, res, next) => {
    const slug = req.params.slug;

    try {
        const brand = await BrandService.findBySlug(slug);
        res.json({ status: 'success', message: 'Brand retrieved successfully', data: brand });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Counts the total number of brands.
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The total number of brands.
 */
const count = async (req, res, next) => {
    let totalbrands = 0;

    try {
        totalbrands = await BrandService.count();
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }

    res.json({ totalbrands });
};

/**
 * Performs a bulk action on brands.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the bulk action is completed.
 * @throws {HttpError} - If an error occurs during the bulk action.
 */
const bulkAction = async (req, res, next) => {
    try {
        await BrandService.bulkAction(req.body);
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    res.json({ status: 'success', message: 'Brands updated successfully' });
};

export default { get, store, edit, update, destroy, findBySlug, bulkAction, count };
