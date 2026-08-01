/**
 * Custom error class for Msgly API
 */
class MsglyError extends Error {
    /**
     * @param {string} message - Error message
     * @param {number} [statusCode] - HTTP status code
     * @param {Object} [responseData] - API response data
     */
    constructor(message, statusCode = null, responseData = null) {
        super(message);
        this.name = 'MsglyError';
        this.statusCode = statusCode;
        this.responseData = responseData;
    }
}

module.exports = MsglyError;
