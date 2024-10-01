import HttpError from '../../services/httpErrorService.js';
import LanguageService from '../../services/dbServices/languageService.js';

/**
 * Get language data.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves with the language data.
 */
const get = async (req, res, next) => {
    try {
        const result = await LanguageService.get(req);
        res.json(result);
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Store a new language.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the language is stored.
 */
const store = async (req, res, next) => {
    try {
        const language = await LanguageService.store(req.body);

        const response = {
            status: 'success',
            message: 'Language added successfully',
            data: {
                language
            }
        };
        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Edit a language by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the language is edited successfully.
 */
const edit = async (req, res, next) => {
    const languageId = req.params.languageId;

    try {
        const language = await LanguageService.find(languageId);

        const response = {
            status: 'success',
            message: 'Language found successfully',
            data: {
                language
            }
        };

        res.json(response);
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Update a language by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the language is updated.
 */
const update = async (req, res, next) => {
    const languageId = req.params.languageId;

    try {
        const language = await LanguageService.update(languageId, req.body);
        res.json({ status: 'success', message: 'Language updated successfully', data: { language } });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Deletes a language by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the language is deleted successfully.
 * @throws {HttpError} - If there is an error while deleting the language.
 */
const destroy = async (req, res, next) => {
    const languageId = req.params.languageId;

    try {
        await LanguageService.destroy(languageId);
        res.json({ status: 'success', message: 'Language deleted successfully' });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Counts the total number of languages.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The JSON response containing the total number of languages.
 */
const count = async (req, res, next) => {
    let totalLanguages;

    try {
        totalLanguages = await LanguageService.count();
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }

    res.json({ totalLanguages });
};

/**
 * Restores a language by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the language is restored.
 * @throws {HttpError} - If an error occurs during the restore process.
 */
const restore = async (req, res, next) => {
    const languageId = req.params.languageId;

    try {
        await LanguageService.restore(languageId);
        res.json({ status: 'success', message: 'Language restored successfully' });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Change the status of a language.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the status is changed successfully.
 */
const changeStatus = async (req, res, next) => {
    const languageId = req.params.languageId;
    const status = req.params.status;

    try {
        await LanguageService.changeStatus(languageId, status);
        res.json({ status: 'success', message: 'Language status changed successfully' });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

export default { get, store, edit, update, destroy, count, restore, changeStatus };
