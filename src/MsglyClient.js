const OAuth = require('./auth/OAuth');
const Message = require('./message/Message');
const Template = require('./template/Template');

/**
 * @typedef {Object} MsglyConfig
 * @property {string} clientId - The OAuth client ID
 * @property {string} clientSecret - The OAuth client secret
 * @property {string} [baseUrl='https://api.msgly.id'] - The API base URL
 */

class MsglyClient {
    /**
     * @param {MsglyConfig} config 
     */
    constructor(config) {
        if (!config.clientId || !config.clientSecret) {
            throw new Error('clientId and clientSecret are required');
        }

        this.config = {
            baseUrl: config.baseUrl || 'https://api.msgly.id',
            clientId: config.clientId,
            clientSecret: config.clientSecret
        };

        this.oauth = new OAuth(this.config);
        this.message = new Message(this.oauth, this.config);
        this.template = new Template(this.oauth, this.config);
    }
}

module.exports = MsglyClient;
