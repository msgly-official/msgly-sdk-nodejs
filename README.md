# Msgly Node.js SDK

Official Node.js SDK for the Msgly API.

## Installation

Install the package via npm:

```bash
npm install msgly-sdk
```

## Usage (CommonJS & ESM)

This SDK supports both CommonJS (`require`) and ES Modules (`import`).

```javascript
const { MsglyClient } = require('msgly-sdk');
// or
// import { MsglyClient } from 'msgly-sdk';

const msgly = new MsglyClient({
    baseUrl: 'https://api.msgly.id', // Optional, default is https://api.msgly.id
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
});

async function run() {
    try {
        const result = await msgly.message.sendOTP({
            xid: 'otp_' + Date.now(),
            to: '6281234567890',
            code: '123456',
        });
        console.log('OTP Sent:', result);

        // Template examples
        const templates = await msgly.template.list({ page: 1, per_page: 10 });
        console.log('Templates list:', templates);

        if (templates.data?.data?.length > 0) {
            const templateId = templates.data.data[0].id;
            const template = await msgly.template.getById(templateId);
            console.log('Template detail:', template);
        }
    } catch (error) {
        console.error('Error:', error.message, error.responseData);
    }
}

run();
```

## Features

- **Auto-Refresh Token**: Automatically manages OAuth2 access tokens and refreshes them when expired.
- **Dual Package Support**: Works natively with `require()` and `import` through Node.js export mappings.
- **JSDoc Typed**: Full autocompletion in your favorite IDE.
- **Customizable**: Override the default API URL if needed.

## Publishing to npm Registry

Follow these steps to publish this SDK to the npm registry:

1. **Login to npm**:
   ```bash
   npm login
   ```
   (Enter your username, password, and email)

2. **Verify Package Version**:
   Check the `version` in `package.json` (e.g., `"1.0.0"`). Before publishing a new update, bump the version:
   ```bash
   npm version patch # 1.0.1
   # or npm version minor # 1.1.0
   ```

3. **Publish the Package**:
   ```bash
   npm publish
   ```
   If it's a scoped package (`@your-org/msgly-sdk`), run `npm publish --access public`.

4. **Done!**
   Your package will be available at `https://npmjs.com/package/msgly-sdk`.

## Requirements

- Node.js >= 14.0.0
- Axios

## License

ISC
