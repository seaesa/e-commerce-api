import HttpError from '../services/httpErrorService.js';
import jwt from 'jsonwebtoken';
import { JWT_TOKEN_SECRET } from '../config/app.js';

/**
 * Middleware function to verify token in the request header.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Function} - Express next middleware function.
 */
export default function verifyToken (req, res, next) {
    // eslint-disable-next-line dot-notation
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader === 'undefined') {
        const error = new HttpError('No token provided!', 403);
        return next(error);
    }

    const bearer = bearerHeader.split(' ');
    const token = bearer[1];

    try {
        const decoded = jwt.verify(token, JWT_TOKEN_SECRET); // Verify the token with your secret key
        req.user = decoded;
        next(); // If the token is valid, proceed to the next middleware
    } catch (error) {
        const err = new HttpError(error, 400);
        return next(err);
    }
}
