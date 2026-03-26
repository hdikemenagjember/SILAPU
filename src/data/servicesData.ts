export const defaultServicesData = [
  {
    name: "Rekomendasi Pembukaan Kantor Cabang Penyelenggara Perjalanan Ibadah Umroh (PPIU)",
    description: `Syarat untuk Rekomendasi Pembukaan Kantor Cabang Penyelenggara Perjalanan Ibadah Umroh (PPIU)
1. Surat Permohonan Rekomendasi
2. FC SK Izin PPIU/PIHK
3. FC AKta Notaris
4. Surat Keterangan Domisili
5. FC KTP Pimpinan Cabang
6. FC NPWP kepala Kantor Cabang
7. Lampiran Kantor Cabang dari system OSS`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Mutasi Siswa",
    description: `Syarat untuk layanan mutasi siswa madrasah 
1. Surat Permohonan Rekomendasi Mutasi Siswa dari Madrasah Asal
2. Surat Mutasi Keluar
3. Surat Penerimaan dari sekolah yang di tuju
4. FC Rapor Siswa`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Rekomendasi Kegiatan",
    description: `Syarat untuk layanan rekomendasi Kegiatan
1. Surat Permohonan Rekomendasi
2. Proposal Kegiatan`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Pergantian Kepala Madrasah",
    description: `Syarat untuk Pergantian Kepala Madrasah
1. Surat Permohonan Rekomendasi Pergantian Kepala Madrasah
2. Berita Acara Pergantian Kepala Madrasah
3. Daftar Hadir Peserta Rapat Pergantian Kepala Madrasah
4. SK Guru Tetap Yayasan Awal dan Terakhir 
5. SK Pengangkatan Sebagai Kepala Madrasah
6. FC KTP
7. FC IJazah Terakhir dan Transkip Nilai
8. Form A.09
9. Curiculum Vitae Kamad Baru
10. Rekomendasi Dari Kamad Lama
11. Rekomendasi Pengawas Madrasah`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Rekomendasi Pergantian Specimen TTD Kamad/Bendahara Madrasah",
    description: `Syarat untuk Pengantian Specimen TTD Kamad/Bendahara Madrasah
1. Surat Permohonan Rekomendasi Pergantian Specimen 
2. SK Pengangkatan Sebagai Kepala Madrasah/Bendahara
3. FC KTP
4. FC Izin Operasional Madrasah
5. FC Rekening BOS/BOP`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Rekomendasi Bantuan Sarana Prasarana Madrasah",
    description: `Syarat Layanan Rekomendasi Bantuan Sarpras Madrasah
1. Surat Permohonan Rekomendasi
2. Proposal Bantuan Sarana Prasarana`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Rekomendasi Ijin Operasional Madrasah",
    description: `Syarat Layanan Rekomendasi Ijin Operasional Madrasah
1. Surat permohonan Rekomendasi Ijin Operasional Madrasah
2. Proposal Ijin Pendirian Madrasah`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Legalisir Ijazah Madrasah/PKPPS",
    description: `Syarat Layanan Legalisir Ijazah Madrasah/PKPPS
1. Ijazah Asli
2. FC Ijazah Maximal 10 Lembar yang telah dilegalisir oleh madrasah asal
3. Untuk PKPPS membawa daftar keluluasan dari lembaga`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Pengesahan Surat Keterangan Pengganti Ijazah/SKHUN",
    description: `Syarat Layanan Surat Keterangan Pengganti Ijazah/SKHUN
1. Formulir Permohonan Surat Keterangan Pengganti Ijazah/SKHUN
2. Surat Keterangan Kehilangan dari kepolisian
3. Surat Pernyataan Tanggung Jawab Mutlak dari yang bersangkutan
4. FC Ijazah/SKHUN
5. Surat Keterangan Saksi seangkatan sebanyak 2 orang
6. Dokumen Pendukung lainnya (KTP,KK,Akta Kelahiran)
7. Surat kuasa apabila pengurusannya dikuasakan
8. Surat Keterangan Pengganti Ijazah dari Madrasah`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Pengesahan Surat Keterangan Kesalahan Penulisan Ijazah",
    description: `Syarat Layanan Surat Keterangan Kesalahan Penulisan Ijazah/SKHUN
1. Formulir Permohonan Surat Keterangan Kesalahan Penulisan Ijazah/SKHUN
2. Surat Pernyataan Tanggung Jawab Mutlak dari yang bersangkutan
3. FC Ijazah/SKHUN
4. Dokumen Pendukung lainnya sesuai kesalahannya (Akta Kelahiran,KK,KTP NISN dll)
5. Surat kuasa apabila pengurusannya dikuasakan
6. Surat Keterangan Kesalahan Penulisan dari Madrasah Asal`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Pengesahan Surat Keterangan kerusakan Ijazah",
    description: `Syarat Layanan Surat Keterangan Kerusakan Ijazah/SKHUN
1. Formulir Permohonan Surat Keterangan Kerusakan Ijazah/SKHUN
2. Surat Pernyataan Tanggung Jawab Mutlak dari yang bersangkutan
3. FC Ijazah/SKHUN
4. Dokumen Pendukung lainnya (Akta Kelahiran,KK,KTP NISN dll)
5. Surat kuasa apabila pengurusannya dikuasakan
6. Surat Keterangan Kerusakan Ijazah dari Madrasah Asal`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Permohonan Ijin penelitian",
    description: `Syarat Layanan Ijin Penelitian :
1. Surat Permohonan dari instansi terkait
2. Rekomendasi dari Bakesbangpol`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Pernohonan Rohaniwan",
    description: `Syarat layanan Rohaniwan 
1. Permohonan Bantuan Rohaniwan yang ditujukan kepada kepala Kankemenag Kab Jember dengan menyebutkan rohaiwan Agama yang dibutuhkan`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Data Keagamaan dan Pendidikan",
    description: `Syarat Layanan Data Keagamaan dan Pendidikan
1. Surat permohoan permintaan data dari lembaga/instansi yang ditujukan kepada kepala kantor kementerian Agama Kab.Jember`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Permohonan Narasumber",
    description: `Syarat layanan permohonan Narasumber sbb :
1. Surat permohonan ditujukan kepada kepala kantor kemenag kab jember`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Piagam Masjid/musholla",
    description: `Syarat Layanan Piagam Masjid/musholla :
1. Surat Permohonan penerbitan Piagam Masjid/Musholla dari Takmir
2. Rekomendasi dari KUA setempat
3. Profil masjid/Musholla
4. Susunan takmir masjid/musholla
5. Foto masjid/musholla dan Sarprasnya
6. Formulir Data masjid /musholla
7. Salinan kepemilikan Tanah/Akta ikrar Wakaf`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Muallaf",
    description: `Syarat Layanan menjadi Muallaf
1. Surat Permohonan Muallaf
2. FC KTP yang bersangkutan
3. FC KK yang bersangkutan
4. FC KTP Saksi dari yang bersangkutan 1 orang
5. Materai @Rp.10.000 1 lembar
6. Pas Photo berwarna ukuran 3 x4 sejumlah 2 lembar`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Piagam Majelis Taklim",
    description: `Syarat Layanan Penerbitan SK dan Piagam Majelis Taklim
1. Surat Permohonan
2. SK pengurus
3. Surat Keterangan Domisili
4. Data Anggota Majelis Taklim
5. Rekomendasi dari KUA`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Pendaftaran Nikah",
    description: `Syarat Layanan Pendaftaran Nikah
1. surat pengantar nikah dari desa/kelurahan tempat tinggal Catin;
2. foto kopi akta kelahiran;
3. foto kopi kartu tanda penduduk;
4. foto kopi kartu keluarga;
5. surat rekomendasi nikah dari KUA setempat bagi Catin yang melangsungkan nikah di luar wilayah kecamatan tempat tinggalnya;
6. surat keterangan sehat dari fasilitas kesehatan;
7. persetujuan Catin;
8. izin tertulis orang tua atau wali bagi Catin yang belum mencapai usia 21 (dua puluh satu) tahun;
9. izin dari wali yang memelihara atau mengasuh atau keluarga yang mempunyai hubungan darah atau pengampu, dalam hal kedua orang tua atau wali sebagaimana dimaksud dalam angka 8 meninggal dunia atau dalam keadaaan tidak mampu menyatakan kehendaknya;
10. izin dari Pengadilan, dalam hal orang tua, wali, dan pengampu tidak ada;
11. surat dispensasi kawin dari Pengadilan bagi Catin yang belum berusia 19 (sembilan belas) tahun dihitung pada tanggal pelaksanaan akad nikah;
12. surat izin dari atasan atau kesatuan jika Catin berstatus anggota Tentara Nasional Indonesia atau anggota Kepolisian Republik Indonesia;
13. penetapan izin poligami dari Pengadilan bagi suami yang hendak beristri lebih dari seorang;
14. akta cerai atau kutipan buku pendaftaran talak atau buku pendaftaran cerai bagi mereka yang perceraiannya terjadi sebelum berlakunya Undang-Undang Nomor 7 Tahun 1989 tentang Peradilan Agama; dan
15. akta kematian bagi janda atau duda ditinggal mati.

*Dalam hal warga negara Indonesia yang tinggal di luar negeri dan sudah tidak memiliki dokumen kependudukan, persyaratan pernikahan sebagai berikut:*
a. surat pengantar dari perwakilan Republik Indonesia di luar negeri;
b. persetujuan kedua Catin;
c. Izin tertulis orang tua atau wali bagi Catin yang belum mencapai usia 21 (dua puluh satu) tahun;
d. penetapan izin poligami dari pengadilan bagi suami yang hendak beristri lebih dari seorang;
e. akta cerai atau surat keterangan cerai dari instansi yang berwenang; dan
f. akta kematian bagi duda dan janda ditinggal mati.

*Bagi warga negara asing yang akan menikah dengan warga negara Indonesia, persyaratan pernikahan sebagai berikut:*
a. surat keterangan status tidak ada halangan untuk menikah/certificate of no impediment dari kedutaan atau kantor perwakilan dari negara yang bersangkutan;
b. bagi negara asing yang telah memberlakukan sertifikat apostille, dokumen yang berisi surat keterangan status/tidak ada halangan menikah yang dikeluarkan lembaga berwenang dari Negara asing diilengkapi dengan fotokopi sertifikat apostile;
c. izin poligami dari pengadilan atau instansi yang berwenang pada negara asal Catin bagi suami yang hendak beristri lebih dari seorang;
d. melampirkan foto kopi akta kelahiran;
e. melampirkan akta cerai atau surat keterangan kematian bagi duda atau janda;
f. melampirkan foto kopi paspor; dan
g. melampirkan data kedua orang tua.`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Pendataran Tanah Wakaf",
    description: `Syarat pendaftaran tanah wakaf
1. Tanah milik Pribadi
2. FC KTP wakif
3. FC KK Wakif
4. FC KTP Nadzir
5. FC KK Nadzir
6. Status Kepemilikan Tanah yang sah (SHM,Akta Jual Beli atau dokumen lainnya yang sah)
7. Surat pernyataan tanah tidak dalam sengketa.
8. Surat keterangan tanah dari desa/kelurahan (jika belum bersertifikat).
9. Peta bidang tanah dari BPN (jika ada).
10. Bukti SPPT PBB (jika ada).
11. Surat keterangan ahli waris wakif apabila nama yang tertera pada bukti kepemilikan tanah sudah meninggal dunia
12. Surat kuasa wakif dari ahli waris apabila ahli waris lebih dari satu
13. Materai @Rp.10.000 4 lembar`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Jadwal Sholat",
    description: `Syarat permohonan Jadwal Sholat
1. Surat permohonan`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Pengajuan Izin Operasional Pesantren",
    description: `Syarat layanan Permohonan Izin Operasional Pesantren
1. Asli Scan Surat Permohonan Pendaftaran Keberadaan Pesantren (Pesantren Induk).
2. Asli Scan Formulir Pengajuan Pendaftaran Keberadaan Pesantren (Pesantren Induk).
3. Asli Scan Surat Pernyataan.
4. Data Santri Mukim.
5. Data Tenaga Pendidik.
6. Data Tenaga Kependidikan.
7. Data Kurikulum Pesantren.
8. Daftar Kitab Kuning.
9. Asli Scan Ijazah/Syahadah bukti lulusan Pesantren/satuan pendidikan dengan kompetensi ilmu agama Islam sesuai nama pimpinan/pengasuh Pesantren.
10. Asli Scan Kartu Tanda Penduduk (KTP) pendiri perseorangan, pimpinan Yayasan, pimpinan Ormas, atau pimpinan perkumpulan masyarakat.
11. Asli/Salinan Scan Nomor Pokok Wajib Pajak (NPWP).
12. Asli/Salinan Scan Akta Notaris Yayasan (silakan disesuaikan).
13. Asli/Salinan Scan SK Kemenkumham Pengesahan Pendirian Badan Hukum Yayasan (silakan disesuaikan).
14. Asli/Salinan Scan Akta Notaris Organisasi Perkumpulan/AD-ART (silakan disesuaikan).
15. Asli/Salinan Scan SK Kemenkumham Pengesahan Pendirian Badan Hukum Ormas (silakan disesuaikan).
16. Asli/Salinan Scan halaman bukti kepemilikan tanah.
17. Asli Scan Surat Keterangan Domisili Dari Kelurahan/Desa.
18. Asli Scan Rekomendasi dari Ormas Keagamaan Islam.
19. Dokumentasi Foto Struktur Organisasi Pesantren.
20. Dokumentasi Foto Papan Nama Pesantren.
21. Dokumentasi Foto Masjid/Mushalla.
22. Dokumentasi Foto Ruang Belajar.
23. Dokumentasi Foto Aktivitas Pembelajaran Kitab Kuning.
24. Dokumentasi Foto Gambar Denah Pesantren.
25. Dokumentasi Foto Dapur.
26. Dokumentasi Foto MCK/Sanitasi

Persyaratan lain yg Harus Terpenuhi:
1. Memiliki paling sedikit 15 (lima belas) santri mukim yang tidak terdaftar di satuan pendidikan lainnya; 
2. Sekurang-kurangnya menyelenggarakan Pesantren dalam fungsi pendidikan; 
3. Memenuhi unsur Pesantren (arkanul ma’had) yang terdiri dari keberadaan Kiai, Santri Mukim, Pondok atau Asrama Pesantren, Masjid atau Mushalla, serta Kajian Kitab Kuning atau Dirasah Islamiyahdengan Pola Pendidikan Mu’allimin; 
4. Mengembangkan nilai Islam rahmatan lil'alamin dan berlandaskan Pancasila, Undang-Undang Dasar 1945, Negara Kesatuan Republik Indonesia, serta Bhinneka Tunggal Ika yang dikembangkan sebagai jiwa pesantren (ruhul ma’had) yang meliputi Jiwa Negara Kesatuan Republik Indonesia (NKRI) dan Nasionalisme, Jiwa Keilmuan, Jiwa Keikhlasan, Jiwa Kesederhanaan, Jiwa Ukhuwah, Jiwa Kemandirian, Jiwa Kebebasan, dan Jiwa Keseimbangan; 
5. Berkomitmen dalam pencapaian tujuan umum Pesantren yang sejalan dengan visi, misi, dan tujuan pembangunan nasional; Berkomitmen dalam membangun moral dan karakter melalui keteladanan/panutan, membangun kecerdasan dan kompetensi keahlian santri, memberikan kasih sayang dan perlindungan serta pemenuhan hak santri sesuai dengan usianya`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Pengajuan Izin Operasional Madrasah Diniyah (Madin)",
    description: `Syarat pengajuan Izin Operasional Madrasah Diniyah
1. Surat permohonan izin operasional kepada Kepala Kankemenag Kab. Jember;
2. Melampirkan berkas dokumen dengan rincian sebagai berikut :
a. Nama Madrasah Diniyah dibuktikan dengan surat keterangan domisili dari desa/kelurahan;
b. FC KTP Kepala Madrasah Diniyah dan pengajar;
c. Surat pernyataan bermaterai 10.000,-;
d. Profil yang menyebutkan jenis jenjang Madrasah Diniyah yang diselenggarakan;
e. Daftar nama santri, minimal 15 santri;
f. Daftar nama guru, minimal 2 ustad/ustadzah;
g. Daftar nama tenaga administrasi;
h. Data sarana dan prasarana;
i. Kurikulum dan jadwal pelajaran;
j. Foto KBM;
k. FC Akta Notaris Yayasan;
l. FC SK Menkumham yayasan;
m. Surat rekomendasi dari KUA Setempat;`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Pengajuan Izin Operasional LPQ",
    description: `Syarat pengajuan Izin Operasional Lembaga Pendidikan Al Qur’an
Persyaratan di bawah ini dalam bentuk Proposal dilampiri hal hal berikut:
1. Surat Permohonan izin Operasional Lembaga Pendidikan Al-Qur’an
2. Profile Lembaga Pendidikan Al-Qur’an.
3. Struktur Lembaga Pendidikan Al-Qur’an.
4. Surat Pernyataan bermaterai 10.000 yang ditandatangani Kepala Pendidikan Al-Qur’an (sesuai format terlampir).
5. Daftar Nama Ustadz / Ustadzah Lembaga Pendidikan Al-Qur’an.
6. Daftar Nama Santri Lembaga Pendidikan Al-Qur’an.
7. Surat Keterangan Domisili dari Desa/Kelurahan.
8. Fotocopy Akte Notaris Yayasan (mulai Halaman Sampul sampai halaman terakhir).
9. Fotocopy SK Menkumham.
10. Jadwal Pelajaran Lembaga Pendidikan Al-Qur’an.
11. Foto – foto Kegiatan belajar mengajar Lembaga Pendidikan Al-Qur’an.

Menyiapkan berkas-berkas pendaftaran (file scan) untuk di upload di aplikasi sebagai berikut :
1. Surat Permohonan izin Operasional Lembaga Pendidikan Al-Qur’an
2. Profil LPQ
3. Susunan Pengurus
4. SK Kepala dan Tenaga Pengajar
5. Data Kepala dan Tenaga Pengajar
6. Foto Copy Ijazah Kepala dan Tenaga Pengajar
7. Foto Copy Syahadah Kepala atau Tenaga Pengajar
8. Data Santri
9. Surat Keterangan Tanah *
10. Akta Notaris Yayasan *
11. Surat Keterangan Domisili Lembaga dari Kelurahan
12. Denah Lokasi`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "IJOP PKPPS",
    description: `Syarat Pendaftaran PKPPS 
1. Penyelenggara pendidikan merupakan organisasi berbadan hukum
2. Memiliki Nomor Statistik Pondok Pesantren (NSPP);
3. Mendapat rekomendasi dari Kepala Kantor Kementerian Agama Kabupaten/Kota;
4. Memiliki struktur organisasi, Anggaran Dasar/Anggaran Rumah Tangga (AD/ART), dan pengurus penyelenggara pendidikan kesetaraan;
5. Kesiapan pelaksanaan kurikulum pendidikan kesetaraan
6. Kualifikasi tenaga pendidik/ustadz mata pelajaran
7. Tersedia tenaga kependidikan paling sedikit meliputi penanggungjawab pendidikan kesetaraan dan tenaga administrasi;
8. Tersedia sarana dan prasarana belajar;
9. Memiliki rencana pembiayaan pendidikan;
10. Telah melaksanakan proses pembelajaran minimal 2 tahun pelajaran; dan
11. Bersedia dan sanggup melaksanakan pendidikan kesetaraan pada Pondok Pesantren Salafiyah dibuktikan dengan surat pernyataan`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Rekomendasi Bantuan Sarana Prasarana Pondok Pesantren/Madin/TPQ",
    description: `Syarat Rekomendasi Bantuan Sarpras
1. Surat Permohonan
2. Piagam Ijin Operasional Pondok Pesantren/Madin/LPQ
3. Proposal`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Permohonan Ijin Studi ke luar Negeri",
    description: `Syarat Rekomendasi Studi Ke Luar Negeri
1. Surat Permohonan dari Pondok Pesantren (apabila Ponpes berada di Jember)/ Dari yang bersangkutan bila pondok pesantren di luar jember (pemohon ber KTP Jember)
2. Rekomendasi dari Pondok pesantren/madrasah
3. Surat pernyataan orangtua
4. FC Ijazah terakhir
5. FC Paspor
6. FC KTP yang bersangkutan
7. FC KK
8. FC KTP orang tua
9. Flyer /Pamflet penerimaan pendaftaran mahasiswa baru`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Ijin Tinggal Sementara (ITAS) bagi Warga Negara Asing",
    description: `Syarat pengajuan ijin tinggal sementara (ITAS) bagi Warga Negara Asing
1. Surat persetujauan dari Keapala Kantor Kementeran Agama atau Kepala Kantor Wilayah, dan Direktur Jenderal terkait atau Kepala Pusat bagi rohaniawan, pengajar, atau tenaga ahli yang bertugas di luar lembaga pendidikan tinggi;
2. Surat persetujuan dari Rektor/Ketua Perguruan tinggi keagamaan, dan Direktur Jenderal terkait atau Kepala pusat bagi pengajar atau tenaga ahli yang bertuagas di perguruan tinggi Keagamaan;
3. Legalitas lembaga, izin operasional atau surat keterangan terdafta;
4. Foto copi RPTKA
5. Data statistik jumlah umat atau peserta didik yang di layani
6. Fotokopi Paspor dan Visa orang Asing berwarna;
7. Fotokopi polis Asuransi kesehatan Orang Asing untuk Jangka waktu kunjungan ;
8. Daftar riwayat hidup Orang Asing;
9. Fotokopi ijazah Pendidikan terahir Orang Asing
10. Surat Jaminan dari lembaga pengguna Orang asing di atas kertas bermaterai;
11. Surat tugas dari lembaga negara asal atau lembaga pengguna Orang Asing;
12. Pasfoto terbaru berwarna ukuran 4x6 dengan latarbelakang warna merah.`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Permohonan Pembuatan Akun Siaga dan EMIS PAI",
    description: `Syarat Pembuatan akun siaga dan EMIS PAI
1. Surat Permohonan Akun SIAGA atau EMIS dari Kepala Sekolah mengetahui Pengawas PAI ditujukan Kepada Kepala Kantor Kementerian Agama Kab. Jember;
2. Foto Copy SK awal dan SK akhir, sebagai guru PAI
3. Foto Copy SK Pembagian Tugas Mengajar
4. Foto Copy KTP dan KK
5. Profil Guru dari DAPODIK`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  },
  {
    name: "Pengaduan Masyarakat",
    description: `Syarat Pengaduan masyarakat :
1. Data Identitas Diri /KTP/SIM
2. Kronologis Peristiwa yang dilaporkan
3. Bukti dukung berupa Dokumen,Foto,Video

Alur Layanan :
- Seluruh berkas di jadikan 1 file PDF dan dikirimkan ke nomor WA ini 
- Admin WA center akan meneruskan pengaduan kepada Pimpinan atau kepala seksi yang membidangi
- Hasil TL akan di sampaikan kepada pelapor`,
    isActive: true,
    fields: [
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true },
      { name: 'keperluan', label: 'Keperluan / Keterangan', type: 'textarea', required: true },
      { name: 'berkas_pendukung', label: 'Berkas Pendukung (PDF/JPG)', type: 'file', required: true }
    ]
  }
];
