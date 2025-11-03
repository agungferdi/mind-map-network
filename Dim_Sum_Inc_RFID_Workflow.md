# Dim Sum Inc - RFID Warehouse Management Workflow

Dokumentasi lengkap sistem manajemen warehouse berbasis RFID untuk Dim Sum Inc (Inara Group) yang dikerjakan oleh Muhammad Agung Ferdiansyah, PT Delta Solusi Nusantara.

## Pengenalan Sistem

Dim Sum Inc membutuhkan solusi RFID yang efisien untuk mengelola berbagai jenis bahan makanan mulai dari pemesanan, penyimpanan di cold storage (-20°C), hingga distribusi ke cabang. Sistem ini menggabungkan teknologi Chainway C5 handheld reader, printer CP30, label RFID dari Tageos dan Cirfid, serta integrasi langsung ke Odoo ERP untuk manajemen inventori real-time.

Bahan makanan yang ditangani meliputi makanan beku (ayam, daging, seafood), makanan kaleng (sarden, kornet), kemasan cair (air botol, minyak), dan bahan makanan lainnya (tepung, gula, bumbu). Setiap kategori memiliki kebutuhan penyimpanan dan label yang berbeda tergantung karakteristik produknya.

## Alur Kerja Utama

### Tahap 1: Penerimaan dan Labeling di Warehouse Utama

Ketika truk berisi berbagai bahan makanan tiba di warehouse, karyawan mulai melakukan sorting untuk memisahkan bahan makanan berdasarkan jenis dan tujuan penyimpanan. Bahan makanan tersebut dipack ke dalam plastik atau dus karton dengan ukuran tertentu, misalnya 1 pack plastik berisi 5 kg ayam. CP30 RFID printer digunakan untuk mencetak label RFID yang telah dikode dengan informasi lengkap tentang produk tersebut termasuk nama, berat, tanggal, dan supplier.

Setelah label dicetak dan ditempel pada pack, operator menggunakan Chainway C5 untuk melakukan scanning dan verifikasi bahwa label telah ter-encode dengan benar. Sistem C5 mampu membaca tag dengan cepat dan menampilkan informasi produk. Data dari scan ini kemudian dikirim ke backend middleware untuk logging dan validation. Seluruh proses dari penerimaan hingga labeling selesai dalam waktu 15-30 menit per truk.

### Tahap 2: Penyimpanan di Cold Storage dan Normal Storage

Setelah dilabeli dan diverifikasi, bahan makanan dikategorikan untuk ditempatkan di lokasi penyimpanan yang sesuai. Beberapa produk ditaruh di cold storage dengan suhu -20°C seperti daging, ayam, dan seafood. Produk lainnya disimpan di storage normal dengan suhu ruangan. Beberapa produk kemasan kaleng seperti sarden memerlukan metal tag khusus untuk mengurangi interferensi. Palet plastik yang berisi botol air memerlukan label yang tahan air agar tidak terjadi interferensi dari cairan.

Saat produk masuk ke area penyimpanan, operator melakukan scanning dengan C5 untuk mendaftarkan lokasi penyimpanan produk. Sistem mencatat Product ID, lokasi penyimpanan, dan timestamp. Untuk cold storage, sistem juga memantau suhu secara real-time dan memberikan alert jika ada penyimpangan. Setiap produk dapat dilacak posisinya dengan presisi tinggi melalui RFID scanning, memastikan stock rotation yang baik dengan metode FIFO (First In First Out).

### Tahap 3: Stock Opname dan Audit Inventory

Stock opname dilakukan secara berkala, mingguan atau bulanan, untuk memverifikasi akurasi inventory. Operator membawa Chainway C5 ke area penyimpanan dan melakukan bulk scanning untuk membaca semua tag dalam area tertentu. C5 mampu membaca lebih dari 1300 tag per detik, membuat proses verifikasi menjadi sangat cepat. Hasil scan dibandingkan dengan data di sistem untuk mengidentifikasi perbedaan.

Jika ada perbedaan, sistem mengidentifikasi apakah ada item yang hilang, item tambahan yang tidak terdaftar, atau produk yang sudah kadaluarsa. Laporan audit disusun dengan detail tentang discrepancy, produk expired, dan verifikasi akurasi lokasi. Hasil audit kemudian digunakan untuk update master inventory di Odoo ERP. Proses yang biasanya membutuhkan waktu 2-3 hari untuk dilakukan secara manual kini hanya membutuhkan 2-4 jam dengan akurasi mencapai 99.5% dibanding 85-90% pada metode manual.

### Tahap 4: Penerimaan di Cabang Dim Sum Inc

Ketika bahan makanan dikirim dari warehouse utama ke cabang Dim Sum Inc, operator di cabang melakukan receiving scan menggunakan C5. Semua tag dibaca dan diverifikasi bahwa EPC matches dengan Goods Receipt Note (GRN). Jumlah fisik dicocokkan dengan data sistem. Setiap produk didaftarkan lokasinya di warehouse cabang. Data dari scan ini langsung terupdate ke Odoo ERP melalui backend middleware, memastikan visibility inventory real-time di semua lokasi.

## Arsitektur Sistem

Sistem dirancang dengan tiga layer utama untuk memastikan reliabilitas dan skalabilitas. Layer pertama adalah Chainway C5 handheld reader yang berjalan di Android 11/13, bertugas melakukan RFID scanning di lapangan. C5 memiliki kapabilitas untuk read dan write tag secara langsung, dengan dukungan untuk konversi teks ke hexadecimal format yang kompatibel dengan SDK Chainway.

Layer kedua adalah backend server middleware yang berfungsi sebagai business logic center. Middleware menerima data scan dari C5 melalui REST API atau HTTP protocol. Di middleware, data divalidasi, diproses, dan stored di database. Middleware juga menangani konversi teks ke hexadecimal untuk operasi write, menyimpan history semua transaksi untuk audit trail, dan mengelola authentikasi serta logging.

Layer ketiga adalah Odoo ERP yang menjadi master data center dan reporting hub. Middleware berkomunikasi dengan Odoo menggunakan XML-RPC protocol untuk sync inventory, create stock movements, dan generate reports. Odoo menyimpan semua master data seperti product SKU, warehouse locations, dan business logic terkait inventory management.

## Hardware dan Label yang Digunakan

Chainway C5 adalah perangkat handheld reader dengan spesifikasi yang robust untuk lingkungan warehouse. Dilengkapi layar 6 inch beresolusi tinggi (2160x1080), CPU octa-core 2.3 GHz, RAM 4GB, dan storage 64GB. Baterai 6700 mAh dapat bertahan 12 jam penggunaan kontinu. Penting untuk aplikasi cold storage, C5 memiliki rating IP65 dan dapat beroperasi di suhu -20°C hingga +50°C. RFID reader terintegrasi mendukung frekuensi 865-928 MHz dengan read range hingga 30 meter dan kemampuan membaca 1300+ tags per detik.

CP30 adalah RFID printer berkemampuan print dan encode bersamaan. Dengan resolusi 203 DPI, kecepatan print 203 mm/s, dan layar touchscreen 3.5 inch berwarna. Printer ini dilengkapi module encode CM510-1 berbasis Impinj E510 chip, memungkinkan encoding langsung saat printing label.

Untuk label, digunakan dua tipe dari brand yang berbeda. EOS-241 M830 dari Tageos digunakan untuk makanan beku di cold storage karena mampu beroperasi di suhu ekstrem -40°C hingga +85°C. Label ini memiliki memory 128 bit EPC dan TID 96 bit, read range hingga 8 meter, dan ukuran 18x44 mm dengan antenna aluminium. Ci-T5055 dari Cirfid digunakan untuk produk kaleng dan kemasan cair karena desainnya yang anti-metal dan anti-liquid, dengan operating temperature -20°C hingga +75°C, memory 96 bit, dan ukuran 58.5x21 mm.

## Konversi Text ke Hexadecimal

Sistem dirancang untuk memudahkan operator yang tidak familiar dengan format hexadecimal. Ketika operator melakukan input produk, mereka cukup mengetik informasi dalam teks biasa seperti "AYAM 5KG 20NOV2025". Sistem secara otomatis mengkonversi teks ini ke format hexadecimal yang sesuai standar EPC.

Format EPC yang digunakan adalah 96-bit dengan struktur: Header (8 bit), EPC Manager (28 bit untuk company/product code), Object Class (24 bit untuk product type), dan Serial Number (36 bit untuk unique identifier). Contohnya, input "AYAM" dikonversi menjadi "4159414D" dalam hex, angka 5000 (gram) menjadi "1388", dan tanggal 20-11-2025 menjadi "130F1E19".

Proses konversi dilakukan di backend middleware untuk memastikan konsistensi format. Data operator diterima, di-parse untuk extract field, divalidasi, kemudian dikonversi ke hex format. Hasil konversi ini kemudian digunakan oleh CP30 untuk encoding pada label RFID yang akan dicetak. Dengan cara ini, operator tidak perlu mengerti teknis hexadecimal dan sistem tetap menjaga akurasi data.

## Integrasi dengan Odoo ERP

Seluruh data dari lapangan terintegrasi ke Odoo ERP untuk manajemen bisnis yang komprehensif. Ketika C5 melakukan scan, data dikirim ke backend middleware melalui REST API. Middleware kemudian melakukan konversi EPC kembali ke informasi produk dan lokasi. Middleware menggunakan XML-RPC protocol untuk berkomunikasi dengan Odoo dan create/update stock movements.

Odoo menerima data scan dalam format: product ID, location ID, quantity, EPC tag, dan timestamp. Berdasarkan data ini, Odoo otomatis update inventory count, track lokasi penyimpanan, dan record movement history. Untuk stock opname, Odoo membuat reconciliation records yang membandingkan physical count dari C5 dengan system records. Jika ada discrepancy, laporan detail dibuat untuk investigation. Setiap transaksi tercatat di audit trail Odoo untuk keperluan compliance dan reporting.

## Timeline Implementasi

Implementasi sistem dirancang dalam lima fase utama. Fase pertama Setup & Configuration membutuhkan 1-2 minggu untuk integrasi C5 SDK, setup printer CP30, dan persiapan label stock. Fase kedua Middleware Development membutuhkan 2-3 minggu untuk develop backend API, build text-to-hex converter engine, dan setup logging system.

Fase ketiga Odoo Integration membutuhkan 1-2 minggu untuk build XML-RPC connector, setup inventory sync process, dan create custom reports. Fase keempat Testing & UAT membutuhkan 1-2 minggu untuk end-to-end workflow testing dan pilot di salah satu cabang. Fase kelima Go-Live membutuhkan 1 minggu untuk production deployment, staff training, dan cutover dari sistem lama. Total waktu implementasi adalah 6-10 minggu dari kick-off hingga production ready.

## KPI dan Target Performa

Sistem ini target untuk meningkatkan efisiensi secara signifikan. Stock opname yang biasanya butuh 2-3 hari dengan metode manual dapat diselesaikan dalam 2-4 jam dengan RFID. Akurasi inventory meningkat dari 85-90% menjadi 99.5% dengan pembacaan otomatis tag. Waktu receiving per unit turun dari 2-3 menit menjadi 5-10 detik. Data entry error berkurang dari 2-5% menjadi kurang dari 0.1% karena otomasi. Cold chain compliance menjadi 100% termonitor dengan real-time temperature tracking dibanding tracking manual sebelumnya. GRN processing time turun dari 15-30 menit menjadi kurang dari 5 menit.

## Keamanan dan Compliance

Sistem dirancang dengan standar keamanan enterprise. Komunikasi antara C5 dan middleware menggunakan SSL/TLS encryption. Setiap user harus login dan akses dikontrol berdasarkan role untuk mencegah unauthorized access. Semua transaksi dicatat di audit trail Odoo untuk compliance purpose. Cold storage temperature dimonitor 24/7 dengan alert automatic jika ada penyimpangan suhu. Database ERP dibackup setiap hari dan disimpan di lokasi terpisah untuk disaster recovery. Data supplier dan produk dijaga sesuai regulasi GDPR.

## Penutup

Solusi RFID untuk Dim Sum Inc memberikan keunggulan kompetitif melalui automasi penuh receiving, penyimpanan yang akurat di cold chain, dan real-time inventory visibility. Dengan integrasi Odoo ERP, data terintegrasi end-to-end dari warehouse hingga cabang, memungkinkan management untuk membuat keputusan berbasis data yang akurat. Sistem ini diharapkan memberikan ROI dalam 6-12 bulan dengan peningkatan efisiensi 60-70% dan pengurangan error 95%+.

---

**Versi:** 1.0  
**Tanggal Update:** November 3, 2025  
**Kontak:** Muhammad Agung Ferdiansyah, PT Delta Solusi Nusantara
