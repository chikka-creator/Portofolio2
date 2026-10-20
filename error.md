# Modul UI/UX: Pop-up "Alat Hilang Koneksi" (Connection Error)
**Konteks:** Muncul secara otomatis menimpa layar utama saat sistem mendeteksi alat tidak mengirimkan data (telemetri terputus) selama beberapa menit.

## 1. Core Principles (Konsistensi Tema)
*   **Format Layout:** *Center Modal* (Kotak melayang tepat di tengah layar) atau *Bottom Sheet*. Kali ini kita gunakan *Center Modal* agar terasa lebih mendesak daripada sekadar laci bawah, namun tetap dengan latar *backdrop blur* yang elegan.
*   **Anti-Slop Copywriting:** Hindari jargon teknis jaringan. Gunakan kalimat empati seperti "Alat terputus dari internet," bukan "Network Request Failed".
*   **Visual Ikonik:** Menggunakan ikon WiFi yang dicoret atau ikon steker kabel yang terputus dengan warna peringatan yang diredam (misal: *Amber/Orange* redup, bukan merah darah yang bikin panik).

## 2. Struktur Elemen Pop-up
*   **Visual Peringatan (Atas):**
    *   Lingkaran latar belakang `amber-50` dengan ikon WiFi *Off* atau *Unplugged* berwarna `amber-700` di tengahnya.
*   **Teks Diagnosa:**
    *   Teks Utama: "Alat kehilangan koneksi." (Tipografi font-medium).
    *   Teks Deskripsi: "Kami tidak bisa memantau kebunmu saat ini. Pastikan WiFi di rumah menyala dan alat terhubung ke listrik." (Tipografi text-stone-500).
*   **Footer / Action Buttons (Vertikal):**
    *   Berbeda dengan pop-up sebelumnya yang sejajar (kiri-kanan), karena ini langkah *troubleshooting* jaringan, susun tombol secara vertikal (atas-bawah).
    *   Tombol Utama (Atas): "Coba Hubungkan Ulang" (Warna *solid* hijau gelap).
    *   Tombol Sekunder (Bawah): "Lihat Cara Restart Alat" (Teks saja, tanpa *border* / *Ghost button*, warna abu-abu).