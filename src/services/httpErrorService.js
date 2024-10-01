/**
 * Represents an HTTP error with a message and error code.
 * @class
 * @extends Error
 */
class HttpError extends Error {
    constructor (message, errorCode) {
        super(message); // Add a "message" property
        this.code = errorCode; // Adds a "code" property
    }
}

export default HttpError;
