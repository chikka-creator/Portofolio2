# Modul UI/UX: Halaman Empty State (Kondisi Kosong / Belum Ada Alat)
**Konteks:** Ditampilkan pada Halaman Dashboard atau Halaman Kebun ketika pengguna baru (*First-time User*) belum menghubungkan perangkat keras ESP32 apapun ke akun mereka.

## 1. Core Principles (Konsistensi Tema & Anti-Slop)
*   **Format Layout:** Konten berada tepat di tengah layar (*Center Aligned*) dengan ruang kosong (*whitespace*) yang sangat dominan. Mengunci batas *viewport* 100vh.
*   **Anti-Slop Copywriting:** DILARANG menggunakan teks "Data Tidak Ditemukan", "0 Node Terdeteksi", atau "Sistem Kosong". Gunakan sapaan manusia yang mengundang: "Kebunmu masih kosong," atau "Mari mulai menanam."
*   **Visual Pengganti (Placeholder):** Daripada ilustrasi 3D yang berat, gunakan komposisi ikon tipis (misalnya ikon daun atau tunas) dengan latar belakang lingkaran bernuansa krem/hijau pudar agar terasa menenangkan.

## 2. Struktur Elemen Empty State
*   **Header Aplikasi:** Tetap tampil (Nama "Green Harvest" di kiri, Avatar Profil di kanan) agar pengguna sadar mereka sudah masuk ke dalam aplikasi.
*   **Area Tengah (Center Content):**
    *   **Ikon/Visual:** Lingkaran besar dengan *background* `stone-50` atau `emerald-50`, di tengahnya terdapat ikon Tunas (*Sprout*) atau Pot Tanaman yang digambar dengan garis tipis (*line-art*).
    *   **Teks Utama (Heading):** Tipografi besar dan ringan (*font-light*). Contoh: "Belum ada pot yang terhubung."
    *   **Teks Deskripsi (Sub-heading):** Tipografi kecil dan memudar (*text-stone-500*). Contoh: "Hubungkan alat Green Harvest pertamamu untuk mulai memantau tanaman secara otomatis."
*   **Call to Action (Tombol Utama):**
    *   Posisi: Tepat di bawah teks deskripsi.
    *   Bentuk: Tombol membulat (`rounded-xl`), warna solid hijau gelap (`emerald-900`), teks "Hubungkan Alat Pertama". 
    *   Fungsi: Jika ditekan, tombol ini akan memicu *Pop-up/Bottom Sheet* "Tambah Perangkat" yang sudah kita desain sebelumnya.
*   **Bottom Navigation:** Tetap tampil di bawah layar (Monitoring, Kebun, Akun) untuk menjaga struktur navigasi tidak hilang.