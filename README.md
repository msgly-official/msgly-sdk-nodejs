# Msgly Node.js SDK

Official Node.js SDK for the [Msgly API](https://msgly.id). Easily integrate WhatsApp OTP, single messaging, and template management into your Node.js applications.

## Installation

Install the package via npm:

```bash
npm install msgly-sdk
```

---

## Quick Start (CommonJS & ESM)

This SDK supports both CommonJS (`require`) and ES Modules (`import`).

```javascript
const { MsglyClient } = require('msgly-sdk');
// or: import { MsglyClient } from 'msgly-sdk';

const msgly = new MsglyClient({
    baseUrl: 'https://api.msgly.id', // Optional, defaults to https://api.msgly.id
    clientId: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
});
```

---

## Code Examples

### 1. Send OTP (Mode 1: OTP Rotation Aktif)
Jika fitur **OTP Rotation** diaktifkan di akun Anda oleh Admin, Anda tidak perlu menentukan `template_id`. Cukup kirim kode OTP, dan server Msgly akan secara otomatis merotasi template WhatsApp secara acak.

```javascript
async function sendOTPRotation() {
    try {
        const response = await msgly.message.sendOTP({
            xid: 'otp_' + Date.now(), // ID unik transaksi Anda (harus unik)
            to: '6281234567890',      // Nomor tujuan format internasional (misal 628...)
            code: '482910',           // Kode OTP yang disubstitusikan ke template
        });
        console.log('OTP Sent (Rotation):', response);
    } catch (error) {
        console.error('Error sending OTP:', error.message);
    }
}
```

---

### 2. Send OTP (Mode 2: Manual Template Selection)
Jika **OTP Rotation TIDAK aktif**, Anda wajib menentukan `template_id` dan array `params` secara manual.

```javascript
async function sendOTPManual() {
    try {
        const response = await msgly.message.sendOTP({
            xid: 'otp_' + Date.now(),
            to: '6281234567890',
            template: {
                template_id: 'c8f7a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b', // UUID template
                params: ['482910'], // Param {{1}} diisi '482910'
            },
        });
        console.log('OTP Sent (Manual):', response);
    } catch (error) {
        console.error('Error sending OTP:', error.message);
    }
}
```

---

### 3. Send Notification (WhatsApp Notification)
Kirim notifikasi operasional WhatsApp menggunakan teks bebas ataupun template berparameter.

```javascript
async function sendNotification() {
    try {
        const response = await msgly.message.sendNotification({
            xid: 'notif_' + Date.now(),
            to: '6281234567890',
            message: 'Halo Budi, transaksi pesanan #INV-2049 Anda telah diverifikasi.',
        });
        console.log('Notification Sent:', response);
    } catch (error) {
        console.error('Error sending notification:', error.message);
    }
}
```

---

### 4. Send Reminder (WhatsApp Reminder)
Kirim pengingat terjadwal atau langsung. Gunakan parameter `scheduled_at` (format ISO 8601/Date) untuk pengiriman terjadwal.

```javascript
async function sendReminder() {
    try {
        // Contoh terjadwal 1 hari ke depan
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const response = await msgly.message.sendReminder({
            xid: 'reminder_' + Date.now(),
            to: '6281234567890',
            message: 'Halo, pengingat jadwal webinar Anda akan dimulai besok pukul 10:00 WIB.',
            scheduled_at: tomorrow,
        });
        console.log('Reminder Queued/Scheduled:', response);
    } catch (error) {
        console.error('Error sending reminder:', error.message);
    }
}
```

---

### 5. Manage Templates (List & Get Detail)

```javascript
async function manageTemplates() {
    try {
        // List templates dengan pagination & pencarian
        const templates = await msgly.template.list({
            search: 'OTP', // Opsional: kata kunci pencarian
            page: 1,
            per_page: 10
        });
        console.log('Templates List:', templates);

        // Ambil detail template berdasarkan ID
        if (templates.data?.data?.length > 0) {
            const templateId = templates.data.data[0].id;
            const detail = await msgly.template.getById(templateId);
            console.log('Template Detail:', detail);
        }
    } catch (error) {
        console.error('Error fetching templates:', error.message);
    }
}
```

---

## Features

- 🔑 **Auto-Refresh OAuth Token**: Mengelola dan memperbarui access token OAuth2 secara otomatis saat kadaluarsa.
- ⚡ **Dual Module Support**: Mendukung `require()` (CommonJS) & `import` (ESM).
- 🔄 **OTP Rotation & Manual Mode**: Mendukung pengiriman OTP fleksibel.
- 💡 **Full Autocompletion**: JSDoc typed untuk memberikan saran autocomplete di IDE seperti VS Code.

## Requirements

- Node.js >= 14.0.0

## License

ISC

