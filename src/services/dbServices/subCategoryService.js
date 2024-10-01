import HttpError from '../../services/httpErrorService.js';
import SubCategory from '../../models/subCategory-model.js';
import { ObjectId } from 'mongodb';

const DEFAULTS = {
    LIMIT: 10,
    STATUS: 'all',
    NAME: 'All'
};

/**
 * Retrieves subcategories based on query parameters.
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @returns {Promise<Object>} Object containing subcategories, total count, page number, and limit.
 * @throws {HttpError} 500 error if an error occurs while retrieving subcategories.
 */
const get = async (req) => {
    let subCategories;

    try {
        const page = parseInt(req.query.currentPage, 10) || 1;
        const limit = parseInt(req.query.itemPerPage, 10) || DEFAULTS.LIMIT;
        const searchText = req.query.search || '';
        const name = req.query.name || DEFAULTS.NAME;
        const status = req.query.status || DEFAULTS.STATUS;
        const startDate = req.query.start || '';
        const endDate = req.query.end || '';
        const sort = req.query.sort === 'asc' ? 1 : -1;

        // Define the filter object
        const filter = {
            $or: [
                { name: { $regex: searchText, $options: 'i' } },
                { 'category.name': { $regex: searchText, $options: 'i' } },
                {
                    $and: [
                        { status: { $regex: searchText, $options: 'i' } },
                        { deletedAt: { $eq: null } }
                    ]
                }
            ]
        };

        // filter status and name
        if (status !== DEFAULTS.STATUS) {
            filter.status = status;
            filter.deletedAt = null;
        }

        if (name !== DEFAULTS.NAME) {
            filter.name = name;
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
            const pipeline = [
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'categoryId',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $unwind: '$category' // Unwind the 'category' array
                },
                {
                    $match: filter
                }
            ];

            return SubCategory.aggregate(pipeline);
        };

        subCategories = await getBaseAggregation()
            .sort({ name: sort })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const total = await SubCategory.countDocuments(filter);

        return {
            status: 'success',
            total,
            page,
            limit,
            subCategories
        };
    } catch (err) {
        throw new HttpError(err, 500);
    }
};

/**
 * Stores a new subcategory in the database.
 * @param {Object} data - The data for the new subcategory.
 * @param {string} data.categoryId - The ID of the category to which the subcategory belongs.
 * @param {string} data.name - The name of the subcategory.
 * @param {string} data.status - The status of the subcategory.
 * @returns {Promise<Object>} - The newly created subcategory object.
 * @throws {HttpError} - If there is an error while saving the subcategory.
 */
const store = async (data, fileName, filePath) => {
    const { categoryId, name, status, slug } = data;
    const newSubCategory = new SubCategory({ categoryId, name, status, slug, imageName: fileName, imagePath: process.env.APP_ENV === 'locale' ? filePath : process.env.LIVE_IMAGE_URL, createdAt: Date.now() });

    try {
        await newSubCategory.save();
        return { subCategory: newSubCategory };
    } catch (err) {
        throw new HttpError(err, 500);
    }
};

/**
 * Finds a subcategory by its ID.
 * @param {string} subCategoryId - The ID of the subcategory to find.
 * @returns {Promise<{subCategory: Object}>} - The subcategory object.
 * @throws {HttpError} - If there's an error while finding the subcategory.
 */
const find = async (subCategoryId) => {
    try {
        let subCategory = await SubCategory.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category' // Unwind the 'category' array
            },
            {
                $match: {
                    _id: new ObjectId(subCategoryId) // Assuming _id is the field you want to match with subCategoryId
                }
            },
            {
                $limit: 1
            }
        ]).exec();

        subCategory = subCategory[0];

        return { subCategory };
    } catch (err) {
        throw new HttpError(err, 500);
    }
};

/**
 * Finds subcategories by category ID.
 *
 * @param {string} categoryId - The ID of the category to searchText for.
 * @returns {Promise<{subCategory: Array}>} - A promise that resolves to an object containing an array of subcategories.
 */
const findByCategoryId = async (categoryId) => {
    categoryId = new ObjectId(categoryId);

    try {
        const subCategories = await SubCategory.find({ categoryId });
        return { subCategories };
    } catch (err) {
        throw new HttpError(err, 500);
    }
};

/**
 * Updates a subcategory with the given subCategoryId and data.
 * @param {string} subCategoryId - The ID of the subcategory to update.
 * @param {Object} data - The data to update the subcategory with.
 * @param {string} data.categoryId - The ID of the category the subcategory belongs to.
 * @param {string} data.name - The name of the subcategory.
 * @param {string} data.status - The status of the subcategory.
 * @returns {Promise<{subCategory: Object}>} - The updated subcategory object.
 * @throws {HttpError} - If there was an error updating the subcategory.
 */
const update = async (subCategoryId, data, fileName, filePath) => {
    const { categoryId, name, status, slug } = data;

    let subCategory;

    try {
        subCategory = await SubCategory.findById(subCategoryId);
    } catch (err) {
        throw new HttpError(err, 500);
    }

    subCategory.categoryId = categoryId;
    subCategory.name = name;
    subCategory.status = status;
    subCategory.slug = slug;
    if (fileName && filePath) {
        subCategory.imageName = fileName;
        subCategory.imagePath = process.env.APP_ENV === 'locale' ? filePath : process.env.LIVE_IMAGE_URL;
    }
    subCategory.updatedAt = Date.now();

    try {
        await subCategory.save();
        return { subCategory };
    } catch (err) {
        throw new HttpError(err, 500);
    }
};

/**
 * Deletes a subcategory from the database.
 * @param {string} subCategoryId - The ID of the subcategory to be deleted.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the subcategory was deleted successfully.
 * @throws {HttpError} - If there was an error deleting the subcategory.
 */
const destroy = async (subCategoryId) => {
    subCategoryId = new ObjectId(subCategoryId);

    // Soft delete
    try {
        const data = await SubCategory.findById(subCategoryId);
        data.deletedAt = Date.now();
        await data.save();

        return true;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Counts the total number of subcategories in the database.
 * @returns {Promise<number>} The total number of subcategories.
 * @throws {HttpError} If there's an error while counting the subcategories.
 */
const count = async () => {
    let totalSubCategories = 0;

    try {
        // Count total categories
        totalSubCategories = await SubCategory.countDocuments();
    } catch (err) {
        throw new HttpError(err, 500);
    }

    return totalSubCategories;
};

/**
 * Performs bulk actions on subcategories.
 * @param {Object} data - The data object containing the action and subcategory IDs.
 * @param {string} data.action - The action to perform (delete, active, inactive, restore).
 * @param {Array<string>} data.subCategoryId - The IDs of the subcategories to perform the action on.
 * @returns {Promise<Object>} - A promise that resolves to the updated subcategories.
 * @throws {HttpError} - If an error occurs during the bulk action.
 */
const bulkAction = async (data) => {
    const { action, subCategoryIds } = data;

    try {
        let subcategory;

        switch (action) {
        case 'delete':
            subcategory = await SubCategory.updateMany(
                { _id: { $in: subCategoryIds } },
                { deletedAt: Date.now() }
            );
            break;
        case 'active':
            subcategory = await SubCategory.updateMany(
                { _id: { $in: subCategoryIds } },
                { status: 'active' }
            );
            break;
        case 'inactive':
            subcategory = await SubCategory.updateMany(
                { _id: { $in: subCategoryIds } },
                { status: 'inactive' }
            );
            break;
        case 'restore':
            subcategory = await SubCategory.updateMany(
                { _id: { $in: subCategoryIds } },
                { deletedAt: null }
            );
            break;
        default:
            throw new HttpError('Invalid action', 400);
        }

        return subcategory;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

export default { get, store, find, update, destroy, findByCategoryId, bulkAction, count };
