// =========================================================================
//  AUTENTIKASI TOKEN
// =========================================================================

/**
 * Memvalidasi token ke server
 * @param {string} token - Token yang akan divalidasi
 * @returns {Promise<object>} - Hasil validasi
 */
async function validateToken(token) {
    try {
        const response = await fetch(CONFIG.WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({
                action: 'validateToken',
                token: token
            })
        });
        
        const result = await response.json();
        return result;
        
    } catch (error) {
        console.error('Error validating token:', error);
        return {
            valid: false,
            message: 'Gagal terhubung ke server. Periksa koneksi internet Anda.'
        };
    }
}

/**
 * Menyimpan data sesi ke sessionStorage
 * @param {string} token - Token kandidat
 * @param {string} nama - Nama kandidat
 * @param {string} email - Email kandidat
 */
function saveSession(token, nama, email) {
    sessionStorage.setItem('exam_token', token);
    sessionStorage.setItem('exam_nama', nama);
    sessionStorage.setItem('exam_email', email);
}

/**
 * Mengambil data sesi dari sessionStorage
 * @returns {object|null} - Data sesi atau null
 */
function getSession() {
    const token = sessionStorage.getItem('exam_token');
    const nama = sessionStorage.getItem('exam_nama');
    const email = sessionStorage.getItem('exam_email');
    
    if (token && nama && email) {
        return { token, nama, email };
    }
    return null;
}

/**
 * Menghapus sesi
 */
function clearSession() {
    sessionStorage.removeItem('exam_token');
    sessionStorage.removeItem('exam_nama');
    sessionStorage.removeItem('exam_email');
    sessionStorage.removeItem('exam_answers');
    sessionStorage.removeItem('exam_start_time');
    sessionStorage.removeItem('exam_current_question');
}

/**
 * Memeriksa apakah user sudah login
 * @returns {boolean} - true jika sudah login
 */
function isLoggedIn() {
    return getSession() !== null;
}

/**
 * Redirect ke halaman login jika belum login
 */
function requireLogin() {
    if (!isLoggedIn()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}
