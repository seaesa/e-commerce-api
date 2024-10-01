import HttpError from '../../services/httpErrorService.js';
import UserService from '../../services/dbServices/userService.js';

/**
 * Find a user by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the user is found and the response is sent.
 */
const findById = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        const user = await UserService.find(userId);

        const res = {
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            dob: user.dob,
            status: user.status
        };

        const response = {
            status: 'success',
            message: 'User found successfully',
            data: {
                user: res
            }
        };

        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Update a user by their ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves when the user is updated.
 * @throws {HttpError} - If the user is not found or an error occurs during the update.
 */
const update = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        let user = await UserService.find(userId);

        if (!user) {
            const error = new HttpError('Could not find a user for the provided id.', 404);
            return next(error);
        }

        user = await UserService.update(userId, req.body);

        const response = {
            status: 'success',
            message: 'User updated successfully',
            data: {
                user
            }
        };

        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

export default {
    findById,
    update
};
