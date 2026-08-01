const axios = require('axios');
const MsglyError = require('../errors/MsglyError');

class Message {
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
     * Send an OTP message
     * @param {Object} params
     * @param {string} params.xid
     * @param {string} params.to
     * @param {string} params.code
     * @returns {Promise<Object>}
     */
    async sendOTP(params) {
        return this._send({
            xid: params.xid,
            to: params.to,
            type: 'otp',
            code: params.code,
            variables: {
                code: params.code
            }
        });
    }

    /**
     * Send a single message
     * @param {Object} params
     * @param {string} params.xid
     * @param {string} params.to
     * @param {string} params.message
     * @returns {Promise<Object>}
     */
    async sendSingle(params) {
        return this._send({
            xid: params.xid,
            to: params.to,
            type: 'single',
            message: params.message
        });
    }

    /**
     * Internal send method handling auth and retry
     * @param {Object} payload 
     * @param {boolean} isRetry 
     */
    async _send(payload, isRetry = false) {
        try {
            const token = await this.oauth.getToken();
            
            const response = await axios.post(`${this.config.baseUrl}/api/v1/message`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            // Auto retry once on 401
            if (error.response && error.response.status === 401 && !isRetry) {
                await this.oauth.refreshToken();
                return this._send(payload, true);
            }

            if (error.response) {
                throw new MsglyError(
                    error.response.data?.message || 'Failed to send message',
                    error.response.status,
                    error.response.data
                );
            }
            throw new MsglyError(error.message);
        }
    }
}

module.exports = Message;
