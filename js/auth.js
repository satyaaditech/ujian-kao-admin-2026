// =========================================================================
//  AUTENTIKASI TOKEN
// =========================================================================

/**
 * Memvalidasi token ke server
 * @param {string} token - Token yang akan divalidasi
 * @returns {Promise<object>} - Hasil validasi
 */
async function validateToken(token, nama, email) {
    try {
        console.log('Mengirim request ke:', CONFIG.WEB_APP_URL);
        console.log('Body:', JSON.stringify({ action: 'validateToken', token: token, nama: nama, email: email }));
        
        const response = await fetch(CONFIG.WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({
                action: 'validateToken',
                token: token,
                nama: nama,
                email: email
            })
        });
        
        console.log('Response status:', response.status);
        
        // Apps Script kadang wrap response dalam HTML, jadi kita ambil text dulu
        const responseText = await response.text();
        console.log('Response text preview:', responseText.substring(0, 500));
        
        // Coba parse JSON dari response text
        let result;
        try {
            // Coba langsung parse
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.log('Direct parse gagal, mencoba ekstrak JSON dari HTML...');
            // Jika gagal, coba cari JSON di dalam HTML response
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                result = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Response tidak valid dari server');
            }
        }
        
        console.log('Parsed result:', result);
        return result;
        
    } catch (error) {
        console.error('Error validating token:', error);
        return {
            valid: false,
            message: 'Gagal terhubung ke server. Error: ' + error.message
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
    console.log('Menyimpan session:', { token, nama, email });
    sessionStorage.setItem('exam_token', token);
    sessionStorage.setItem('exam_nama', nama);
    sessionStorage.setItem('exam_email', email);
    console.log('Session tersimpan - token:', sessionStorage.getItem('exam_token'));
    console.log('Session tersimpan - nama:', sessionStorage.getItem('exam_nama'));
    console.log('Session tersimpan - email:', sessionStorage.getItem('exam_email'));
}

/**
 * Mendapatkan parameter dari URL
 * @param {string} name - Nama parameter
 * @returns {string|null} - Nilai parameter
 */
function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Mengambil data sesi dari sessionStorage atau URL parameter
 * @returns {object|null} - Data sesi atau null
 */
function getSession() {
    // Coba ambil dari sessionStorage dulu
    let token = sessionStorage.getItem('exam_token');
    let nama = sessionStorage.getItem('exam_nama');
    let email = sessionStorage.getItem('exam_email');
    
    // Jika tidak ada di sessionStorage, coba ambil dari URL parameter
    if (!token) {
        const urlToken = getUrlParam('token');
        if (urlToken) {
            token = urlToken.toUpperCase();
            console.log('Token diambil dari URL parameter:', token);
        }
    }
    
    if (token) {
        return { token, nama: nama || 'Kandidat', email: email || '' };
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
        console.log('Belum login - redirect ke index.html');
        window.location.href = 'index.html';
        return false;
    }
    console.log('Sudah login - token:', getSession().token);
    return true;
}

/**
 * Menyimpan token dari URL parameter ke sessionStorage
 * @param {string} token - Token dari URL
 * @returns {boolean} - true jika berhasil
 */
function saveTokenFromUrl(token) {
    console.log('Menyimpan token dari URL:', token);
    sessionStorage.setItem('exam_token', token.toUpperCase());
    return true;
}

/**
 * Mengecek status token di server
 * @param {string} token - Token yang akan dicek
 * @returns {Promise<object>} - Status token
 */
async function checkTokenStatus(token) {
    try {
        const response = await fetch(`${CONFIG.WEB_APP_URL}?action=checkTokenStatus&token=${encodeURIComponent(token)}`);
        const responseText = await response.text();
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                data = JSON.parse(jsonMatch[0]);
            } else {
                return { status: 'error', message: 'Response tidak valid' };
            }
        }
        
        return data.status || { status: 'error', message: 'Unknown' };
    } catch (error) {
        console.error('Error checking token status:', error);
        return { status: 'error', message: error.message };
    }
}
