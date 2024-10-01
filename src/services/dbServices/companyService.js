import Company from '../../models/company-model.js';
import HttpError from '../httpErrorService.js';

const DEFAULTS = {
    LIMIT: 10,
    SORT: 'name',
    STATUS: 'All',
    NAME: 'All'
};

/**
 * Retrieves companies based on the provided request parameters.
 * @param {Object} req - The request object.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the retrieved companies.
 * @throws {HttpError} - If an error occurs while retrieving the companies.
 */
const get = async (req) => {
    let companies;

    try {
        const page = parseInt(req.query.page, 10) - 1 || 0;
        const limit = parseInt(req.query.limit, 10) || DEFAULTS.LIMIT;
        const search = req.query.search || '';
        const sort = req.query.sort || DEFAULTS.SORT;
        const name = req.query.name || DEFAULTS.NAME;
        const status = req.query.status || DEFAULTS.STATUS;

        const getBaseAggregation = () => {
            return Company.find({ name: { $regex: search, $options: 'i' } })
                .where(name !== DEFAULTS.NAME ? { name } : {})
                .where(status !== DEFAULTS.STATUS ? { status } : {});
        };

        companies = await getBaseAggregation()
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
            companies
        };
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Stores a new company in the database.
 * @param {Object} data - The data of the company to be stored.
 * @param {string} data.name - The name of the company.
 * @param {string} data.email - The email of the company.
 * @param {string} data.phone - The phone number of the company.
 * @param {string} data.website - The website of the company.
 * @param {string} data.dateFormat - The date format of the company.
 * @param {string} data.timeFormat - The time format of the company.
 * @param {string} data.timeZone - The timeZone of the company.
 * @param {string} data.language - The language of the company.
 * @param {string} data.appName - The app name of the company.
 * @param {string} data.logo - The logo of the company.
 * @param {string} data.favicon - The favicon of the company.
 * @param {boolean} data.miniDrawer - The mini drawer status of the company.
 * @param {boolean} data.status - The status of the company.
 * @returns {Object} - The stored company object.
 * @throws {HttpError} - If there is an error while saving the company.
 */
const store = async (data, fileName, filePath) => {
    const { name, email, phone, website, address, dateFormat, timeFormat, timeZone, language, appName, logo, favicon, miniDrawer, status } = data;

    const newCompany = new Company({ name, email, phone, website, address, dateFormat, timeFormat, timeZone, language, appName, logo, favicon, miniDrawer, status, logoName: fileName, logoPath: process.env.APP_ENV === 'locale' ? filePath : process.env.LIVE_IMAGE_URL });

    try {
        await newCompany.save();
        return { company: newCompany };
    } catch (err) {
        throw new HttpError(err, 500);
    }
};

/**
 * Finds a company.
 * @returns {Promise<{ company: Object }>} The company object.
 * @throws {HttpError} If an error occurs while finding the company.
 */
const find = async () => {
    let company;

    try {
        company = await Company.findOne();
    } catch (err) {
        throw new HttpError(err, 500);
    }

    return company;
};

/**
 * Updates a company's information.
 * @param {string} companyId - The ID of the company to update.
 * @param {Object} data - The updated data for the company.
 * @returns {Promise<Object>} - The updated company object.
 * @throws {HttpError} - If there is an error while saving the updated company.
 */
const update = async (companyId = null, data, fileName, filePath) => {
    const { name, email, phone, website, address, dateFormat, timeFormat, timeZone, language, appName, logo, favicon, miniDrawer, status } = data;

    let company = null;

    // If companyId is null, find the first company
    if (!companyId) {
        company = await find();
    } else {
        // eslint-disable-next-line prefer-const
        company = await find(companyId);
    }

    company.name = name || company.name;
    company.email = email || company.email;
    company.phone = phone || company.phone;
    company.website = website || company.website;
    company.address = address || company.address;
    company.dateFormat = dateFormat || company.dateFormat;
    company.timeFormat = timeFormat || company.timeFormat;
    company.timeZone = timeZone || company.timeZone;
    company.language = language || company.language;
    company.appName = appName || company.appName;
    company.logo = logo || company.logo;
    company.favicon = favicon || company.favicon;
    company.miniDrawer = miniDrawer || company.miniDrawer;
    company.status = status || company.status;
    if (fileName && filePath) {
        company.imageName = fileName;
        company.imagePath = process.env.APP_ENV === 'locale' ? filePath : process.env.LIVE_IMAGE_URL;
    }
    company.updatedAt = Date.now();
    console.log(company, fileName);
    try {
        await company.save();
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    return company;
};

/**
 * Soft deletes a company by setting the deletedAt property to the current date and time.
 * @param {string} companyId - The ID of the company to be deleted.
 * @returns {Promise<boolean>} - A promise that resolves to true if the company is successfully deleted.
 * @throws {HttpError} - If an error occurs during the deletion process.
 */
const destroy = async (companyId) => {
    // Soft delete
    try {
        const company = await find(companyId);
        company.deletedAt = Date.now();
        await company.save();

        return true;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Counts the number of documents in the Company collection that match the given companyId.
 *
 * @param {string} companyId - The ID of the company.
 * @returns {Promise<number>} - The number of documents that match the companyId.
 * @throws {HttpError} - If an error occurs while counting the documents.
 */
const count = async (companyId) => {
    try {
        const company = await Company.countDocuments({ companyId });

        return company;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

export default { get, store, find, update, destroy, count };
