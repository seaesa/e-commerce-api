import HttpError from '../../services/httpErrorService.js';
import TaxService from '../../services/dbServices/taxService.js';

/**
 * Get tax information.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the tax information.
 */
const get = async (req, res, next) => {
    try {
        const result = await TaxService.get(req);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Store a new tax in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the tax is stored successfully.
 * @throws {HttpError} - If there is an error while storing the tax.
 */
const store = async (req, res, next) => {
    try {
        const tax = await TaxService.store(req.body);

        const response = {
            status: 'success',
            message: 'Tax added successfully',
            data: {
                tax
            }
        };
        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Edit tax by taxId.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the tax is edited successfully.
 */
const edit = async (req, res, next) => {
    const taxId = req.params.taxId;

    try {
        const tax = await TaxService.find(taxId);

        const response = {
            status: 'success',
            message: 'Tax found successfully',
            data: {
                tax
            }
        };

        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Update a tax record.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the updated tax record.
 */
const update = async (req, res, next) => {
    const taxId = req.params.taxId;

    try {
        const tax = await TaxService.update(taxId, req.body);
        res.json({ status: 'success', message: 'Tax updated successfully', data: { tax } });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Deletes a tax record by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the tax is deleted successfully.
 * @throws {HttpError} - If there is an error while deleting the tax.
 */
const destroy = async (req, res, next) => {
    const taxId = req.params.taxId;

    try {
        await TaxService.destroy(taxId);
        res.json({ status: 'success', message: 'Tax deleted successfully' });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Counts the total number of taxes.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The JSON response containing the total number of taxes.
 */
const count = async (req, res, next) => {
    let totalTaxes;

    try {
        totalTaxes = await TaxService.count();
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }

    res.json({ totalTaxes });
};

/**
 * Restores a tax by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the tax is restored successfully.
 * @throws {HttpError} - If an error occurs during the restore process.
 */
const restore = async (req, res, next) => {
    const taxId = req.params.taxId;

    try {
        await TaxService.restore(taxId);
        res.json({ status: 'success', message: 'Tax restored successfully' });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

export default { get, store, edit, update, destroy, count, restore };
