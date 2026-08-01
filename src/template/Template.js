const axios = require('axios');
const MsglyError = require('../errors/MsglyError');

class Template {
    /**
     * @param {import('../auth/OAuth')} oauth 
     * @param {Object} config 
     * @param {string} config.baseUrl 
     */
    constructor(oauth, config) {
        this.oauth = oauth;
        this.config = config;
    }

    /**
     * List user templates
     * @param {Object} [params]
     * @param {string} [params.search]
     * @param {number} [params.page]
     * @param {number} [params.per_page]
     * @returns {Promise<Object>}
     */
    async list(params = {}) {
        return this._request('GET', '/api/v1/templates', { params });
    }

    /**
     * Get detail template by ID
     * @param {string} id 
     * @returns {Promise<Object>}
     */
    async getById(id) {
        return this._request('GET', `/api/v1/templates/${id}`);
    }

    /**
     * Internal request method handling auth and retry
     * @param {string} method 
     * @param {string} endpoint 
     * @param {Object} [options] 
     * @param {boolean} [isRetry=false] 
     */
    async _request(method, endpoint, options = {}, isRetry = false) {
        try {
            const token = await this.oauth.getToken();
            
            const response = await axios({
                method,
                url: `${this.config.baseUrl}${endpoint}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                ...options
            });

            return response.data;
        } catch (error) {
            // Auto retry once on 401
            if (error.response && error.response.status === 401 && !isRetry) {
                await this.oauth.refreshToken();
                return this._request(method, endpoint, options, true);
            }

            if (error.response) {
                throw new MsglyError(
                    error.response.data?.message || `Failed to ${method} template`,
                    error.response.status,
                    error.response.data
                );
            }
            throw new MsglyError(error.message);
        }
    }
}

module.exports = Template;
