"""
ekspor_markdown.py — Menghasilkan versi teks (Markdown) dari isi laporan.

Berkas keluaran: ../Laporan_UTS_Perbandingan_Model_Desain_Pembelajaran.md
Berguna apabila isi laporan perlu disalin ke aplikasi lain atau dibaca tanpa Word.
"""

import importlib.util
import os

BASE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("isi", os.path.join(BASE, "isi_laporan.py"))
isi = importlib.util.module_from_spec(spec)
spec.loader.exec_module(isi)

L = []


def h(teks, level=1):
    L.append("#" * level + " " + teks + "\n")


def p(teks):
    L.append(teks + "\n")


def ol(butir, angka=True):
    for i, b in enumerate(butir, 1):
        L.append(f"{i}. {b}" if angka else f"- {b}")
    L.append("")


def tabel(t):
    L.append("| " + " | ".join(t["header"]) + " |")
    L.append("|" + "---|" * len(t["header"]))
    for baris in t["baris"]:
        L.append("| " + " | ".join(str(x).replace("\n", " ") for x in baris) + " |")
    L.append("")


h("LAPORAN TUGAS UJIAN TENGAH SEMESTER (UTS)", 1)
p("**Mata Kuliah:** Perancangan Teknologi Pendidikan Berkelanjutan\n")
p("**Judul:** Analisis dan Perbandingan Model Desain Pembelajaran ADDIE, Dick and Carey, "
  "dan Morrison, Ross, and Kemp\n")
p("**Disusun oleh:** Nur Meysha Putri (NIM 2405176002)\n")
p("**Program Studi S1 Pendidikan Komputer — Fakultas Keguruan dan Ilmu Pendidikan — "
  "Universitas Mulawarman, Samarinda, 2026**\n")

h("KATA PENGANTAR", 1)
for t in isi.KATA_PENGANTAR:
    p(t)

h("BAB I PENDAHULUAN", 1)
h("1.1 Latar Belakang", 2)
for t in isi.LATAR_BELAKANG:
    p(t)
h("1.2 Rumusan Masalah", 2)
ol(isi.RUMUSAN_MASALAH)
h("1.3 Tujuan Penulisan", 2)
ol(isi.TUJUAN)
h("1.4 Manfaat Penulisan", 2)
p("Secara teoretis, laporan ini diharapkan dapat memperkaya pemahaman mengenai kerangka kerja "
  "perancangan pembelajaran dan kedudukannya dalam bidang teknologi pendidikan. Secara praktis, "
  "hasil kajian ini dapat digunakan oleh mahasiswa, guru, dosen, maupun pengembang media sebagai "
  "pertimbangan dalam memilih model perancangan yang sesuai dengan konteks pekerjaannya.")
for t in isi.MANFAAT:
    p(t)
h("1.5 Catatan tentang Penamaan dan Jumlah Model yang Dibandingkan", 2)
for t in isi.CATATAN_PENAMAAN:
    p(t)

h("BAB II PEMBAHASAN", 1)
h("2.1 Konsep Dasar Model Desain Pembelajaran", 2)
for blok, judul in [(isi.KONSEP_DASAR, None), (isi.KONSEP_DESAIN, "2.1.1 Pengertian Desain Pembelajaran"),
                    (isi.KONSEP_MODEL, "2.1.2 Model Desain Pembelajaran dan Fungsinya"),
                    (isi.KONSEP_TP, "2.1.3 Keterkaitan dengan Teknologi Pendidikan dan Pendidikan Berkelanjutan")]:
    if judul:
        h(judul, 3)
    for t in blok:
        p(t)

h("2.2 Model ADDIE", 2)
h("2.2.1 Pengertian dan Tujuan Penggunaan", 3)
for t in isi.ADDIE_PENGERTIAN:
    p(t)
h("2.2.2 Sejarah Singkat dan Perdebatan Asal-Usulnya", 3)
for t in isi.ADDIE_SEJARAH:
    p(t)
h("2.2.3 Lima Tahap Model ADDIE", 3)
for t in isi.ADDIE_TAHAP_PENGANTAR:
    p(t)
for tahap in isi.ADDIE_TAHAP:
    p("**" + tahap["nama"] + "**")
    for t in tahap["isi"]:
        p(t)
p("**Tabel 2.1.** Ringkasan lima tahap model ADDIE")
tabel(isi.ADDIE_TABEL)
h("2.2.4 Diagram Alur Model ADDIE", 3)
for t in isi.ADDIE_DIAGRAM:
    p(t)
p("*(Gambar 2.1: flowchart_addie.png — lihat berkas Word)*\n")

h("2.3 Model Dick and Carey", 2)
h("2.3.1 Pengertian dan Kedudukan Model", 3)
for t in isi.DC_PENGERTIAN:
    p(t)
h("2.3.2 Tujuan dan Karakteristik Model", 3)
for t in isi.DC_KARAKTERISTIK:
    p(t)
h("2.3.3 Sepuluh Komponen Model Dick and Carey", 3)
for t in isi.DC_KOMPONEN_PENGANTAR:
    p(t)
for komp in isi.DC_KOMPONEN:
    p("**" + komp["nama"] + "**")
    for t in komp["isi"]:
        p(t)
p("**Tabel 2.2.** Ringkasan komponen model Dick and Carey")
tabel(isi.DC_TABEL)
h("2.3.4 Flowchart Model Dick and Carey", 3)
for t in isi.DC_FLOWCHART_TEKS:
    p(t)
p("*(Gambar 2.2: flowchart_dick_carey.png — lihat berkas Word)*\n")

h("2.4 Model Morrison, Ross, and Kemp", 2)
h("2.4.1 Pengertian dan Perkembangan Model Kemp", 3)
for t in isi.MRK_PENGERTIAN:
    p(t)
h("2.4.2 Karakteristik Utama", 3)
for t in isi.MRK_KARAKTERISTIK:
    p(t)
h("2.4.3 Sembilan Komponen Model Morrison, Ross, and Kemp", 3)
for t in isi.MRK_KOMPONEN_PENGANTAR:
    p(t)
for komp in isi.MRK_KOMPONEN:
    p("**" + komp["nama"] + "**")
    for t in komp["isi"]:
        p(t)
p("**Tabel 2.3.** Ringkasan sembilan komponen model Morrison, Ross, and Kemp")
tabel(isi.MRK_TABEL)
h("2.4.4 Representasi Visual Model", 3)
for t in isi.MRK_VISUAL:
    p(t)
p("*(Gambar 2.3 dan Gambar 2.4: flowchart_kemp.png dan flowchart_morrison_ross.png)*\n")

h("2.5 Persamaan Ketiga Model", 2)
for t in isi.PERSAMAAN:
    p(t)

h("2.6 Kelebihan dan Kekurangan Masing-Masing Model", 2)
for t in isi.KELEBIHAN_PENGANTAR:
    p(t)
p("**Tabel 2.4.** Perbandingan kelebihan dan kekurangan tiga model")
tabel(isi.KELEBIHAN_TABEL)
for t in isi.KELEBIHAN_PENJELASAN:
    p(t)

h("2.7 Perbandingan Ketiga Model", 2)
for t in isi.PERBANDINGAN_PENGANTAR:
    p(t)
p("**Tabel 2.5.** Perbandingan pada enam belas aspek")
tabel(isi.PERBANDINGAN_TABEL)
for t in isi.PERBANDINGAN_ANALISIS:
    p(t)

h("2.8 Penerapan dalam Perancangan Teknologi Pendidikan Berkelanjutan", 2)
for t in isi.KASUS_PENGANTAR:
    p(t)
for bagian in isi.KASUS_MODEL:
    p("**" + bagian["nama"] + "**")
    for t in bagian["isi"]:
        p(t)
p("**Tabel 2.6.** Pemetaan studi kasus pada tiga model")
tabel(isi.KASUS_TABEL)
for t in isi.KASUS_ANALISIS:
    p(t)

h("2.9 Flowchart Proses Perancangan pada Ketiga Model", 2)
for t in isi.FLOWCHART_PENGANTAR:
    p(t)
for blok in isi.FLOWCHART_TEKS:
    h(blok["nama"], 3)
    for t in blok["isi"]:
        p(t)
    L.append("```\n" + blok["kode"].strip("\n") + "\n```\n")

h("2.10 Use Case Diagram Proses Perancangan Teknologi Pendidikan", 2)
for t in isi.USECASE_PENGANTAR:
    p(t)
p("*(Gambar 2.6: use_case_diagram.png)*\n")
for t in isi.USECASE_PENJELASAN:
    p(t)
p("**Tabel 2.7.** Matriks keterkaitan aktor dengan use case")
tabel(isi.USECASE_TABEL)
p("Kode PlantUML use case diagram:")
L.append("```plantuml\n" + isi.USECASE_PLANTUML.strip("\n") + "\n```\n")

h("2.11 Data Flow Diagram Proses Perancangan Teknologi Pendidikan", 2)
for t in isi.DFD_PENGANTAR:
    p(t)
p("*(Gambar 2.7: dfd_context.png)*\n")
for t in isi.DFD_KONTEKS_PENJELASAN:
    p(t)
p("*(Gambar 2.8: dfd_level1.png)*\n")
h("2.11.1 Daftar Entitas, Proses, dan Data Store", 3)
for t in isi.DFD_DAFTAR_PENGANTAR:
    p(t)
p("**Tabel 2.8.** Entitas, proses, data store, dan aliran data")
tabel(isi.DFD_TABEL)
h("2.11.2 Rincian Aliran Data Level 1", 3)
for t in isi.DFD_ALIRAN:
    p(t)
p("**Tabel 2.9.** Rincian aliran data antarproses")
tabel(isi.DFD_ALIRAN_TABEL)
p("Kode Mermaid untuk mereproduksi DFD level 1:")
L.append("```mermaid\n" + isi.DFD_MERMAID.strip("\n") + "\n```\n")

h("2.12 Analisis Model yang Paling Sesuai untuk Perancangan Teknologi Pendidikan Berkelanjutan", 2)
for t in isi.ANALISIS:
    p(t)
p("**Rekomendasi.** " + isi.REKOMENDASI)

h("BAB III PENUTUP", 1)
h("3.1 Kesimpulan", 2)
for t in isi.KESIMPULAN:
    p(t)
h("3.2 Saran", 2)
for t in isi.SARAN:
    p(t)

h("DAFTAR PUSTAKA", 1)
for ref in isi.DAFTAR_PUSTAKA:
    L.append(ref + "\n")

for lamp in isi.LAMPIRAN:
    h(lamp["judul"].replace("\n", " "), 1)
    for t in lamp["isi"]:
        p(t)
    if lamp.get("tabel"):
        p("**" + str(lamp["tabel"].get("judul")) + "**")
        tabel(lamp["tabel"])
    if lamp.get("checklist"):
        for item, ok in lamp["checklist"]:
            L.append(("- [x] " if ok else "- [ ] ") + item)
        L.append("")
    if lamp.get("kode"):
        L.append("```\n" + lamp["kode"].strip("\n") + "\n```\n")

out = os.path.join(BASE, "..", "Laporan_UTS_Perbandingan_Model_Desain_Pembelajaran.md")
with open(out, "w", encoding="utf-8") as f:
    f.write("\n".join(L))
print("Versi Markdown disimpan:", os.path.abspath(out))
print("Jumlah baris:", len(L))
