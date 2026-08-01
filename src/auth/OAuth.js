const axios = require('axios');
const MsglyError = require('../errors/MsglyError');

class OAuth {
    /**
     * @param {Object} config
     * @param {string} config.baseUrl
     * @param {string} config.clientId
     * @param {string} config.clientSecret
     */
    constructor(config) {
        this.config = config;
        this.token = null;
        this.expiresAt = null;
    }

    /**
     * Get a valid access token
     * @returns {Promise<string>}
     */
    async getToken() {
        if (this.token && this.expiresAt && Date.now() < this.expiresAt) {
            return this.token;
        }

        return await this.refreshToken();
    }

    /**
     * Force refresh the access token
     * @returns {Promise<string>}
     */
    async refreshToken() {
        try {
            const params = new URLSearchParams();
            params.append('grant_type', 'client_credentials');
            params.append('client_id', this.config.clientId);
            params.append('client_secret', this.config.clientSecret);

            const response = await axios.post(`${this.config.baseUrl}/api/v1/oauth/token`, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.data && response.data.success && response.data.data) {
                const { access_token, expires_in } = response.data.data;
                this.token = access_token;
                // Subtract 10 seconds for buffer
                this.expiresAt = Date.now() + (expires_in * 1000) - 10000;
                return this.token;
            }

            throw new MsglyError('Failed to get token: Invalid response structure', response.status, response.data);
        } catch (error) {
            if (error instanceof MsglyError) {
                throw error;
            }
            if (error.response) {
                throw new MsglyError(
                    error.response.data?.message || 'OAuth authentication failed',
                    error.response.status,
                    error.response.data
                );
            }
            throw new MsglyError(error.message);
        }
    }
}

module.exports = OAuth;
