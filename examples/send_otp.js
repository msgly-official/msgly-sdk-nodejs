const { MsglyClient } = require('../src'); // In real app: require('msgly-sdk')

async function main() {
    const msgly = new MsglyClient({
        baseUrl: 'https://api.msgly.id',
        clientId: 'your-client-id',
        clientSecret: 'your-client-secret',
    });

    // ============================================================
    // CARA 1 — OTP ROTATION AKTIF (diatur oleh admin)
    // ============================================================
    // Jika admin mengaktifkan fitur OTP rotation untuk akun kamu,
    // kamu TIDAK perlu menyertakan template_id.
    // Server akan otomatis memilih template secara acak dari
    // daftar template yang sudah dipilihkan admin.
    //
    // Cukup kirim: xid, to, dan code.
    // ============================================================
    try {
        console.log('Mengirim OTP (rotation aktif)...');
        const result = await msgly.message.sendOTP({
            xid:  'otp_' + Date.now(), // ID unik per pengiriman (buat sendiri, harus unik)
            to:   '6281234567890',     // Nomor tujuan format internasional
            code: '123456',            // Kode OTP yang akan disubstitusi ke template
        });
        console.log('[Rotation] Berhasil:', result);
    } catch (error) {
        console.error('[Rotation] Error:', error.message);
    }

    // ============================================================
    // CARA 2 — OTP MANUAL (rotation TIDAK aktif)
    // ============================================================
    // Jika fitur OTP rotation TIDAK aktif, kamu harus menentukan
    // template_id secara eksplisit.
    //
    // Langkah:
    //   1. Ambil daftar template via msgly.template.list()
    //   2. Pilih template_id yang sesuai
    //   3. Kirim OTP dengan menyertakan template + params
    //
    // Format params mengikuti placeholder di template:
    //   {{1}} → params[0], {{2}} → params[1], dst.
    // ============================================================
    try {
        // (Opsional) Fetch template terlebih dahulu untuk mendapatkan template_id
        // const templates = await msgly.template.list({ page: 1, per_page: 10 });
        // const templateId = templates.data.data[0].id;

        const templateId = 'uuid-template-id-kamu'; // Ganti dengan template_id yang valid

        console.log('\nMengirim OTP (manual template)...');
        const result = await msgly.message.sendOTP({
            xid:  'otp_' + Date.now(), // ID unik per pengiriman
            to:   '6281234567890',     // Nomor tujuan format internasional
            template: {
                template_id: templateId,
                params: ['123456'],    // {{1}} akan diganti dengan '123456'
            },
        });
        console.log('[Manual] Berhasil:', result);
    } catch (error) {
        console.error('[Manual] Error:', error.message);
    }
}

main();
