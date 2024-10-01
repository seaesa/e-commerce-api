import HttpError from '../../services/httpErrorService.js';
import mongoose from 'mongoose';
import Language from '../../models/language-model.js';

const DEFAULTS = {
    LIMIT: 10,
    SORT: 'name',
    STATUS: 'All',
    NAME: 'All'
};

/**
 * Retrieves languages based on the provided request parameters.
 * @param {Object} req - The request object.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the retrieved languages.
 * @throws {HttpError} - If an error occurs during the retrieval process.
 */
const get = async req => {
    let languages;

    try {
        const page = parseInt(req.query.page, 10) - 1 || 0;
        const limit = parseInt(req.query.limit, 10) || DEFAULTS.LIMIT;
        const search = req.query.search || '';
        const sort = req.query.sort || DEFAULTS.SORT;
        const code = req.query.code || DEFAULTS.NAME;
        const name = req.query.name || DEFAULTS.NAME;
        const companyId = req.query.companyId || DEFAULTS.NAME;
        const status = req.query.status || DEFAULTS.STATUS;

        const getBaseAggregation = () => {
            return Language.find({ code: { $regex: search, $options: 'i' } })
                .where(code !== DEFAULTS.NAME ? { code } : {})
                .where(name !== DEFAULTS.NAME ? { name } : {})
                .where(companyId !== DEFAULTS.NAME ? { companyId } : {})
                .where(status !== DEFAULTS.STATUS ? { status } : {});
        };

        languages = await getBaseAggregation()
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
            languages
        };
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Stores a new language in the database.
 * @param {Object} data - The language data to be stored.
 * @param {string} data.companyId - The ID of the company associated with the language.
 * @param {string} data.name - The name of the language.
 * @param {string} data.code - The code of the language.
 * @param {string} data.status - The status of the language.
 * @returns {Promise<Object>} - The newly created language object.
 * @throws {HttpError} - If there is an error while saving the language.
 */
const store = async data => {
    const { companyId, name, code, status } = data;

    const language = new Language({ companyId, name, code, status, createdAt: Date.now() });

    try {
        await language.save();
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    return language;
};

/**
 * Finds a language by its ID.
 * @param {string} languageId - The ID of the language to find.
 * @returns {Promise<Object>} - A promise that resolves to the found language object.
 * @throws {HttpError} - If the language ID is invalid or the language is not found.
 */
const find = async languageId => {
    try {
        if (!mongoose.Types.ObjectId.isValid(languageId)) {
            throw new HttpError('Invalid Language ID format', 400);
        }

        languageId = mongoose.Types.ObjectId(languageId);
        const language = await Language.findById(languageId);

        if (!language) {
            throw new HttpError('Language not found', 404);
        }

        return language;
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
 * Updates a language in the database.
 * @param {string} languageId - The ID of the language to update.
 * @param {object} data - The updated data for the language.
 * @param {string} data.name - The updated name of the language.
 * @param {string} data.code - The updated code of the language.
 * @param {string} data.status - The updated status of the language.
 * @returns {Promise<object>} - The updated language object.
 * @throws {HttpError} - If there is an error while saving the updated language.
 */
const update = async (languageId, data) => {
    const { name, code, status } = data;

    // eslint-disable-next-line prefer-const
    let language = await find(languageId);
    language.name = name;
    language.code = code;
    language.status = status;
    language.updatedAt = Date.now();

    try {
        await language.save();
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    return language;
};

/**
 * Deletes a language by setting its deletedAt property to the current date and time.
 * @param {string} languageId - The ID of the language to be deleted.
 * @returns {Promise<boolean>} - A promise that resolves to true if the language is successfully deleted.
 * @throws {HttpError} - If an error occurs while deleting the language.
 */
const destroy = async languageId => {
    try {
        const language = await Language.findById(languageId);
        language.deletedAt = Date.now();
        await language.save();
        return true;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Counts the number of languages associated with a company.
 * @param {string} companyId - The ID of the company.
 * @returns {Promise<number>} The number of languages associated with the company.
 * @throws {HttpError} If an error occurs while counting the languages.
 */
const count = async (companyId) => {
    try {
        const language = await Language.countDocuments({ companyId });

        return language;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

// restore language
const restore = async languageId => {
    try {
        const language = await Language.findById(languageId);
        language.deletedAt = null;
        await language.save();
        return true;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Changes the status of a language.
 * @param {string} languageId - The ID of the language.
 * @param {string} status - The new status of the language.
 * @returns {Promise<boolean>} - A promise that resolves to true if the status is successfully changed, or rejects with an error.
 * @throws {HttpError} - If an error occurs while changing the status.
 */
const changeStatus = async (languageId, status) => {
    try {
        const language = await Language.findById(languageId);
        language.status = status;
        language.updatedAt = Date.now();
        await language.save();
        return true;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

export default { get, store, find, update, destroy, count, restore, changeStatus };
