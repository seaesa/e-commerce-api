import HttpError from '../../services/httpErrorService.js';
import User from '../../models/user-model.js';
import mongoose from 'mongoose';

const DEFAULTS = {
    LIMIT: 10,
    STATUS: 'all',
    NAME: 'All'
};

/**
 * Retrieves a list of users based on the provided query parameters.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @returns {Promise<Object>} - The response object containing the list of users, total count, page number, and limit.
 * @throws {HttpError} - If there was an error while retrieving the users.
 */
const get = async (req) => {
    let users;

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
                { email: { $regex: searchText, $options: 'i' } },
                { employeeId: { $regex: searchText, $options: 'i' } },
                { role: { $regex: searchText, $options: 'i' } },
                {
                    $and: [
                        { status: { $regex: searchText, $options: 'i' } },
                        { deletedAt: { $eq: null } }
                    ]
                },
                { 'company.name': { $regex: searchText, $options: 'i' } }
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
            const pipeline = [
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'companyId',
                        foreignField: '_id',
                        as: 'company'
                    }
                },
                {
                    $unwind: '$company' // Unwind the 'category' array
                },
                {
                    $match: filter
                }
            ];

            return User.aggregate(pipeline);
        };

        users = await getBaseAggregation()
            .sort({ name: sort })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const total = await User.countDocuments(filter);

        return {
            status: 'success',
            total,
            page,
            limit,
            users
        };
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Stores a new user in the database.
 * @param {Object} data - The user data to be stored.
 * @param {string} data.name - The name of the user.
 * @param {string} data.email - The email of the user.
 * @param {string} data.password - The password of the user.
 * @param {string} data.dob - The date of birth of the user.
 * @param {string} data.gender - The gender of the user.
 * @param {string} data.address - The address of the user.
 * @param {string} data.mobile - The mobile number of the user.
 * @returns {Promise<Object>} - The newly created user object.
 * @throws {HttpError} - If there was an error while saving the user to the database.
 */
const store = async (req, fileName, filePath) => {
    const { name, email, password, dob, gender, address, mobile, role, status } = req.body;

    const user = new User({
        name, email, password, dob, gender, mobile, address, imageName: fileName, imagePath: process.env.APP_ENV === 'locale' ? filePath : process.env.LIVE_IMAGE_URL, role, status
    });

    try {
        await user.save();
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    return user;
};

/**
 * Finds a user by their ID.
 * @param {string} userId - The ID of the user to find.
 * @returns {Promise<object>} - A promise that resolves with the user object if found.
 * @throws {HttpError} - If the user ID is invalid or the user is not found.
 */
const find = async (userId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new HttpError('Invalid user ID format', 400);
        }

        userId = mongoose.Types.ObjectId(userId);
        const user = await User.findById(userId);

        if (!user) {
            throw new HttpError('User not found', 404);
        }

        return user;
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
 * Updates a user with the given data.
 *
 * @param {string} userId - The ID of the user to update.
 * @param {Object} data - The data to update the user with.
 * @param {string} data.name - The name of the user.
 * @param {string} data.email - The email of the user.
 * @param {string} data.password - The password of the user.
 * @param {string} data.dob - The date of birth of the user.
 * @param {string} data.gender - The gender of the user.
 * @param {string} data.address - The address of the user.
 * @param {string} data.mobile - The mobile number of the user.
 * @returns {Promise<Object>} The updated user object.
 * @throws {HttpError} If there was an error updating the user.
 */
const update = async (userId, data, fileName, filePath) => {
    const { name, email, password, dob, gender, address, mobile, status, role } = data;

    // eslint-disable-next-line prefer-const
    let user = await find(userId);
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;
    user.dob = dob || user.dob;
    user.gender = gender || user.gender;
    user.address = address || user.address;
    user.mobile = mobile || user.mobile;
    user.role = role || user.role;
    user.status = status || user.status;
    if (fileName && filePath) {
        user.imageName = fileName;
        user.imagePath = process.env.APP_ENV === 'locale' ? filePath : process.env.LIVE_IMAGE_URL;
    }

    try {
        await user.save();
        return user;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Deletes a user from the database.
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the user was deleted successfully.
 * @throws {HttpError} - If there was an error deleting the user.
 */
const destroy = async (userId) => {
    // Soft delete
    try {
        const user = await find(userId);
        user.deletedAt = Date.now();
        await user.save();

        return true;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Counts the total number of users in the database.
 *
 * @returns {Promise<number>} The total number of users.
 * @throws {HttpError} If there's an error while counting the users.
 */
const count = async () => {
    let totalUsers = 0;

    try {
        // Count total categories
        totalUsers = await User.countDocuments();
    } catch (err) {
        throw new HttpError(err, 500);
    }

    return totalUsers;
};

/**
 * Performs bulk actions on users based on the provided data.
 * @param {Object} data - The data containing the action and user IDs.
 * @param {string} data.action - The action to perform (delete, active, inactive, restore).
 * @param {Array<string>} data.userIds - The IDs of the users to perform the action on.
 * @returns {Promise<Object>} - A promise that resolves to the updated user object(s).
 * @throws {HttpError} - If an error occurs during the bulk action process.
 */
const bulkAction = async (data) => {
    const { action, userIds } = data;

    try {
        let user;

        switch (action) {
        case 'delete':
            user = await User.updateMany(
                { _id: { $in: userIds } },
                { deletedAt: Date.now() },
                { status: null }
            );
            break;
        case 'active':
            user = await User.updateMany(
                { _id: { $in: userIds } },
                { status: 'active' }
            );
            break;
        case 'inactive':
            user = await User.updateMany(
                { _id: { $in: userIds } },
                { status: 'inactive' }
            );
            break;
        case 'restore':
            user = await User.updateMany(
                { _id: { $in: userIds } },
                { deletedAt: null }
            );
            break;
        default:
            throw new HttpError('Invalid action', 400);
        }

        return user;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

export default { get, store, find, update, destroy, bulkAction, count };
