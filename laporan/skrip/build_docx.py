"""
build_docx.py — Membangun laporan UTS dalam format Microsoft Word (.docx)

Menghasilkan berkas:
  Laporan_UTS_Perbandingan_Model_Desain_Pembelajaran.docx

Catatan teknis:
  * Daftar Isi, Daftar Gambar, dan Daftar Tabel dibuat sebagai field (TOC) sehingga
    nomor halaman muncul setelah field diperbarui di Word (F9 / "Update Field").
  * Nomor gambar dan tabel memakai field SEQ agar penomoran otomatis.
  * Nomor halaman: bagian awal (i, ii, iii, ...) dan bagian isi (1, 2, 3, ...).
"""

import os
from docx import Document
from docx.enum.section import WD_SECTION, WD_ORIENT
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

import isi_laporan as isi

BASE = os.path.dirname(os.path.abspath(__file__))
ASET = os.path.join(BASE, "..", "aset")
NAMA_BERKAS = "Laporan_UTS_Perbandingan_Model_Desain_Pembelajaran.docx"

FONT = "Times New Roman"
WARNA_HEAD = "1F3864"
WARNA_SUB = "2E5496"
LEBAR_GAMBAR = Cm(14.0)


# ----------------------------------------------------------------------
# Utilitas XML / field
# ----------------------------------------------------------------------
def set_char_style(run, font=FONT, size=12, bold=False, italic=False, color=None):
    run.font.name = font
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    if color:
        run.font.color.rgb = RGBColor.from_string(color)
    rpr = run._element.get_or_add_rPr()
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = OxmlElement("w:rFonts")
        rpr.append(rfonts)
    for attr in ("w:ascii", "w:hAnsi", "w:cs", "w:eastAsia"):
        rfonts.set(qn(attr), font)


def add_field(paragraph, instr, font=FONT, size=12, bold=False):
    """Sisipkan field Word (mis. PAGE, TOC, SEQ)."""
    run = paragraph.add_run()
    set_char_style(run, font=font, size=size, bold=bold)
    fld_begin = OxmlElement("w:fldChar")
    fld_begin.set(qn("w:fldCharType"), "begin")
    instr_el = OxmlElement("w:instrText")
    instr_el.set(qn("xml:space"), "preserve")
    instr_el.text = instr
    fld_sep = OxmlElement("w:fldChar")
    fld_sep.set(qn("w:fldCharType"), "separate")
    fld_end = OxmlElement("w:fldChar")
    fld_end.set(qn("w:fldCharType"), "end")
    for el in (fld_begin, instr_el, fld_sep, fld_end):
        run._element.append(el)
    return run


SESUDAH_SHD_PARAGRAF = (
    "w:tabs", "w:suppressAutoHyphens", "w:kinsoku", "w:wordWrap", "w:overflowPunct",
    "w:topLinePunct", "w:autoSpaceDE", "w:autoSpaceDN", "w:bidi", "w:adjustRightInd",
    "w:snapToGrid", "w:spacing", "w:ind", "w:contextualSpacing", "w:mirrorIndents",
    "w:suppressOverlap", "w:jc", "w:textDirection", "w:textAlignment", "w:textboxTightWrap",
    "w:outlineLvl", "w:divId", "w:cnfStyle", "w:rPr", "w:sectPr", "w:pPrChange",
)
SESUDAH_SHD_SEL = (
    "w:noWrap", "w:tcMar", "w:textDirection", "w:tcFitText", "w:vAlign", "w:hideMark",
)


def shade(cell_or_paragraph, warna):
    """Beri warna latar pada sel tabel atau paragraf (posisi elemen dijaga agar valid)."""
    el = cell_or_paragraph._element
    if el.tag.endswith("tc"):
        pr = el.get_or_add_tcPr()
        urutan = SESUDAH_SHD_SEL
    else:
        pr = el.get_or_add_pPr()
        urutan = SESUDAH_SHD_PARAGRAF
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), warna)
    pr.insert_element_before(shd, *urutan)


def ulangi_header_baris(row):
    tr_pr = row._tr.get_or_add_trPr()
    el = OxmlElement("w:tblHeader")
    el.set(qn("w:val"), "true")
    tr_pr.append(el)


def jangan_pisah_baris(paragraph):
    paragraph.paragraph_format.keep_with_next = True


def page_number_type(section, fmt="decimal", start=1):
    sect_pr = section._sectPr
    pg = sect_pr.find(qn("w:pgNumType"))
    if pg is None:
        pg = OxmlElement("w:pgNumType")
        sect_pr.insert_element_before(
            pg, "w:cols", "w:formProt", "w:vAlign", "w:noEndnote", "w:titlePg",
            "w:textDirection", "w:bidi", "w:rtlGutter", "w:docGrid", "w:printerSettings",
            "w:sectPrChange")
    pg.set(qn("w:fmt"), fmt)
    pg.set(qn("w:start"), str(start))


def set_margins(section, kiri=4.0, kanan=3.0, atas=3.0, bawah=3.0):
    section.left_margin = Cm(kiri)
    section.right_margin = Cm(kanan)
    section.top_margin = Cm(atas)
    section.bottom_margin = Cm(bawah)


def footer_nomor(section, roman=False):
    section.footer.is_linked_to_previous = False
    p = section.footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_field(p, " PAGE ", size=11)


# ----------------------------------------------------------------------
# Gaya dokumen
# ----------------------------------------------------------------------
def siapkan_gaya(doc):
    normal = doc.styles["Normal"]
    normal.font.name = FONT
    normal.font.size = Pt(12)
    rpr = normal.element.get_or_add_rPr()
    rfonts = OxmlElement("w:rFonts")
    for attr in ("w:ascii", "w:hAnsi", "w:cs", "w:eastAsia"):
        rfonts.set(qn(attr), FONT)
    rpr.append(rfonts)
    normal.paragraph_format.line_spacing = 1.5
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.space_before = Pt(0)

    for nama, ukuran, warna, sebelum, sesudah in [
        ("Heading 1", 14, WARNA_HEAD, 18, 10),
        ("Heading 2", 13, WARNA_SUB, 14, 8),
        ("Heading 3", 12, WARNA_SUB, 12, 6),
    ]:
        st = doc.styles[nama]
        st.font.name = FONT
        st.font.size = Pt(ukuran)
        st.font.bold = True
        st.font.italic = False
        st.font.color.rgb = RGBColor.from_string(warna)
        st.paragraph_format.space_before = Pt(sebelum)
        st.paragraph_format.space_after = Pt(sesudah)
        st.paragraph_format.line_spacing = 1.25
        st.paragraph_format.keep_with_next = True

    cap = doc.styles["Caption"]
    cap.font.name = FONT
    cap.font.size = Pt(10.5)
    cap.font.italic = False
    cap.font.bold = False
    cap.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cap.paragraph_format.space_before = Pt(4)
    cap.paragraph_format.space_after = Pt(10)
    cap.paragraph_format.line_spacing = 1.0

    for nama in ("Caption Gambar", "Caption Tabel"):
        st = doc.styles.add_style(nama, 1)   # WD_STYLE_TYPE.PARAGRAPH
        st.base_style = doc.styles["Caption"]
        st.font.name = FONT
        st.font.size = Pt(10.5)


# ----------------------------------------------------------------------
# Blok-blok isi
# ----------------------------------------------------------------------
def par(doc, teks, indentasi=True, rata="justify", spacing=1.5, size=12, space_after=6):
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = spacing
    p.paragraph_format.space_after = Pt(space_after)
    if indentasi:
        p.paragraph_format.first_line_indent = Cm(1.27)
    p.alignment = {"justify": WD_ALIGN_PARAGRAPH.JUSTIFY,
                   "center": WD_ALIGN_PARAGRAPH.CENTER,
                   "left": WD_ALIGN_PARAGRAPH.LEFT}[rata]
    r = p.add_run(teks)
    set_char_style(r, size=size)
    return p


def par_kaya(doc, potongan, indentasi=True, rata="justify", spacing=1.5, size=12):
    """potongan = daftar (teks, bold, italic)."""
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = spacing
    p.paragraph_format.space_after = Pt(6)
    if indentasi:
        p.paragraph_format.first_line_indent = Cm(1.27)
    p.alignment = {"justify": WD_ALIGN_PARAGRAPH.JUSTIFY,
                   "center": WD_ALIGN_PARAGRAPH.CENTER,
                   "left": WD_ALIGN_PARAGRAPH.LEFT}[rata]
    for t in potongan:
        teks, bold, italic = (t + (False, False))[:3] if isinstance(t, tuple) else (t, False, False)
        r = p.add_run(teks)
        set_char_style(r, size=size, bold=bold, italic=italic)
    return p


def daftar(doc, butir, gaya="bullet", size=12, spacing=1.35):
    for item in butir:
        p = doc.add_paragraph()
        p.paragraph_format.line_spacing = spacing
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.left_indent = Cm(1.6 if gaya == "number" else 1.3)
        p.paragraph_format.first_line_indent = Cm(-0.6)
        bench = item[0] if isinstance(item, tuple) else None
        isi_item = item[1] if isinstance(item, tuple) else item
        teks = f"{bench}  {isi_item}" if bench else isi_item
        r = p.add_run(teks)
        set_char_style(r, size=size)
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY


def kode(doc, teks, size=9):
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.0
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(10)
    p.paragraph_format.left_indent = Cm(0.6)
    p.paragraph_format.right_indent = Cm(0.4)
    shade(p, "F2F2F2")
    for i, baris in enumerate(teks.strip("\n").split("\n")):
        r = p.add_run(baris + ("\n" if i < len(teks.strip("\n").split("\n")) - 1 else ""))
        set_char_style(r, font="Consolas", size=size)
    return p


def gambar(doc, berkas, nomor_label, judul, lebar=LEBAR_GAMBAR):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)
    p.add_run().add_picture(os.path.join(ASET, berkas), width=lebar)

    cap = doc.add_paragraph(style="Caption Gambar")
    jangan_pisah_baris(cap)
    r = cap.add_run(f"{nomor_label}. ")
    set_char_style(r, size=10.5, bold=True)
    r2 = cap.add_run(judul)
    set_char_style(r2, size=10.5)
    return cap


def tabel(doc, header, baris, lebar_kolom=None, size=9.5, judul=None, nomor_label="Tabel", catatan=None):
    if judul:
        cap = doc.add_paragraph(style="Caption Tabel")
        jangan_pisah_baris(cap)
        r = cap.add_run(f"{nomor_label}. ")
        set_char_style(r, size=10.5, bold=True)
        r2 = cap.add_run(judul)
        set_char_style(r2, size=10.5)
        cap.paragraph_format.space_after = Pt(4)

    t = doc.add_table(rows=1, cols=len(header))
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    hdr = t.rows[0]
    for i, teks in enumerate(header):
        cell = hdr.cells[i]
        cell.text = ""
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.line_spacing = 1.0
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(teks)
        set_char_style(r, size=size, bold=True, color="FFFFFF")
        shade(cell, WARNA_HEAD)
    ulangi_header_baris(hdr)

    for baris_data in baris:
        row = t.add_row()
        for i, teks in enumerate(baris_data):
            cell = row.cells[i]
            cell.text = ""
            p = cell.paragraphs[0]
            p.paragraph_format.line_spacing = 1.05
            p.paragraph_format.space_after = Pt(2)
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT if i else WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(str(teks))
            set_char_style(r, size=size)
    if lebar_kolom:
        for i, w in enumerate(lebar_kolom):
            for row in t.rows:
                row.cells[i].width = Cm(w)
    if catatan:
        p = doc.add_paragraph()
        p.paragraph_format.line_spacing = 1.0
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(10)
        r = p.add_run(catatan)
        set_char_style(r, size=9.5, italic=True)
    else:
        doc.add_paragraph().paragraph_format.space_after = Pt(4)
    return t


def judul_bab(doc, teks):
    doc.add_page_break()
    h = doc.add_heading(teks, level=1)
    h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    h.paragraph_format.space_before = Pt(0)
    h.paragraph_format.space_after = Pt(16)
    return h


# ----------------------------------------------------------------------
# Bagian awal
# ----------------------------------------------------------------------
def halaman_cover(doc):
    for _ in range(2):
        doc.add_paragraph()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("LAPORAN TUGAS UJIAN TENGAH SEMESTER (UTS)")
    set_char_style(r, size=13, bold=True)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(20)
    r = p.add_run("Mata Kuliah: Perancangan Teknologi Pendidikan Berkelanjutan")
    set_char_style(r, size=12)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.line_spacing = 1.3
    p.paragraph_format.space_after = Pt(6)
    r = p.add_run("ANALISIS DAN PERBANDINGAN MODEL DESAIN PEMBELAJARAN\n"
                  "ADDIE, DICK AND CAREY, DAN MORRISON, ROSS, AND KEMP")
    set_char_style(r, size=15, bold=True, color=WARNA_HEAD)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(18)
    r = p.add_run("Kajian Teoretis dan Penerapannya dalam Perancangan\nTeknologi Pendidikan Berkelanjutan")
    set_char_style(r, size=12, italic=True)

    kotak = doc.add_paragraph()
    kotak.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = kotak.add_run("[ Tempatkan logo Universitas Mulawarman di bagian ini ]")
    set_char_style(r, size=10, italic=True, color="808080")

    for _ in range(2):
        doc.add_paragraph()

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("Disusun oleh:")
    set_char_style(r, size=12)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("Nur Meysha Putri")
    set_char_style(r, size=13, bold=True)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(24)
    r = p.add_run("NIM 2405176002")
    set_char_style(r, size=12)

    for teks, bold in [("PROGRAM STUDI S1 PENDIDIKAN KOMPUTER", True),
                       ("FAKULTAS KEGURUAN DAN ILMU PENDIDIKAN", True),
                       ("UNIVERSITAS MULAWARMAN", True),
                       ("SAMARINDA", True),
                       ("2026", True)]:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(teks)
        set_char_style(r, size=12, bold=bold)


def kata_pengantar(doc):
    doc.add_page_break()
    h = doc.add_heading("KATA PENGANTAR", level=1)
    h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for teks in isi.KATA_PENGANTAR:
        par(doc, teks)
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r = p.add_run("Samarinda, 2026\nPenulis")
    set_char_style(r, size=12)


def daftar_field(doc, judul, instruksi):
    doc.add_page_break()
    h = doc.add_heading(judul, level=1)
    h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.15
    add_field(p, instruksi, size=11)
    p2 = doc.add_paragraph()
    r = p2.add_run("(Nomor gambar dan tabel sudah tertulis tetap. Nomor halaman pada daftar ini perlu "
                   "diperbarui: klik kanan pada daftar, pilih \"Update Field\", lalu pilih \"Update entire table\" "
                   "atau tekan F9.)")
    set_char_style(r, size=9.5, italic=True, color="808080")


# ----------------------------------------------------------------------
# Perakitan dokumen
# ----------------------------------------------------------------------
def bangun():
    doc = Document()
    siapkan_gaya(doc)

    sec = doc.sections[0]
    sec.page_width, sec.page_height = Cm(21.0), Cm(29.7)
    set_margins(sec)
    sec.different_first_page_header_footer = True
    footer_nomor(sec, roman=True)
    page_number_type(sec, fmt="lowerRoman", start=1)

    # ---------- bagian awal ----------
    halaman_cover(doc)
    kata_pengantar(doc)
    daftar_field(doc, "DAFTAR ISI", ' TOC \\o "1-3" \\h \\z \\u ')
    daftar_field(doc, "DAFTAR GAMBAR", ' TOC \\h \\z \\t "Caption Gambar;1" ')
    daftar_field(doc, "DAFTAR TABEL", ' TOC \\h \\z \\t "Caption Tabel;1" ')

    # ---------- bagian isi (nomor halaman 1, 2, 3, ...) ----------
    sec2 = doc.add_section(WD_SECTION.NEW_PAGE)
    sec2.page_width, sec2.page_height = Cm(21.0), Cm(29.7)
    set_margins(sec2)
    footer_nomor(sec2)
    page_number_type(sec2, fmt="decimal", start=1)

    # BAB I
    judul_bab(doc, "BAB I\nPENDAHULUAN")
    doc.add_heading("1.1  Latar Belakang", level=2)
    for t in isi.LATAR_BELAKANG:
        par(doc, t)

    doc.add_heading("1.2  Rumusan Masalah", level=2)
    par(doc, "Berdasarkan uraian pada latar belakang, rumusan masalah dalam laporan ini adalah sebagai berikut.")
    daftar(doc, isi.RUMUSAN_MASALAH, gaya="number")

    doc.add_heading("1.3  Tujuan Penulisan", level=2)
    par(doc, "Sejalan dengan rumusan masalah, penulisan laporan ini bertujuan untuk:")
    daftar(doc, isi.TUJUAN, gaya="number")

    doc.add_heading("1.4  Manfaat Penulisan", level=2)
    par(doc, "Secara teoretis, laporan ini diharapkan dapat memperkaya pemahaman mengenai kerangka kerja "
             "perancangan pembelajaran dan kedudukannya dalam bidang teknologi pendidikan. Secara praktis, "
             "hasil kajian ini dapat digunakan oleh mahasiswa, guru, dosen, maupun pengembang media sebagai "
             "pertimbangan dalam memilih model perancangan yang sesuai dengan konteks pekerjaannya.")
    for t in isi.MANFAAT:
        par(doc, t)

    doc.add_heading("1.5  Catatan tentang Penamaan dan Jumlah Model yang Dibandingkan", level=2)
    for t in isi.CATATAN_PENAMAAN:
        par(doc, t)

    # BAB II
    judul_bab(doc, "BAB II\nPEMBAHASAN")

    doc.add_heading("2.1  Konsep Dasar Model Desain Pembelajaran", level=2)
    for t in isi.KONSEP_DASAR:
        par(doc, t)
    doc.add_heading("2.1.1  Pengertian Desain Pembelajaran", level=3)
    for t in isi.KONSEP_DESAIN:
        par(doc, t)
    doc.add_heading("2.1.2  Model Desain Pembelajaran dan Fungsinya", level=3)
    for t in isi.KONSEP_MODEL:
        par(doc, t)
    doc.add_heading("2.1.3  Keterkaitan dengan Teknologi Pendidikan dan Pendidikan Berkelanjutan", level=3)
    for t in isi.KONSEP_TP:
        par(doc, t)

    # 2.2 ADDIE
    doc.add_heading("2.2  Model ADDIE", level=2)
    doc.add_heading("2.2.1  Pengertian dan Tujuan Penggunaan", level=3)
    for t in isi.ADDIE_PENGERTIAN:
        par(doc, t)
    doc.add_heading("2.2.2  Sejarah Singkat dan Perdebatan Asal-Usulnya", level=3)
    for t in isi.ADDIE_SEJARAH:
        par(doc, t)
    doc.add_heading("2.2.3  Lima Tahap Model ADDIE", level=3)
    for t in isi.ADDIE_TAHAP_PENGANTAR:
        par(doc, t)
    for tahap in isi.ADDIE_TAHAP:
        par_kaya(doc, [(tahap["nama"], True)])
        for t in tahap["isi"]:
            par(doc, t)
    tabel(doc, isi.ADDIE_TABEL["header"], isi.ADDIE_TABEL["baris"],
          lebar_kolom=isi.ADDIE_TABEL["lebar"], size=9,
          judul="Ringkasan lima tahap model ADDIE beserta kegiatan, luaran, dan contoh penerapannya",
          nomor_label="Tabel 2.1")
    doc.add_heading("2.2.4  Diagram Alur Model ADDIE", level=3)
    for t in isi.ADDIE_DIAGRAM:
        par(doc, t)
    gambar(doc, "flowchart_addie.png", "Gambar 2.1", "Diagram alur model ADDIE beserta daur revisi pada setiap tahap")

    # 2.3 Dick and Carey
    doc.add_heading("2.3  Model Dick and Carey", level=2)
    doc.add_heading("2.3.1  Pengertian dan Kedudukan Model", level=3)
    for t in isi.DC_PENGERTIAN:
        par(doc, t)
    doc.add_heading("2.3.2  Tujuan dan Karakteristik Model", level=3)
    for t in isi.DC_KARAKTERISTIK:
        par(doc, t)
    doc.add_heading("2.3.3  Sepuluh Komponen Model Dick and Carey", level=3)
    for t in isi.DC_KOMPONEN_PENGANTAR:
        par(doc, t)
    for komp in isi.DC_KOMPONEN:
        par_kaya(doc, [(komp["nama"], True)])
        for t in komp["isi"]:
            par(doc, t)
    tabel(doc, isi.DC_TABEL["header"], isi.DC_TABEL["baris"], lebar_kolom=isi.DC_TABEL["lebar"],
          size=9, judul="Ringkasan komponen model Dick and Carey beserta maksud, luaran, dan contoh penerapannya",
          nomor_label="Tabel 2.2")
    doc.add_heading("2.3.4  Flowchart Model Dick and Carey", level=3)
    for t in isi.DC_FLOWCHART_TEKS:
        par(doc, t)
    gambar(doc, "flowchart_dick_carey.png", "Gambar 2.2",
           "Flowchart model Dick and Carey dengan jalur revisi hasil evaluasi formatif")

    # 2.4 Morrison, Ross, and Kemp
    doc.add_heading("2.4  Model Morrison, Ross, and Kemp", level=2)
    doc.add_heading("2.4.1  Pengertian dan Perkembangan Model Kemp", level=3)
    for t in isi.MRK_PENGERTIAN:
        par(doc, t)
    doc.add_heading("2.4.2  Karakteristik Utama", level=3)
    for t in isi.MRK_KARAKTERISTIK:
        par(doc, t)
    doc.add_heading("2.4.3  Sembilan Komponen Model Morrison, Ross, and Kemp", level=3)
    for t in isi.MRK_KOMPONEN_PENGANTAR:
        par(doc, t)
    for komp in isi.MRK_KOMPONEN:
        par_kaya(doc, [(komp["nama"], True)])
        for t in komp["isi"]:
            par(doc, t)
    tabel(doc, isi.MRK_TABEL["header"], isi.MRK_TABEL["baris"], lebar_kolom=isi.MRK_TABEL["lebar"],
          size=9, judul="Ringkasan sembilan komponen model Morrison, Ross, and Kemp beserta contoh penerapannya",
          nomor_label="Tabel 2.3")
    doc.add_heading("2.4.4  Representasi Visual Model", level=3)
    for t in isi.MRK_VISUAL:
        par(doc, t)
    gambar(doc, "flowchart_kemp.png", "Gambar 2.3",
           "Representasi sembilan komponen model Morrison, Ross, and Kemp (non-linier)")
    gambar(doc, "flowchart_morrison_ross.png", "Gambar 2.4",
           "Alur tiga fase model Morrison, Ross, and Kemp: desain, pengembangan, dan evaluasi")

    # 2.5 Persamaan
    doc.add_heading("2.5  Persamaan Ketiga Model", level=2)
    for t in isi.PERSAMAAN:
        par(doc, t)

    # 2.6 Kelebihan dan kekurangan
    doc.add_heading("2.6  Kelebihan dan Kekurangan Masing-Masing Model", level=2)
    for t in isi.KELEBIHAN_PENGANTAR:
        par(doc, t)
    tabel(doc, isi.KELEBIHAN_TABEL["header"], isi.KELEBIHAN_TABEL["baris"],
          lebar_kolom=isi.KELEBIHAN_TABEL["lebar"], size=9.5,
          judul="Perbandingan kelebihan dan kekurangan tiga model desain pembelajaran",
          nomor_label="Tabel 2.4")
    for t in isi.KELEBIHAN_PENJELASAN:
        par(doc, t)

    # 2.7 Perbandingan
    doc.add_heading("2.7  Perbandingan Ketiga Model", level=2)
    for t in isi.PERBANDINGAN_PENGANTAR:
        par(doc, t)
    tabel(doc, isi.PERBANDINGAN_TABEL["header"], isi.PERBANDINGAN_TABEL["baris"],
          lebar_kolom=isi.PERBANDINGAN_TABEL["lebar"], size=8.5,
          judul="Perbandingan model ADDIE, Dick and Carey, dan Morrison, Ross, and Kemp "
                "pada enam belas aspek perancangan",
          nomor_label="Tabel 2.5")
    for t in isi.PERBANDINGAN_ANALISIS:
        par(doc, t)
    gambar(doc, "diagram_venn.png", "Gambar 2.5",
           "Peta irisan persamaan dan perbedaan tiga model desain pembelajaran", lebar=Cm(12.5))

    # 2.8 Penerapan
    doc.add_heading("2.8  Penerapan dalam Perancangan Teknologi Pendidikan Berkelanjutan", level=2)
    for t in isi.KASUS_PENGANTAR:
        par(doc, t)
    for bagian in isi.KASUS_MODEL:
        par_kaya(doc, [(bagian["nama"], True)])
        for t in bagian["isi"]:
            par(doc, t)
    tabel(doc, isi.KASUS_TABEL["header"], isi.KASUS_TABEL["baris"],
          lebar_kolom=isi.KASUS_TABEL["lebar"], size=9.5,
          judul="Pemetaan studi kasus pengembangan media pembelajaran digital pada tiga model",
          nomor_label="Tabel 2.6")
    for t in isi.KASUS_ANALISIS:
        par(doc, t)

    # 2.9 Flowchart
    doc.add_heading("2.9  Flowchart Proses Perancangan pada Ketiga Model", level=2)
    for t in isi.FLOWCHART_PENGANTAR:
        par(doc, t)
    for blok in isi.FLOWCHART_TEKS:
        par_kaya(doc, [(blok["nama"], True)])
        for t in blok["isi"]:
            par(doc, t)
        kode(doc, blok["kode"], size=9)

    # 2.10 Use case
    doc.add_heading("2.10  Use Case Diagram Proses Perancangan Teknologi Pendidikan", level=2)
    for t in isi.USECASE_PENGANTAR:
        par(doc, t)
    gambar(doc, "use_case_diagram.png", "Gambar 2.6",
           "Use case diagram proses perancangan teknologi pendidikan", lebar=Cm(13.0))
    for t in isi.USECASE_PENJELASAN:
        par(doc, t)
    tabel(doc, isi.USECASE_TABEL["header"], isi.USECASE_TABEL["baris"],
          lebar_kolom=isi.USECASE_TABEL["lebar"], size=9.5,
          judul="Matriks keterkaitan aktor dengan use case perancangan pembelajaran",
          nomor_label="Tabel 2.7")
    par(doc, "Kode PlantUML berikut dapat digunakan untuk menghasilkan ulang use case diagram di atas "
             "melalui aplikasi PlantUML atau layanan daring plantuml.com.", indentasi=False)
    kode(doc, isi.USECASE_PLANTUML, size=8.5)

    # 2.11 DFD
    doc.add_heading("2.11  Data Flow Diagram Proses Perancangan Teknologi Pendidikan", level=2)
    for t in isi.DFD_PENGANTAR:
        par(doc, t)
    gambar(doc, "dfd_context.png", "Gambar 2.7",
           "DFD level 0 (context diagram) sistem perancangan pembelajaran", lebar=Cm(12.5))
    for t in isi.DFD_KONTEKS_PENJELASAN:
        par(doc, t)
    gambar(doc, "dfd_level1.png", "Gambar 2.8", "DFD level 1 proses perancangan teknologi pendidikan",
           lebar=Cm(13.5))
    doc.add_heading("2.11.1  Daftar Entitas, Proses, dan Data Store", level=3)
    for t in isi.DFD_DAFTAR_PENGANTAR:
        par(doc, t)
    tabel(doc, isi.DFD_TABEL["header"], isi.DFD_TABEL["baris"], lebar_kolom=isi.DFD_TABEL["lebar"],
          size=9.5, judul="Entitas luar, proses, data store, dan aliran data pada DFD level 1",
          nomor_label="Tabel 2.8")
    doc.add_heading("2.11.2  Rincian Aliran Data Level 1",  level=3)
    for t in isi.DFD_ALIRAN:
        par(doc, t)
    tabel(doc, isi.DFD_ALIRAN_TABEL["header"], isi.DFD_ALIRAN_TABEL["baris"],
          lebar_kolom=isi.DFD_ALIRAN_TABEL["lebar"], size=9.5,
          judul="Rincian aliran data antarproses pada DFD level 1", nomor_label="Tabel 2.9")
    par(doc, "Diagram di atas dapat dihasilkan ulang melalui Mermaid dengan kode berikut.", indentasi=False)
    kode(doc, isi.DFD_MERMAID, size=8.5)

    # 2.12 Analisis
    doc.add_heading("2.12  Analisis Model yang Paling Sesuai untuk Perancangan Teknologi Pendidikan Berkelanjutan",
                    level=2)
    for t in isi.ANALISIS:
        par(doc, t)
    par_kaya(doc, [("Rekomendasi. ", True), (isi.REKOMENDASI, False)])

    # BAB III
    judul_bab(doc, "BAB III\nPENUTUP")
    doc.add_heading("3.1  Kesimpulan", level=2)
    for t in isi.KESIMPULAN:
        par(doc, t)
    doc.add_heading("3.2  Saran", level=2)
    for t in isi.SARAN:
        par(doc, t)

    # DAFTAR PUSTAKA
    doc.add_page_break()
    h = doc.add_heading("DAFTAR PUSTAKA", level=1)
    h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for ref in isi.DAFTAR_PUSTAKA:
        p = doc.add_paragraph()
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(8)
        p.paragraph_format.left_indent = Cm(1.27)
        p.paragraph_format.first_line_indent = Cm(-1.27)
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        r = p.add_run(ref)
        set_char_style(r, size=11.5)

    # LAMPIRAN (setiap lampiran memakai section sendiri agar orientasi halaman dapat diatur)
    for lamp in isi.LAMPIRAN:
        sec_l = doc.add_section(WD_SECTION.NEW_PAGE)
        if lamp.get("landscape"):
            sec_l.orientation = WD_ORIENT.LANDSCAPE
            sec_l.page_width, sec_l.page_height = Cm(29.7), Cm(21.0)
            set_margins(sec_l, kiri=3.0, kanan=2.5, atas=2.5, bawah=2.5)
        else:
            sec_l.orientation = WD_ORIENT.PORTRAIT
            sec_l.page_width, sec_l.page_height = Cm(21.0), Cm(29.7)
            set_margins(sec_l)
        footer_nomor(sec_l)
        h = doc.add_heading(lamp["judul"], level=1)
        h.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for t in lamp["isi"]:
            par(doc, t)
        if lamp.get("tabel"):
            tabel(doc, lamp["tabel"]["header"], lamp["tabel"]["baris"],
                  lebar_kolom=lamp["tabel"]["lebar"], size=8.5,
                  judul=lamp["tabel"].get("judul"), nomor_label=lamp["tabel"].get("label", "Tabel A.1"))
        if lamp.get("checklist"):
            for item, ok in lamp["checklist"]:
                p = doc.add_paragraph()
                p.paragraph_format.line_spacing = 1.2
                p.paragraph_format.space_after = Pt(3)
                p.paragraph_format.left_indent = Cm(0.8)
                p.paragraph_format.first_line_indent = Cm(-0.8)
                r = p.add_run(("[  \u2713  ] " if ok else "[      ] ") + item)
                set_char_style(r, size=11)
        if lamp.get("kode"):
            kode(doc, lamp["kode"], size=8.5)


    out = os.path.join(BASE, "..", NAMA_BERKAS)
    doc.save(out)
    print("Laporan disimpan:", os.path.abspath(out))
    return out


if __name__ == "__main__":
    bangun()
