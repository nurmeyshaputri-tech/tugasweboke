"""
Diagram tambahan untuk laporan UTS (Perancangan Teknologi Pendidikan Berkelanjutan):
  1. flowchart_dick_carey.png  -> Model Dick and Carey (10 komponen + jalur revisi)
  2. diagram_venn.png          -> Peta irisan ADDIE, Dick and Carey, dan Morrison-Ross-Kemp
  3. use_case_diagram.png      -> Use case diagram proses perancangan pembelajaran
  4. dfd_context.png           -> DFD Level 0 (context diagram)
  5. dfd_level1.png            -> DFD Level 1

Skala: seluruh kanvas 10 satuan = 5,51 inci (±14 cm), sehingga 1 satuan = 0,551 inci
pada kedua sumbu (bentuk kotak/lingkaran tidak terdistorsi).
"""

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Rectangle, Ellipse, FancyBboxPatch

from flowchart_model import (canvas, panel, box, autotext, arrow, save, WARNINGS,
                             PURPLE, PURPLE_L, PINK, PINK_L, BLUE, BLUE_L,
                             GREEN, GREEN_L, AMBER, AMBER_L, SLATE, SLATE_L,
                             DARK, GREY_TXT, IN_PER_UNIT)

plt.rcParams["font.family"] = "DejaVu Sans"
U = IN_PER_UNIT          # 1 satuan = 0,551 inci


# ======================================================================
# 1. DICK AND CAREY
# ======================================================================
def flowchart_dick_carey():
    H = 9.0
    fig, ax, H = canvas(H * U)
    ax.text(5, H - 0.24, "FLOWCHART MODEL DICK AND CAREY", ha="center", va="top",
            fontsize=11.8, fontweight="bold", color=DARK)
    ax.text(5, H - 0.68, "Sepuluh komponen sistem pembelajaran dengan jalur revisi dari evaluasi formatif",
            ha="center", va="top", fontsize=7.4, color=SLATE, style="italic")

    lx, rx, wcol = 2.90, 7.10, 3.95

    def pair(cy, tl, tr, fc, ec, tag):
        panel(ax, lx, cy, wcol, 0.86, tl, fc, ec, fs_max=7.2, fs_min=6.2, tc=ec, tag=f"{tag}L")
        panel(ax, rx, cy, wcol, 0.86, tr, fc, ec, fs_max=7.2, fs_min=6.2, tc=ec, tag=f"{tag}R")

    # 1
    y1 = H - 1.30
    panel(ax, 5, y1, 8.9, 0.80,
          "1. Identifikasi tujuan pembelajaran (instructional goals)\nmenetapkan kompetensi yang harus dikuasai setelah pembelajaran",
          BLUE_L, BLUE, fs_max=7.8, fs_min=6.6, tc=BLUE, tag="dc1")
    arrow(ax, (4.25, y1 - 0.40), (3.60, y1 - 0.78), color=SLATE, lw=1.2, mut=10)
    arrow(ax, (5.75, y1 - 0.40), (6.40, y1 - 0.78), color=SLATE, lw=1.2, mut=10)

    # 2 & 3
    y2 = y1 - 1.18
    pair(y2, "2. Analisis pembelajaran\nmemetakan keterampilan dan pengetahuan prasyarat",
         "3. Analisis peserta didik dan konteks\nmengenali karakteristik, kebutuhan, dan lingkungan belajar",
         PURPLE_L, PURPLE, "dc2")
    arrow(ax, (lx, y2 - 0.43), (lx, y2 - 0.77), color=SLATE, lw=1.2, mut=10)
    arrow(ax, (rx, y2 - 0.43), (rx, y2 - 0.77), color=SLATE, lw=1.2, mut=10)

    # 4 & 5
    y3 = y2 - 1.20
    pair(y3, "4. Merumuskan tujuan performa\nmengubah tujuan umum menjadi tujuan khusus yang terukur",
         "5. Mengembangkan instrumen penilaian\nmenyusun tes dan kriteria yang selaras dengan tujuan",
         PINK_L, PINK, "dc4")
    arrow(ax, (lx, y3 - 0.43), (lx, y3 - 0.77), color=SLATE, lw=1.2, mut=10)
    arrow(ax, (rx, y3 - 0.43), (rx, y3 - 0.77), color=SLATE, lw=1.2, mut=10)

    # 6 & 7
    y4 = y3 - 1.20
    pair(y4, "6. Mengembangkan strategi pembelajaran\nmemilih pendekatan, metode, media, dan alur penyajian",
         "7. Mengembangkan bahan ajar\nmemproduksi media dan materi",
         GREEN_L, GREEN, "dc6")
    arrow(ax, (lx + wcol / 2, y4), (rx - wcol / 2, y4), color=SLATE, lw=1.2, mut=10)
    arrow(ax, (lx, y4 - 0.43), (lx, y4 - 0.77), color=SLATE, lw=1.2, mut=10)
    arrow(ax, (rx, y4 - 0.43), (rx, y4 - 0.77), color=SLATE, lw=1.2, mut=10)

    # 8 & 10
    y5 = y4 - 1.20
    pair(y5, "8. Evaluasi formatif\nmenguji draf produk (one-to-one, kelompok kecil, lapangan)",
         "10. Evaluasi sumatif\nmenilai efektivitas produk akhir setelah implementasi",
         AMBER_L, AMBER, "dc8")
    arrow(ax, (lx, y5 - 0.43), (3.30, y5 - 1.02), color=AMBER, lw=1.3, mut=10)
    arrow(ax, (rx, y5 - 0.43), (6.70, y5 - 1.02), color=AMBER, lw=1.3, mut=10)

    # 9 revisi
    y6 = y5 - 1.44
    panel(ax, 5, y6, 8.9, 0.80,
          "9. Melakukan revisi pembelajaran\nmemperbaiki rancangan, bahan ajar, dan strategi berdasarkan temuan evaluasi",
          SLATE_L, SLATE, fs_max=7.8, fs_min=6.6, tc=SLATE, tag="dc9")

    # jalur revisi dari komponen 9 ke komponen 4 dan 7
    ax.plot([0.42, 0.42], [y6, y3], color=SLATE, lw=1.2, linestyle=(0, (4, 3)), zorder=1)
    arrow(ax, (0.42, y3), (lx - wcol / 2 - 0.02, y3), color=SLATE, lw=1.2, ls=(0, (4, 3)), mut=10)
    ax.plot([0.42, 4.20], [y6, y6], color=SLATE, lw=1.2, linestyle=(0, (4, 3)), zorder=1)
    ax.text(0.20, (y3 + y6) / 2, "revisi", rotation=90, ha="center", va="center",
            fontsize=6.6, color=SLATE, fontweight="bold")
    ax.plot([9.58, 9.58], [y6, y4], color=SLATE, lw=1.2, linestyle=(0, (4, 3)), zorder=1)
    arrow(ax, (9.58, y4), (rx + wcol / 2 + 0.02, y4), color=SLATE, lw=1.2, ls=(0, (4, 3)), mut=10)
    ax.plot([5.80, 9.58], [y6, y6], color=SLATE, lw=1.2, linestyle=(0, (4, 3)), zorder=1)
    ax.text(9.80, (y4 + y6) / 2, "revisi", rotation=90, ha="center", va="center",
            fontsize=6.6, color=SLATE, fontweight="bold")

    autotext(ax, 5, 0.46, 9.4, 0.80,
             "Catatan: komponen 2 dan 3, 4 dan 5, serta 6 dan 7 dapat dikerjakan secara paralel. Jalur revisi menghubungkan "
             "temuan evaluasi formatif dengan komponen perancangan dan bahan ajar.",
             fs_max=7.0, fs_min=6.4, bold=False, tc=SLATE, tag="dc-note")
    save(fig, "flowchart_dick_carey.png")


# ======================================================================
# 2. PETA IRISAN TIGA MODEL
# ======================================================================
def diagram_venn():
    fig, ax, H = canvas(8.6 * U)
    ax.set_aspect("equal")
    ax.text(5, H - 0.24, "PETA IRISAN (PERSAMAAN DAN PERBEDAAN) KETIGA MODEL", ha="center",
            va="top", fontsize=9.4, fontweight="bold", color=DARK)

    r = 2.05
    c_addie, c_dc, c_mrk = (5.00, 5.85), (3.72, 4.23), (6.28, 4.23)
    for (x, y), c in zip([c_addie, c_dc, c_mrk], [BLUE, PINK, PURPLE]):
        ax.add_patch(Circle((x, y), r, facecolor=c, alpha=0.12, edgecolor=c, linewidth=1.5, zorder=1))

    # nama model di area eksklusif masing-masing lingkaran
    ax.text(5.00, 7.17, "ADDIE", ha="center", va="center", fontsize=9.6,
            fontweight="bold", color=BLUE)
    ax.text(2.55, 3.45, "DICK AND CAREY", ha="center", va="center", fontsize=7.6,
            fontweight="bold", color=PINK)
    ax.text(7.45, 3.45, "MORRISON,\nROSS & KEMP", ha="center", va="center", fontsize=7.6,
            fontweight="bold", color=PURPLE, linespacing=1.4)

    # irisan berpasangan
    ax.text(3.78, 5.17, "ADDIE \u2229 DC", ha="center", va="center", fontsize=6.2,
            fontweight="bold", color="#334155", zorder=6)
    ax.text(6.22, 5.17, "ADDIE \u2229 MRK", ha="center", va="center", fontsize=6.2,
            fontweight="bold", color="#334155", zorder=6)
    ax.text(5.00, 3.17, "DC \u2229 MRK", ha="center", va="center", fontsize=6.2,
            fontweight="bold", color="#334155", zorder=6)

    # irisan ketiga model (inti persamaan)
    panel(ax, 5.0, 4.47, 1.95, 1.30,
          "PERSAMAAN\nKETIGA MODEL\nberorientasi tujuan\nberpusat pada peserta didik\n"
          "evaluasi dan revisi",
          "white", GREEN, fs_max=6.2, fs_min=5.6, tc="#065F46", radius=0.05, lw=1.5, tag="venn-center")

    # keterangan ciri khas tiap model
    rows = [
        ("ADDIE", "linier, lima tahap berurutan; kerangka umum yang paling luas dipakai", BLUE),
        ("Dick and Carey", "sangat rinci dan sistemik; menekankan analisis serta evaluasi formatif", PINK),
        ("Morrison, Ross & Kemp", "non-linier, sembilan komponen; paling luwes", PURPLE),
    ]
    y_leg = 1.92
    for i, (name, desc, c) in enumerate(rows):
        yy = y_leg - i * 0.46
        ax.text(1.35, yy, "\u2022", ha="center", va="center", fontsize=8, color=c, fontweight="bold")
        ax.text(1.55, yy, name, ha="left", va="center", fontsize=6.6, color=c, fontweight="bold")
        ax.text(3.62, yy, " :  " + desc, ha="left", va="center", fontsize=6.6, color=GREY_TXT)

    autotext(ax, 5, 0.34, 9.4, 0.52,
             "Kesimpulan: ketiga model berada pada payung desain pembelajaran sistemik; perbedaannya terletak pada "
             "tingkat keluwesan struktur.",
             fs_max=6.6, fs_min=6.0, bold=False, tc=SLATE, tag="venn-note")
    save(fig, "diagram_venn.png")


# ======================================================================
# 3. USE CASE DIAGRAM
# ======================================================================
def _stick(ax, x, y, label, color=SLATE, s=1.0, lw=1.4):
    ax.add_patch(Circle((x, y + 0.56 * s), 0.16 * s, facecolor="white", edgecolor=color, lw=lw, zorder=4))
    ax.plot([x, x], [y + 0.40 * s, y + 0.02 * s], color=color, lw=lw, zorder=4)
    ax.plot([x - 0.24 * s, x + 0.24 * s], [y + 0.30 * s, y + 0.30 * s], color=color, lw=lw, zorder=4)
    ax.plot([x, x - 0.22 * s], [y + 0.02 * s, y - 0.28 * s], color=color, lw=lw, zorder=4)
    ax.plot([x, x + 0.22 * s], [y + 0.02 * s, y - 0.28 * s], color=color, lw=lw, zorder=4)
    ax.text(x, y - 0.44 * s, label, ha="center", va="top", fontsize=6.6, color=color,
            fontweight="bold", linespacing=1.4, zorder=5)


def use_case():
    fig, ax, H = canvas(9.0 * U)
    ax.set_aspect("equal")
    ax.text(5, H - 0.22, "USE CASE DIAGRAM PERANCANGAN TEKNOLOGI PENDIDIKAN", ha="center",
            va="top", fontsize=9.6, fontweight="bold", color=DARK)

    # batas sistem (frame UML dengan tab judul)
    box(ax, 5.0, 4.18, 6.10, 6.55, SLATE_L, SLATE, radius=0.015, lw=1.4, zorder=0)
    ax.add_patch(Rectangle((1.95, 7.45), 3.35, 0.36, facecolor="white", edgecolor=SLATE, lw=1.4, zorder=2))
    ax.text(2.05, 7.63, "Sistem Perancangan Teknologi Pendidikan Berkelanjutan", ha="left",
            va="center", fontsize=6.0, fontweight="bold", color=SLATE, zorder=3)

    ucs = {
        "uc1": (3.00, 6.55, "Menganalisis\nkebutuhan & konteks"),
        "uc2": (5.05, 6.55, "Menentukan\ntujuan pembelajaran"),
        "uc4": (7.00, 6.55, "Mengembangkan\nmedia/materi"),
        "uc3": (5.05, 5.05, "Merancang strategi\ndan media"),
        "uc5": (7.00, 3.55, "Melaksanakan\npembelajaran"),
        "uc6": (5.05, 2.05, "Melakukan\nevaluasi"),
        "uc7": (3.00, 3.55, "Melakukan\nrevisi"),
    }
    for key, (x, y, t) in ucs.items():
        ax.add_patch(Ellipse((x, y), 1.55, 0.92, facecolor="white", edgecolor=BLUE, lw=1.3, zorder=4))
        autotext(ax, x, y, 1.47, 0.86, t, fs_max=6.8, fs_min=6.0, bold=False, tc=DARK, zorder=5,
                 tag=f"uc-{key}")

    def relabel(x, y, text, color=GREEN):
        ax.text(x, y, text, ha="center", va="center", fontsize=5.4, color=color,
                fontweight="bold", zorder=6,
                bbox=dict(boxstyle="round,pad=0.14", facecolor="white", edgecolor="none"))

    # relasi include / extend (di atas lapisan asosiasi)
    arrow(ax, (4.30, 6.55), (3.80, 6.55), color=GREEN, lw=1.0, mut=8, zorder=6)
    relabel(4.05, 6.22, "\u00abinclude\u00bb")
    arrow(ax, (5.05, 5.52), (5.05, 6.07), color=GREEN, lw=1.0, mut=8, zorder=6)
    relabel(5.62, 5.80, "\u00abinclude\u00bb")
    arrow(ax, (6.55, 6.10), (5.62, 5.25), color=GREEN, lw=1.0, mut=8, zorder=6)
    relabel(6.55, 5.52, "\u00abinclude\u00bb")
    arrow(ax, (3.62, 3.28), (4.42, 2.38), color=AMBER, lw=1.0, mut=8, zorder=6)
    relabel(4.05, 2.92, "\u00abextend\u00bb", AMBER)

    # aktor
    _stick(ax, 0.95, 6.55, "Desainer /\nPengembang\nPembelajaran", BLUE)
    _stick(ax, 0.95, 2.55, "Dosen /\nGuru", PINK)
    _stick(ax, 9.05, 3.55, "Peserta\nDidik", PURPLE)
    _stick(ax, 9.05, 1.25, "Evaluator", GREEN)

    # asosiasi aktor - use case (digambar paling bawah agar tidak menutupi elips)
    assoc = [
        [(1.25, 6.55), (2.23, 6.55)],
        [(1.25, 6.15), (4.23, 5.10)],
        [(1.25, 6.75), (1.25, 7.20), (7.00, 7.20), (7.00, 7.01)],
        [(1.25, 2.55), (2.23, 3.55)],
        [(1.25, 2.35), (4.28, 2.05)],
        [(8.75, 3.55), (7.78, 3.55)],
        [(8.75, 1.35), (5.83, 2.00)],
    ]
    for path in assoc:
        xs = [pt[0] for pt in path]
        ys_ = [pt[1] for pt in path]
        ax.plot(xs, ys_, color="#94A3B8", lw=1.0, zorder=1)
    for pt in [(2.23, 6.55), (4.23, 5.10), (7.00, 7.01), (2.23, 3.55), (4.28, 2.05),
               (7.78, 3.55), (5.83, 2.00)]:
        ax.add_patch(Circle(pt, 0.045, facecolor="#94A3B8", edgecolor="none", zorder=2))

    autotext(ax, 5, 0.32, 9.4, 0.55,
             "Notasi UML sederhana: aktor berada di luar batas sistem, use case di dalam sistem, serta relasi \u00abinclude\u00bb "
             "(perilaku wajib) dan \u00abextend\u00bb (perilaku bersyarat).",
             fs_max=6.6, fs_min=6.0, bold=False, tc=SLATE, tag="uc-note")
    save(fig, "use_case_diagram.png")


# ======================================================================
# 4. DFD LEVEL 0
# ======================================================================
def dfd_context():
    fig, ax, H = canvas(6.2 * U)
    ax.set_aspect("equal")
    ax.text(5, H - 0.22, "DFD LEVEL 0 (CONTEXT DIAGRAM)", ha="center", va="top",
            fontsize=9.8, fontweight="bold", color=DARK)

    cx, cy = 5.0, 3.15
    ax.add_patch(Circle((cx, cy), 1.28, facecolor=BLUE_L, edgecolor=BLUE, lw=1.6, zorder=3))
    ax.text(cx, cy + 0.30, "0", ha="center", va="center", fontsize=9.5, fontweight="bold", color=BLUE)
    autotext(ax, cx, cy - 0.36, 2.2, 0.80,
             "Sistem Perancangan\nTeknologi Pendidikan\nBerkelanjutan", fs_max=7.0, fs_min=6.2,
             tc=DARK, zorder=4, tag="dfd0")

    ents = [
        ("Desainer / Pengembang\nPembelajaran", 1.20, 5.15, BLUE),
        ("Dosen / Guru", 1.20, 1.15, PINK),
        ("Peserta Didik", 8.80, 5.15, PURPLE),
        ("Evaluator /\nPihak Terkait", 8.80, 1.15, GREEN),
    ]
    for t, x, y, c in ents:
        box(ax, x, y, 2.10, 0.80, "white", c, radius=0.02, lw=1.4, zorder=3)
        autotext(ax, x, y, 2.00, 0.74, t, fs_max=7.0, fs_min=6.2, tc=c, zorder=5, tag="dfd0-ent")

    flows = [
        ((2.25, 4.95), (4.15, 3.80), "kebutuhan,\nhasil analisis,\nspesifikasi media"),
        ((3.95, 2.85), (2.30, 1.45), "umpan balik\nhasil evaluasi"),
        ((5.85, 3.80), (7.75, 4.95), "rancangan, media,\nlaporan evaluasi"),
        ((7.70, 1.45), (6.05, 2.85), "data penilaian\ndan validasi ahli"),
    ]
    for (p1, p2, label) in flows:
        arrow(ax, p1, p2, color=SLATE, lw=1.2, mut=10)
        mx, my = (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2
        ax.text(mx, my, label, ha="center", va="center", fontsize=5.8, color=GREY_TXT,
                linespacing=1.35, zorder=6,
                bbox=dict(boxstyle="round,pad=0.16", facecolor="white", edgecolor="none"))

    autotext(ax, 5, 0.36, 9.4, 0.55,
             "Context diagram menampilkan sistem sebagai satu proses tunggal (nomor 0) beserta empat entitas luar "
             "yang bertukar data dengannya.",
             fs_max=6.6, fs_min=6.0, bold=False, tc=SLATE, tag="dfd0-note")
    save(fig, "dfd_context.png")


# ======================================================================
# 5. DFD LEVEL 1
# ======================================================================
def dfd_level1():
    fig, ax, H = canvas(8.7 * U)
    ax.set_aspect("equal")
    ax.text(5, H - 0.22, "DFD LEVEL 1 \u2014 PROSES PERANCANGAN TEKNOLOGI PENDIDIKAN", ha="center",
            va="top", fontsize=9.6, fontweight="bold", color=DARK)

    def process(cx, cy, no, name, fc, ec):
        box(ax, cx, cy, 2.60, 0.95, fc, ec, radius=0.03, lw=1.3, zorder=3)
        ax.add_patch(Rectangle((cx - 1.30, cy + 0.185), 2.60, 0.29, facecolor=ec, edgecolor=ec, zorder=4))
        ax.text(cx - 1.18, cy + 0.325, no, ha="left", va="center", fontsize=7.2,
                fontweight="bold", color="white", zorder=5)
        autotext(ax, cx, cy - 0.20, 2.50, 0.60, name, fs_max=6.8, fs_min=6.0, tc=DARK,
                 zorder=5, tag=f"dfd1-{no}")

    def datastore(cx, cy, code, name, w=2.50):
        ax.add_patch(Rectangle((cx - w / 2, cy - 0.36), w, 0.72, facecolor=AMBER_L,
                               edgecolor=AMBER, lw=1.2, zorder=3))
        ax.plot([cx - w / 2 + 0.50, cx - w / 2 + 0.50], [cy - 0.36, cy + 0.36],
                color=AMBER, lw=1.2, zorder=4)
        ax.text(cx - w / 2 + 0.25, cy, code, ha="center", va="center", fontsize=6.6,
                fontweight="bold", color=AMBER, zorder=5)
        autotext(ax, cx + 0.30, cy, w - 0.72, 0.68, name, fs_max=6.4, fs_min=6.0, tc=DARK,
                 zorder=5, tag=f"ds-{code}")

    def entity(cx, cy, name, c, w=1.70, h=0.72):
        box(ax, cx, cy, w, h, "white", c, radius=0.02, lw=1.4, zorder=3)
        autotext(ax, cx, cy, w - 0.14, h - 0.10, name, fs_max=6.6, fs_min=6.0, tc=c,
                 zorder=5, tag="dfd1-ent")

    px = 3.55
    ys = [7.70, 6.30, 4.90, 3.50, 2.10]
    process(px, ys[0], "1.0", "Analisis kebutuhan\ndan konteks belajar", BLUE_L, BLUE)
    process(px, ys[1], "2.0", "Perancangan tujuan,\nstrategi, dan media", PURPLE_L, PURPLE)
    process(px, ys[2], "3.0", "Pengembangan\nmedia dan materi", PINK_L, PINK)
    process(px, ys[3], "4.0", "Pelaksanaan\npembelajaran", GREEN_L, GREEN)
    process(px, ys[4], "5.0", "Evaluasi dan\nrevisi rancangan", AMBER_L, AMBER)

    for i in range(4):
        arrow(ax, (px, ys[i] - 0.48), (px, ys[i + 1] + 0.48), color=SLATE, lw=1.3, mut=10)

    dx = 7.60
    for y, code, nm in [(ys[0], "D1", "Data kebutuhan &\nkarakteristik pebelajar"),
                        (ys[1], "D2", "Data tujuan &\nrancangan pembelajaran"),
                        (ys[2], "D3", "Repositori media\ndan materi"),
                        (ys[4], "D4", "Data evaluasi &\ncatatan revisi")]:
        datastore(dx, y, code, nm)
        arrow(ax, (px + 1.32, y), (dx - 1.20, y), color=AMBER, lw=1.1, mut=9, zorder=2)
        arrow(ax, (dx - 1.20, y - 0.18), (px + 1.32, y - 0.18), color=AMBER, lw=1.1, mut=9, zorder=2)

    entity(1.05, ys[0], "Desainer /\nPengembang", BLUE)
    entity(1.05, ys[1], "Dosen /\nGuru", PINK)
    entity(8.75, ys[3], "Peserta\nDidik", PURPLE, w=1.60)
    entity(1.05, ys[4], "Evaluator", GREEN)

    arrow(ax, (1.92, ys[0]), (2.23, ys[0]), color=SLATE, lw=1.1, mut=9)
    arrow(ax, (2.23, ys[1] - 0.20), (1.92, ys[1] - 0.20), color=SLATE, lw=1.1, mut=9)
    arrow(ax, (4.87, ys[3] + 0.12), (7.93, ys[3] + 0.12), color=SLATE, lw=1.1, mut=9)
    ax.text(6.40, ys[3] + 0.24, "pembelajaran dan tugas", ha="center", va="bottom",
            fontsize=5.6, color=GREY_TXT, zorder=6,
            bbox=dict(boxstyle="round,pad=0.12", facecolor="white", edgecolor="none"))
    arrow(ax, (7.93, ys[3] - 0.20), (4.87, ys[3] - 0.20), color=SLATE, lw=1.1, mut=9)
    ax.text(6.40, ys[3] - 0.36, "hasil belajar dan umpan balik", ha="center", va="top",
            fontsize=5.6, color=GREY_TXT, zorder=6,
            bbox=dict(boxstyle="round,pad=0.12", facecolor="white", edgecolor="none"))
    arrow(ax, (1.92, ys[4]), (2.23, ys[4]), color=SLATE, lw=1.1, mut=9)
    arrow(ax, (2.23, ys[4] - 0.22), (1.92, ys[4] - 0.22), color=SLATE, lw=1.1, mut=9)

    # jalur revisi dari proses 5.0 ke proses 2.0 dan 3.0 (dilewatkan di sisi kanan terluar)
    xr = 9.35
    ax.plot([4.55, 4.55, xr], [1.63, 1.22, 1.22], color=AMBER, lw=1.2,
            linestyle=(0, (4, 3)), zorder=1)
    ax.plot([xr, xr], [1.22, ys[3] + 0.36], color=AMBER, lw=1.2,
            linestyle=(0, (4, 3)), zorder=1)
    arrow(ax, (xr, ys[2] + 0.32), (4.87, ys[2] + 0.32), color=AMBER, lw=1.2, ls=(0, (4, 3)),
          mut=9, zorder=2)
    ax.plot([xr, xr], [ys[3] + 0.36, ys[2] + 0.32], color=AMBER, lw=1.2, linestyle=(0, (4, 3)), zorder=1)
    arrow(ax, (xr, ys[1] + 0.34), (4.87, ys[1] + 0.34), color=AMBER, lw=1.2, ls=(0, (4, 3)),
          mut=9, zorder=2)
    ax.plot([xr, xr], [ys[2] + 0.32, ys[1] + 0.34], color=AMBER, lw=1.2, linestyle=(0, (4, 3)), zorder=1)
    ax.text(9.72, (ys[1] + ys[4]) / 2, "revisi rancangan, media, dan strategi", rotation=90,
            ha="center", va="center", fontsize=5.6, color=AMBER, fontweight="bold")

    autotext(ax, 5, 0.55, 9.5, 0.90,
             "Keterangan: proses digambarkan dengan notasi Gane\u2013Sarson (persegi bersudut tumpul bernomor), data store "
             "dengan bujur sangkar terbuka (D1\u2013D4), dan entitas luar dengan persegi. Tanda panah menyatakan arah aliran data.",
             fs_max=6.6, fs_min=6.0, bold=False, tc=SLATE, tag="dfd1-note")
    save(fig, "dfd_level1.png")


if __name__ == "__main__":
    flowchart_dick_carey()
    diagram_venn()
    use_case()
    dfd_context()
    dfd_level1()
    print("\nPERINGATAN LAYOUT:" if WARNINGS else "\nTidak ada peringatan overflow teks.")
    for w in WARNINGS:
        print(" -", w)
