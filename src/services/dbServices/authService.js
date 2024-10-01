import User from '../../models/user-model.js';
import HttpError from '../httpErrorService.js';
import jwt from 'jsonwebtoken';
import { JWT_TOKEN_SECRET } from '../../config/app.js';
import Company from '../../models/company-model.js';
import bcrypt from 'bcrypt';

/**
 * Authenticates a user with the provided email and password.
 * @param {string} email - The email of the user to authenticate.
 * @param {string} password - The password of the user to authenticate.
 * @returns {Promise<{user: Object, company: Object, token: string}>} An object containing the authenticated user, company, and a JWT token.
 * @throws {HttpError} If there is an error while querying the database or if the provided credentials are invalid.
 */
const loginLogic = async (email, password) => {
    let user;
    let company;

    try {
        user = await User.findOne({ email });
    } catch (err) {
        throw new HttpError(err, 500);
    }

    if (!user) {
        throw new HttpError('Invalid credentials', 401);
    }

    if (!bcrypt.compareSync(password, user.password)) {
        throw new HttpError('Invalid credentials', 401);
    }

    try {
        company = await Company.findOne();
    } catch (err) {
        throw new HttpError(err, 500);
    }

    const token = jwt.sign({ user }, JWT_TOKEN_SECRET, { expiresIn: '1h' });
    return { user, company, token };
};

/**
 * Registers a new user with the provided data.
 * @param {Object} data - The user data to register.
 * @param {string} data.name - The name of the user.
 * @param {string} data.email - The email of the user.
 * @param {string} data.mobile - The mobile number of the user.
 * @param {string} data.password - The password of the user.
 * @returns {Promise<User>} - A promise that resolves with the newly registered user.
 * @throws {HttpError} - If there was an error saving the user to the database.
 */
const registerLogic = async (data) => {
    const { name, email, mobile, password } = data;
    const passwordHash = bcrypt.hashSync(password, 10);
    const user = new User({
        name, email, password: passwordHash, mobile
    });

    try {
        await user.save();
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    return user;
};

export default { loginLogic, registerLogic };
