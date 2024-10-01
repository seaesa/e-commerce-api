import HttpError from '../../services/httpErrorService.js';
import mongoose from 'mongoose';
import Brand from '../../models/brand-model.js';

const DEFAULTS = {
    LIMIT: 10,
    STATUS: 'all',
    NAME: 'All'
};

/**
 * Retrieves a list of brands based on the provided query parameters.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @returns {Promise<Object>} - The object containing the brands, total count, page number, and limit.
 * @throws {HttpError} - If there is an error while retrieving the brands.
 */
const get = async (req) => {
    let brands;

    try {
        const page = parseInt(req.query.currentPage, 10) || 1;
        const limit = parseInt(req.query.itemPerPage, 10) || DEFAULTS.LIMIT;
        const searchText = req.query.search || '';
        const status = req.query.status || DEFAULTS.STATUS;
        const startDate = req.query.start || '';
        const endDate = req.query.end || '';
        const sort = req.query.sort === 'asc' ? 1 : -1;

        const filter = {
            $or: [
                { name: { $regex: searchText, $options: 'i' } },
                {
                    $and: [
                        { status: { $regex: searchText, $options: 'i' } },
                        { deletedAt: { $eq: null } }
                    ]
                }
            ]
        };

        if (status !== DEFAULTS.STATUS) {
            filter.status = status;
            filter.deletedAt = null;
        }

        const regex = /\b[dD](e(l(et?)?)?|l(et?)?|l)\b/i;
        // SearchText deleted data
        if (regex.test(searchText)) {
            filter.$or.push({ deletedAt: { $ne: null } });
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
            return Brand.find(filter);
        };

        brands = await getBaseAggregation()
            .sort({ name: sort })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const total = await getBaseAggregation().countDocuments(filter);

        return {
            status: 'success',
            total,
            page,
            limit,
            brands
        };
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Stores a new brand in the database.
 * @param {Object} data - The data for the new brand.
 * @param {string} data.name - The name of the brand.
 * @param {string} data.status - The status of the brand.
 * @returns {Promise<Object>} - The newly created brand object.
 * @throws {HttpError} - If there was an error saving the brand to the database.
 */
const store = async (data, fileName, filePath) => {
    const { companyId, name, status, slug } = data;

    const brand = new Brand({ companyId, name, status, slug, imageName: fileName, imagePath: process.env.APP_ENV === 'locale' ? filePath : process.env.LIVE_IMAGE_URL, createdAt: Date.now() });

    try {
        await brand.save();
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    return brand;
};

/**
 * Finds a brand by its ID.
 * @param {string} brandId - The ID of the brand to find.
 * @returns {Promise<Brand>} A promise that resolves with the found brand.
 * @throws {HttpError} If the brand ID is invalid or the brand is not found.
 */
const find = async (brandId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(brandId)) {
            throw new HttpError('Invalid Brand ID format', 400);
        }

        brandId = mongoose.Types.ObjectId(brandId);
        const brand = await Brand.findById(brandId);

        if (!brand) {
            throw new HttpError('Brand not found', 404);
        }

        return brand;
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
 * Updates a brand with the given brandId and data.
 *
 * @param {string} brandId - The ID of the brand to update.
 * @param {object} data - The data to update the brand with.
 * @param {string} data.name - The new name of the brand.
 * @param {string} data.status - The new status of the brand.
 * @returns {Promise<object>} - The updated brand object.
 * @throws {HttpError} - If there was an error while saving the brand.
 */
const update = async (brandId, data, fileName, filePath) => {
    const { companyId, name, status, slug } = data;
    // console.log(fileName, filePath);

    // eslint-disable-next-line prefer-const
    let brand = await find(brandId);
    brand.name = name;
    brand.status = status;
    brand.companyId = companyId;
    brand.slug = slug;
    if (fileName && filePath) {
        brand.imageName = fileName;
        brand.imagePath = process.env.APP_ENV === 'locale' ? filePath : process.env.LIVE_IMAGE_URL;
    }
    brand.updatedAt = Date.now();

    try {
        await brand.save();
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    return brand;
};

/**
 * Deletes a brand from the database.
 * @param {string} brandId - The ID of the brand to delete.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the brand was successfully deleted.
 * @throws {HttpError} - If there was an error deleting the brand.
 */
const destroy = async (brandId) => {
    // Soft delete
    try {
        const brand = await find(brandId);
        brand.deletedAt = Date.now();
        await brand.save();

        return true;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Counts the number of brands associated with a given company.
 *
 * @param {string} companyId - The ID of the company.
 * @returns {Promise<number>} The number of brands associated with the company.
 * @throws {HttpError} If an error occurs while counting the brands.
 */
const count = async (companyId) => {
    try {
        const brand = await Brand.countDocuments({ companyId });

        return brand;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Bulk action for deleting multiple categories, change status of multiple categories, etc.
 * @param {Object} data - The data object containing the action and brandIds.
 * @param {string} data.action - The action to perform (delete, active, inactive, restore).
 * @param {Array<string>} data.brandIds - The array of brand IDs to perform the action on.
 * @returns {Promise<Object>} - A promise that resolves to the updated brand object.
 * @throws {HttpError} - If an error occurs during the bulk action.
 */
const bulkAction = async (data) => {
    const { action, brandIds } = data;

    try {
        let brand;

        switch (action) {
        case 'delete':
            brand = await Brand.updateMany(
                { _id: { $in: brandIds } },
                { deletedAt: Date.now() }
            );
            break;
        case 'active':
            brand = await Brand.updateMany(
                { _id: { $in: brandIds } },
                { status: 'active' }
            );
            break;
        case 'inactive':
            brand = await Brand.updateMany(
                { _id: { $in: brandIds } },
                { status: 'inactive' }
            );
            break;
        case 'restore':
            brand = await Brand.updateMany(
                { _id: { $in: brandIds } },
                { deletedAt: null }
            );
            break;
        default:
            throw new HttpError('Invalid action', 400);
        }

        return brand;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

export default { get, store, find, update, destroy, bulkAction, count };
