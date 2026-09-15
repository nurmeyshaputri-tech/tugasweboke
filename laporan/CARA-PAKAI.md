# Laporan UTS — Analisis dan Perbandingan Model Desain Pembelajaran

**Judul lengkap:** Analisis dan Perbandingan Model Desain Pembelajaran ADDIE, Dick and Carey,
dan Morrison, Ross, and Kemp
**Penulis:** Nur Meysha Putri (NIM 2405176002) — S1 Pendidikan Komputer, Universitas Mulawarman
**Mata kuliah:** Perancangan Teknologi Pendidikan Berkelanjutan

---

## 1. Berkas utama

| Berkas | Keterangan |
|---|---|
| `Laporan_UTS_Perbandingan_Model_Desain_Pembelajaran.docx` | Laporan lengkap siap pakai (Word) |
| `Laporan_UTS_Perbandingan_Model_Desain_Pembelajaran.md` | Versi teks untuk disalin ke aplikasi lain |
| `aset/*.png` | Delapan gambar (flowchart, diagram irisan, use case, DFD) hasil ekspor 300 dpi |
| `skrip/isi_laporan.py` | Seluruh teks laporan |
| `skrip/build_docx.py` | Program pembuat berkas Word |
| `skrip/ekspor_markdown.py` | Program pembuat versi teks |
| `skrip/flowchart_model.py` | Pembuat flowchart ADDIE, Dick and Carey, Kemp, dan diagram irisan |
| `skrip/diagram_tambahan.py` | Pembuat diagram MRK, use case, dan DFD |

## 2. Langkah setelah membuka berkas Word

1. **Tempelkan logo Universitas Mulawarman** pada halaman cover, di bagian yang sudah diberi
   penanda `[ Tempatkan logo Universitas Mulawarman di bagian ini ]`, lalu hapus penanda tersebut.
2. **Perbarui Daftar Isi, Daftar Gambar, dan Daftar Tabel.** Nomor gambar dan tabel sudah tertulis
   tetap (Gambar 2.1–2.8 dan Tabel 2.1–2.9, Tabel A.1), tetapi nomor halaman pada daftar perlu
   diperbarui: klik kanan pada daftar → **Update Field** → **Update entire table**, atau tekan **F9**
   lalu pilih *Update entire table*.
3. **Periksa penomoran halaman** pada bagian bawah. Bagian awal (kata pengantar dan daftar)
   memakai angka Romawi kecil, sedangkan isi laporan dimulai dari halaman 1 pada Bab I.
4. Simpan dalam format `.docx` atau ubah menjadi `.pdf` bila dosen meminta berkas PDF
   (File → Save As → PDF, atau File → Export).

## 3. Cara membuat ulang laporan (opsional)

Seluruh isi laporan dihasilkan dari kode, sehingga perubahan teks dapat dilakukan pada
`skrip/isi_laporan.py`, kemudian dijalankan:

```bash
cd skrip
python3 flowchart_model.py      # membuat ulang 4 gambar model
python3 diagram_tambahan.py     # membuat ulang diagram MRK, use case, dan DFD
python3 build_docx.py           # membuat berkas Word
python3 ekspor_markdown.py      # membuat versi teks
```

Kebutuhan pustaka: `python-docx` dan `matplotlib` (`pip install python-docx matplotlib`).

## 4. Catatan mengenai sumber

Seluruh sitasi dalam teks bersesuaian dengan entri pada Daftar Pustaka (format APA edisi ke-7).
Sumber yang digunakan berupa buku teks desain pembelajaran, artikel jurnal, dokumen lembaga,
serta artikel jurnal Indonesia yang relevan. Tidak ada sumber atau nama penulis yang dikarang.

Penjelasan mengenai kemungkinan kekeliruan penyebutan model (empat nama untuk tiga model) dapat
dilihat pada **Subbab 1.5** laporan.
