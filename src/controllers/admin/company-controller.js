import HttpError from '../../services/httpErrorService.js';
import { singleImageUploader } from '../../services/uploadService.js';
import CompanyService from '../../services/dbServices/companyService.js';

/**
 * Add a new company to the database.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @throws {HttpError} If there is an error while saving the company to the database.
 * @returns {Object} The newly created company object.
 */
const store = async (req, res, next) => {
    try {
        const fileName = req.generatedFileName;
        const filePath = req.generatedFilePath;
        const company = await CompanyService.store(req.body, fileName, filePath);
        res.json({ status: 'success', message: 'Company added successfully', data: company });
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

/**
 * Retrieves the company information.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {HttpError} If an error occurs while retrieving the company information.
 * @returns {Object} The company information.
 */
const show = async (req, res, next) => {
    let company;

    try {
        company = await CompanyService.find();
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }

    res.json({ status: 'success', message: 'Company information retrieved successfully', data: company });
};

/**
 * Updates the company information in the database.
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The updated company object.
 */
const update = async (req, res, next) => {
    try {
        console.log(req.body);
        const fileName = req.generatedFileName;
        const filePath = req.generatedFilePath;
        const result = await CompanyService.update(null, req.body, fileName, filePath);
        res.json({ status: 'success', message: 'Company information updated successfully', data: result });
    } catch (error) {
        const err = new HttpError(error, 500);
        return next(err);
    }
};

/**
 * Uploads the logo image using the singleImageUploader function.
 * @function
 * @param {string} logo - The logo image to be uploaded.
 */
const logo = singleImageUploader('logo');

export default { show, update, store, logo };
