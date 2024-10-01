import HttpError from '../../services/httpErrorService.js';
import UserService from '../../services/dbServices/userService.js';

/**
 * Retrieves a list of users based on the provided query parameters.
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
        const result = await UserService.get(req);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Adds a new user to the database.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {HttpError} If there is an error while saving the user.
 * @returns {Object} The newly added user object.
 */
const store = async (req, res, next) => {
    try {
        const fileName = req.generatedFileName;
        const filePath = req.generatedFilePath;
        const user = await UserService.store(req, fileName, filePath);

        const response = {
            status: 'success',
            message: 'User added successfully',
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

/**
 * Edit user by ID
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - JSON response with edited user object
 */
const edit = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        const user = await UserService.find(userId);

        const response = {
            status: 'success',
            message: 'User found successfully',
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

/**
 * Updates a user's information in the database.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {HttpError} Will throw an error if there is an issue finding or saving the user.
 * @returns {Object} Returns a JSON object containing the updated user's information.
 */
const update = async (req, res, next) => {
    const userId = req.params.userId;
    const fileName = req.generatedFileName;
    const filePath = req.generatedFilePath;

    try {
        let user = await UserService.find(userId);

        if (!user) {
            const error = new HttpError('Could not find a user for the provided id.', 404);
            return next(error);
        }

        user = await UserService.update(userId, req.body, fileName, filePath);

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

/**
 * Deletes a user with the given ID.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {HttpError} If an error occurs while deleting the user.
 * @returns {void}
 */
const destroy = async (req, res, next) => {
    const userId = req.params.userId;
    const result = await UserService.destroy(userId);

    if (!result) {
        const error = new HttpError('Something went wrong. Please try again later.', 404);
        return next(error);
    }

    res.json({ status: 'success', message: 'User deleted successfully' });
};

/**
 * Counts the total number of users.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The total number of users.
 */
const count = async (req, res, next) => {
    let totalUsers = 0;

    try {
        totalUsers = await UserService.count();
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }

    res.json({ totalUsers });
};

/**
 * Perform a bulk action on users.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the bulk action is completed.
 * @throws {HttpError} - If an error occurs during the bulk action.
 */
const bulkAction = async (req, res, next) => {
    try {
        await UserService.bulkAction(req.body);
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    res.json({ status: 'success', message: 'User updated successfully' });
};

export default { get, store, edit, update, destroy, bulkAction, count };
