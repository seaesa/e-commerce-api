import HttpError from '../../services/httpErrorService.js';
import mongoose from 'mongoose';
import Category from '../../models/category-model.js';

const DEFAULTS = {
    LIMIT: 10,
    STATUS: 'all',
    NAME: 'All'
};

/**
 * Retrieves a list of categories based on the provided query parameters.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @returns {Promise<Object>} - The object containing the categories, total count, page number, and limit.
 * @throws {HttpError} - If there is an error while retrieving the categories.
 */
const get = async (req) => {
    let categories;

    try {
        const page = parseInt(req.query.currentPage, 10) || 1;
        const limit = parseInt(req.query.itemPerPage, 10) || DEFAULTS.LIMIT;
        const searchText = req.query.search || '';
        const name = req.query.name || DEFAULTS.NAME;
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

        if (name !== DEFAULTS.NAME) {
            filter.name = name;
        }

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
            return Category.find(filter);
        };

        categories = await getBaseAggregation()
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
            categories
        };
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Stores a new category in the database.
 * @param {Object} data - The data for the new category.
 * @param {string} data.name - The name of the category.
 * @param {string} data.status - The status of the category.
 * @returns {Promise<Object>} - The newly created category object.
 * @throws {HttpError} - If there was an error saving the category to the database.
 */
const store = async (data, fileName, filePath) => {
    const { companyId, name, status, slug } = data;

    const category = new Category({ companyId, name, status, slug, imageName: fileName, imagePath: process.env.APP_ENV === 'locale' ? filePath : process.env.LIVE_IMAGE_URL, createdAt: Date.now() });

    try {
        await category.save();
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    return category;
};

/**
 * Finds a category by its ID.
 * @param {string} categoryId - The ID of the category to find.
 * @returns {Promise<Category>} A promise that resolves with the found category.
 * @throws {HttpError} If the category ID is invalid or the category is not found.
 */
const find = async (categoryId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            throw new HttpError('Invalid Category ID format', 400);
        }

        categoryId = mongoose.Types.ObjectId(categoryId);
        const category = await Category.findById(categoryId);

        if (!category) {
            throw new HttpError('Category not found', 404);
        }

        return category;
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
 * Updates a category with the given categoryId and data.
 *
 * @param {string} categoryId - The ID of the category to update.
 * @param {object} data - The data to update the category with.
 * @param {string} data.name - The new name of the category.
 * @param {string} data.status - The new status of the category.
 * @returns {Promise<object>} - The updated category object.
 * @throws {HttpError} - If there was an error while saving the category.
 */
const update = async (categoryId, data, fileName, filePath) => {
    const { companyId, name, status, slug } = data;
    // eslint-disable-next-line prefer-const
    let category = await find(categoryId);
    category.companyId = companyId;
    category.name = name;
    category.status = status;
    category.slug = slug;
    if (fileName && filePath) {
        category.imageName = fileName;
        category.imagePath = process.env.APP_ENV === 'locale' ? filePath : process.env.LIVE_IMAGE_URL;
    }
    category.updatedAt = Date.now();

    try {
        await category.save();
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    return category;
};

/**
 * Deletes a category from the database.
 * @param {string} categoryId - The ID of the category to delete.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the category was successfully deleted.
 * @throws {HttpError} - If there was an error deleting the category.
 */
const destroy = async (categoryId) => {
    // Soft delete
    try {
        const category = await find(categoryId);
        category.deletedAt = Date.now();
        await category.save();

        return true;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Counts the number of categories for a given company.
 * @param {string} companyId - The ID of the company.
 * @returns {Promise<number>} The number of categories.
 * @throws {HttpError} If an error occurs while counting the categories.
 */
const count = async (companyId) => {
    try {
        const category = await Category.countDocuments({ companyId });

        return category;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Bulk action for deleting multiple categories, change status of multiple categories, etc.
 * @param {Object} data - The data object containing the action and categoryIds.
 * @param {string} data.action - The action to perform (delete, active, inactive, restore).
 * @param {Array<string>} data.categoryIds - The array of category IDs to perform the action on.
 * @returns {Promise<Object>} - A promise that resolves to the updated category object(s).
 * @throws {HttpError} - If an error occurs during the bulk action process.
 */
const bulkAction = async (data) => {
    const { action, categoryIds } = data;

    try {
        let category;

        switch (action) {
        case 'delete':
            category = await Category.updateMany(
                { _id: { $in: categoryIds } },
                { deletedAt: Date.now() }
            );
            break;
        case 'active':
            category = await Category.updateMany(
                { _id: { $in: categoryIds } },
                { status: 'active' }
            );
            break;
        case 'inactive':
            category = await Category.updateMany(
                { _id: { $in: categoryIds } },
                { status: 'inactive' }
            );
            break;
        case 'restore':
            category = await Category.updateMany(
                { _id: { $in: categoryIds } },
                { deletedAt: null }
            );
            break;
        default:
            throw new HttpError('Invalid action', 400);
        }

        return category;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Retrieves a category by its slug and populates it with associated products, subcategories, and brands.
 * @param {string} slug - The slug of the category to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the retrieved category object.
 * @throws {HttpError} - If there is an error while retrieving the category.
 */
const getByCategorySlug = async (slug) => {
    try {
        const category = await Category.aggregate([
            {
                $match: {
                    slug // Assuming categorySlug is the slug of the category you're querying
                }
            },
            {
                $lookup: {
                    from: 'products',
                    let: { categoryId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$categoryId', '$$categoryId'] }
                            }
                        },
                        {
                            $lookup: {
                                from: 'subcategories',
                                localField: 'subcategoryId',
                                foreignField: '_id',
                                as: 'subcategory'
                            }
                        },
                        {
                            $lookup: {
                                from: 'brands',
                                localField: 'brandId',
                                foreignField: '_id',
                                as: 'brand'
                            }
                        }
                    ],
                    as: 'products'
                }
            }
        ]);

        return category[0];
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Retrieves categories and their associated products from the database.
 * @returns {Promise<Array>} An array of categories with their associated products.
 * @throws {HttpError} If there is an error retrieving the data from the database.
 */
const getCategoriesAndItsProducts = async () => {
    try {
        const categories = await Category.aggregate([
            {
                $lookup: {
                    from: 'products',
                    let: { categoryId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$categoryId', '$$categoryId'] }
                            }
                        }
                    ],
                    as: 'products'
                }
            }
        ]);

        return categories;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

export default { get, store, find, update, destroy, bulkAction, count, getByCategorySlug, getCategoriesAndItsProducts };
