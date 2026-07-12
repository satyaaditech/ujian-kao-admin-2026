// =========================================================================
//  KONFIGURASI SISTEM UJIAN ONLINE
// =========================================================================

const CONFIG = {
    // URL Web App Apps Script
    WEB_APP_URL: "https://script.google.com/macros/s/AKfycbwAJlg9-Vht-l73v8xcQOf4N_Tdz5TGrhAu1bwh-rgPecTU3p5Y47aD7n3ypxTC9Nhp/exec",
    
    // Pengaturan Ujian
    TOTAL_SOAL: 50,
    BATAS_WAKTU_MENIT: 45,
    
    // Threshold Rekomendasi HRD
    SKOR_DIREKOMENDASIKAN: 70,
    SKOR_PERLU_DIPERTIMBANGKAN: 50,
    
    // Kategori Soal
    KATEGORI: {
        "Numerik": "Numerik",
        "Verbal": "Verbal",
        "Logika": "Logika & Pola",
        "Personality": "Kepribadian & Sikap Kerja",
        "Pengetahuan_Umum": "Pengetahuan Umum",
        "Situasional": "Tes Situasional"
    },
    
    // Warna per Kategori
    KATEGORI_WARNA: {
        "Numerik": "#3498db",
        "Verbal": "#2ecc71",
        "Logika": "#9b59b6",
        "Personality": "#e74c3c",
        "Pengetahuan_Umum": "#f39c12",
        "Situasional": "#1abc9c"
    }
};

// Cek apakah URL sudah dikonfigurasi
if (CONFIG.WEB_APP_URL === "MASUKKAN_URL_WEB_APP_ANDA_DI_SINI" || !CONFIG.WEB_APP_URL) {
    console.warn("⚠️ WARNING: WEB_APP_URL belum dikonfigurasi! Silakan edit config.js");
} else {
    console.log("✅ WEB_APP_URL sudah dikonfigurasi");
}
