import HttpError from '../../services/httpErrorService.js';
import mongoose from 'mongoose';
import Tax from '../../models/tax-model.js';
import { ObjectId } from 'mongodb';

const DEFAULTS = {
    LIMIT: 10,
    SORT: 'name',
    STATUS: 'All',
    NAME: 'All'
};

/**
 * Retrieves taxes based on the provided request parameters.
 * @param {Object} req - The request object.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the retrieved taxes.
 * @throws {HttpError} - If an error occurs while retrieving the taxes.
 */
const get = async (req) => {
    let taxes;

    try {
        const page = parseInt(req.query.page, 10) - 1 || 0;
        const limit = parseInt(req.query.limit, 10) || DEFAULTS.LIMIT;
        const search = req.query.search || '';
        const sort = req.query.sort || DEFAULTS.SORT;
        const name = req.query.name || DEFAULTS.NAME;
        const status = req.query.status || DEFAULTS.STATUS;

        const getBaseAggregation = () => {
            return Tax.find({ name: { $regex: search, $options: 'i' } })
                .where(name !== DEFAULTS.NAME ? { name } : {})
                .where(status !== DEFAULTS.STATUS ? { status } : {});
        };

        taxes = await getBaseAggregation()
            .skip(page * limit)
            .limit(limit)
            .sort({ [sort]: 1 })
            .exec();

        const total = await getBaseAggregation().countDocuments();

        return {
            status: 'success',
            total,
            page: page + 1,
            limit,
            taxes
        };
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Stores a new tax record in the database.
 * @param {Object} data - The data for the tax record.
 * @param {string} data.companyId - The ID of the company associated with the tax.
 * @param {string} data.name - The name of the tax.
 * @param {number} data.rate - The tax rate.
 * @param {string} data.status - The status of the tax.
 * @returns {Promise<Object>} - The newly created tax record.
 * @throws {HttpError} - If there is an error while saving the tax record.
 */
const store = async (data) => {
    const { companyId, name, rate, status } = data;

    const tax = new Tax({
        companyId, name, rate, status, createdAt: Date.now()
    });

    try {
        await tax.save();
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    return tax;
};

/**
 * Finds a tax by its ID.
 * @param {string} taxId - The ID of the tax to find.
 * @returns {Promise<Object>} - The found tax object.
 * @throws {HttpError} - If the tax ID is invalid, tax is not found, or an internal server error occurs.
 */
const find = async (taxId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(taxId)) {
            throw new HttpError('Invalid Tax ID format', 400);
        }

        taxId = mongoose.Types.ObjectId(taxId);
        const tax = await Tax.findById(taxId);

        if (!tax) {
            throw new HttpError('Tax not found', 404);
        }

        return tax;
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
 * Updates a tax record in the database.
 * @param {string} taxId - The ID of the tax record to update.
 * @param {object} data - The updated data for the tax record.
 * @param {string} data.name - The updated name for the tax record.
 * @param {number} data.rate - The updated tax rate for the tax record.
 * @param {string} data.status - The updated status for the tax record.
 * @returns {Promise<object>} - The updated tax record.
 * @throws {HttpError} - If there is an error while saving the updated tax record.
 */
const update = async (taxId, data) => {
    const { name, rate, status } = data;

    // eslint-disable-next-line prefer-const
    let tax = await find(taxId);
    tax.name = name || tax.name;
    tax.rate = rate || tax.rate;
    tax.status = status || tax.status;
    tax.updatedAt = Date.now();

    try {
        await tax.save();
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    return tax;
};

/**
 * Soft deletes a tax record.
 * @param {string} taxId - The ID of the tax record to be deleted.
 * @returns {Promise<boolean>} - A promise that resolves to true if the tax record is successfully deleted.
 * @throws {HttpError} - If an error occurs during the deletion process.
 */
const destroy = async (taxId) => {
    taxId = new ObjectId(taxId);

    // Soft delete
    try {
        const tax = await Tax.findById(taxId);
        tax.deletedAt = Date.now();
        await tax.save();
        return true;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Counts the number of tax documents for a given company.
 * @param {string} companyId - The ID of the company.
 * @returns {Promise<number>} - The count of tax documents.
 * @throws {HttpError} - If an error occurs while counting the documents.
 */
const count = async (companyId) => {
    try {
        const count = await Tax.countDocuments({ companyId });

        return count;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Restores a tax record by setting the deletedAt property to null.
 * @param {string} taxId - The ID of the tax record to restore.
 * @returns {Promise<boolean>} - A promise that resolves to true if the tax record is successfully restored, or rejects with an HttpError if an error occurs.
 */
const restore = async (taxId) => {
    taxId = new ObjectId(taxId);

    try {
        const tax = await Tax.findById(taxId);
        tax.deletedAt = null;
        await tax.save();
        return true;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

export default { get, store, find, update, destroy, count, restore };
