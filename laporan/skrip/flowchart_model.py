"""
Membuat diagram/flowchart untuk laporan perbandingan model desain pembelajaran.

Semua gambar dirancang pada skala cetak (lebar 6,6 inci = ±16,8 cm di dokumen Word),
dan dilengkapi fungsi auto-fit agar tidak ada teks yang melewati batas kotak.

Output (folder ../aset):
  1. flowchart_addie.png           -> Model ADDIE (5 tahap, linier + daur revisi)
  2. flowchart_morrison_ross.png   -> Model Morrison & Ross (3 fase siklik)
  3. flowchart_kemp.png            -> Model Kemp (9 komponen non-linier)
  4. diagram_venn.png              -> Peta irisan (persamaan & perbedaan) ketiga model
"""

import os
import textwrap
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Ellipse, Circle, Rectangle
import numpy as np

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "aset")
os.makedirs(OUT, exist_ok=True)

plt.rcParams["font.family"] = "DejaVu Sans"
plt.rcParams["savefig.facecolor"] = "white"

PURPLE, PURPLE_L = "#6D28D9", "#EDE9FE"
PINK, PINK_L = "#DB2777", "#FCE7F3"
BLUE, BLUE_L = "#2563EB", "#DBEAFE"
GREEN, GREEN_L = "#059669", "#D1FAE5"
AMBER, AMBER_L = "#D97706", "#FEF3C7"
SLATE, SLATE_L = "#475569", "#F1F5F9"
DARK, GREY_TXT = "#1E293B", "#334155"

CANVAS_W = 5.51                     # lebar kanvas (inci) = lebar gambar di Word (±14 cm)
IN_PER_UNIT = CANVAS_W / 10.0      # 1 satuan data = 0,66 inci
WARNINGS = []


def canvas(height_in):
    fig = plt.figure(figsize=(CANVAS_W, height_in))
    ax = fig.add_axes([0, 0, 1, 1])
    H = height_in / IN_PER_UNIT
    ax.set_xlim(0, 10)
    ax.set_ylim(0, H)
    ax.axis("off")
    return fig, ax, H


def wrap_lines(text, cpl):
    out = []
    for para in text.split("\n"):
        out.extend([""] if not para.strip() else textwrap.wrap(para, cpl, break_long_words=False))
    return out


def autotext(ax, cx, cy, w, h, text, fs_max=9.5, fs_min=6.0, bold=True, tc=DARK,
             linespacing=1.45, pad=0.14, zorder=5, tag=""):
    """Tulis teks terpusat dengan ukuran huruf otomatis agar pas di dalam kotak w x h (satuan)."""
    w_in = max(0.2, w * IN_PER_UNIT - pad)
    h_in = max(0.12, h * IN_PER_UNIT - 0.04)
    fs = fs_min
    for i in range(int(round((fs_max - fs_min) / 0.1)) + 1):
        fs = round(fs_max - i * 0.1, 1)
        cpl = max(8, int(w_in * 72 / (0.62 * fs)))
        lines = wrap_lines(text, cpl)
        if len(lines) * fs * linespacing / 72.0 <= h_in:
            ax.text(cx, cy, "\n".join(lines), ha="center", va="center", fontsize=fs, color=tc,
                    fontweight="bold" if bold else "normal", linespacing=linespacing, zorder=zorder)
            return fs
    cpl = max(8, int(w_in * 72 / (0.62 * fs)))
    lines = wrap_lines(text, cpl)
    ax.text(cx, cy, "\n".join(lines), ha="center", va="center", fontsize=fs, color=tc,
            fontweight="bold" if bold else "normal", linespacing=linespacing, zorder=zorder)
    WARNINGS.append(f"[{tag}] teks dipaksa pada {fs}pt ({len(lines)} baris, kotak {h_in:.2f} in)")
    return fs


def box(ax, cx, cy, w, h, fc, ec, radius=0.015, lw=1.4, zorder=3):
    ax.add_patch(FancyBboxPatch((cx - w / 2, cy - h / 2), w, h,
                                boxstyle=f"round,pad=0,rounding_size={radius}",
                                linewidth=lw, edgecolor=ec, facecolor=fc, zorder=zorder))


def panel(ax, cx, cy, w, h, text, fc, ec, fs_max=9.5, fs_min=6.2, tc=DARK, bold=True,
          radius=0.015, lw=1.4, zorder=3, tag=""):
    box(ax, cx, cy, w, h, fc, ec, radius=radius, lw=lw, zorder=zorder)
    autotext(ax, cx, cy, w, h, text, fs_max=fs_max, fs_min=fs_min, tc=tc, bold=bold,
             zorder=zorder + 1, tag=tag)


def arrow(ax, p1, p2, color=SLATE, lw=1.4, ls="-", mut=11, zorder=2):
    ax.add_patch(FancyArrowPatch(p1, p2, arrowstyle="-|>", mutation_scale=mut, linewidth=lw,
                                 color=color, linestyle=ls, zorder=zorder, shrinkA=0, shrinkB=0))


def audit(fig, name):
    """Cek teks yang keluar dari kanvas atau bertumpuk dengan teks lain."""
    fig.canvas.draw()
    ren = fig.canvas.get_renderer()
    fw, fh = fig.get_size_inches() * fig.dpi
    items = []
    for t in fig.findobj(matplotlib.text.Text):
        if not t.get_text().strip() or not t.get_visible():
            continue
        bb = t.get_window_extent(renderer=ren)
        items.append((t.get_text().replace("\n", " | ")[:45], bb))
        if bb.x0 < -1 or bb.x1 > fw + 1 or bb.y0 < -1 or bb.y1 > fh + 1:
            WARNINGS.append(f"[{name}] teks keluar kanvas: {t.get_text()[:50]!r}")
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            a, b = items[i][1], items[j][1]
            ox = min(a.x1, b.x1) - max(a.x0, b.x0)
            oy = min(a.y1, b.y1) - max(a.y0, b.y0)
            if ox > 0 and oy > 0:
                smaller = min(a.width * a.height, b.width * b.height)
                if ox * oy > 0.22 * smaller:
                    WARNINGS.append(f"[{name}] teks bertumpuk: {items[i][0]!r} <-> {items[j][0]!r}")


def save(fig, name):
    audit(fig, name)
    fig.savefig(os.path.join(OUT, name), dpi=300, facecolor="white")
    plt.close(fig)
    print("ditulis:", name)


# ======================================================================
# 1. ADDIE
# ======================================================================
def flowchart_addie():
    fig, ax, H = canvas(6.75)
    ax.text(5, H - 0.28, "FLOWCHART MODEL ADDIE", ha="center", va="top",
            fontsize=13, fontweight="bold", color=DARK)
    ax.text(5, H - 0.78, "Alur linier-sistemik lima tahap dengan daur evaluasi dan revisi berkelanjutan",
            ha="center", va="top", fontsize=8.0, color=SLATE, style="italic")

    stages = [
        ("A", "ANALYSIS  (Analisis)",
         "Analisis kebutuhan belajar, karakteristik pebelajar, analisis tugas dan isi, analisis konteks/"
         "lingkungan belajar, serta penetapan tujuan umum pembelajaran.", BLUE, BLUE_L),
        ("D", "DESIGN  (Desain)",
         "Perumusan tujuan pembelajaran khusus, pemilihan strategi dan metode, penentuan media, alokasi waktu, "
         "serta penyusunan kisi-kisi instrumen penilaian.", PURPLE, PURPLE_L),
        ("D", "DEVELOPMENT  (Pengembangan)",
         "Produksi bahan ajar dan media, penyusunan modul/LMS, uji coba terbatas (one-to-one dan kelompok kecil), "
         "kemudian revisi produk.", PINK, PINK_L),
        ("I", "IMPLEMENTATION  (Implementasi)",
         "Pelaksanaan pembelajaran pada situasi nyata, pelatihan pengguna, pengelolaan kelas/delivery, "
         "serta pemantauan jalannya program.", AMBER, AMBER_L),
        ("E", "EVALUATION  (Evaluasi)",
         "Evaluasi formatif pada setiap tahap dan evaluasi sumatif di akhir program untuk mengukur ketercapaian "
         "tujuan serta menjadi dasar tindak lanjut.", GREEN, GREEN_L),
    ]

    x0, x1 = 1.18, 9.70
    h, gap = 1.62, 0.40
    y_top = H - 1.45
    centers = []
    for i, (letter, name, desc, ec, fc) in enumerate(stages):
        yc = y_top - h / 2 - i * (h + gap)
        centers.append(yc)
        box(ax, (x0 + x1) / 2, yc, x1 - x0, h, fc, ec, radius=0.02, lw=1.5)
        ax.add_patch(Rectangle((x0 + 0.02, yc - h / 2 + 0.02), 0.74, h - 0.04,
                               facecolor=ec, edgecolor="none", zorder=4))
        ax.text(x0 + 0.39, yc, letter, ha="center", va="center", fontsize=15,
                fontweight="bold", color="white", zorder=5)
        autotext(ax, (x0 + 0.95 + x1) / 2 + 0.1, yc + 0.48, x1 - x0 - 1.0, 0.45, name,
                 fs_max=9.6, fs_min=8.0, bold=True, tc=ec, zorder=5, tag="addie-title")
        autotext(ax, (x0 + 0.95 + x1) / 2, yc - 0.32, x1 - x0 - 1.1, 1.0, desc,
                 fs_max=8.0, fs_min=6.6, bold=False, tc=GREY_TXT, zorder=5, tag="addie-desc")
        if i < len(stages) - 1:
            arrow(ax, (5, yc - h / 2 - 0.03), (5, yc - h / 2 - gap + 0.06), color=ec, lw=1.6, mut=13)

    ax.plot([0.60, 0.60], [centers[-1], centers[0]], color=GREEN, lw=1.4,
            linestyle=(0, (4, 3)), zorder=2)
    arrow(ax, (0.60, centers[-1]), (0.60, centers[0] - 0.28), color=GREEN, lw=1.4,
          ls=(0, (4, 3)), mut=12)
    ax.plot([0.60, x0], [centers[-1], centers[-1]], color=GREEN, lw=1.4,
            linestyle=(0, (4, 3)), zorder=2)
    ax.text(0.30, (centers[0] + centers[-1]) / 2, "DAUR REVISI", rotation=90, ha="center",
            va="center", fontsize=7.2, color=GREEN, fontweight="bold")

    autotext(ax, 5, 0.46, 9.4, 0.7,
             "Catatan: secara konseptual ADDIE bersifat linier-prosedural, tetapi dalam praktik setiap tahap selalu "
             "disertai evaluasi formatif dan revisi.",
             fs_max=7.6, fs_min=6.8, bold=False, tc=SLATE, tag="addie-note")
    save(fig, "flowchart_addie.png")


# ======================================================================
# 2. MORRISON & ROSS
# ======================================================================
def flowchart_morrison_ross():
    fig, ax, H = canvas(7.25)
    ax.text(5, H - 0.28, "FLOWCHART MODEL MORRISON & ROSS", ha="center", va="top",
            fontsize=12.6, fontweight="bold", color=DARK)
    ax.text(5, H - 0.76, "Tiga fase siklik (desain \u2013 pengembangan \u2013 evaluasi) yang berpusat pada empat komponen inti",
            ha="center", va="top", fontsize=7.8, color=SLATE, style="italic")

    x0, x1 = 1.22, 8.78
    cx = (x0 + x1) / 2
    w = x1 - x0

    blocks = [
        ("EMPAT KOMPONEN INTI:   PEBELAJAR   \u2022   TUJUAN   \u2022   METODE   \u2022   EVALUASI",
         0.80, PURPLE_L, PURPLE, 8.8),
        ("ENAM PERTANYAAN PEMANDU (INITIAL QUESTIONS)\n"
         "1) tingkat kesiapan pebelajar;  2) strategi dan media yang paling tepat;  3) tingkat dukungan belajar yang "
         "dibutuhkan;  4) cara mengukur ketercapaian tujuan;  5) rancangan evaluasi formatif;  6) rancangan evaluasi sumatif.",
         1.62, SLATE_L, "#94A3B8", 8.4),
        ("FASE 1 \u2014 DESAIN (DESIGN)\n"
         "analisis masalah pembelajaran dan kebutuhan \u2192 analisis karakteristik pebelajar serta konteks \u2192 analisis tugas "
         "dan struktur isi/materi \u2192 pengurutan isi \u2192 perumusan tujuan pembelajaran \u2192 pemilihan strategi pembelajaran "
         "\u2192 desain pesan dan pemilihan media \u2192 penyusunan instrumen evaluasi.",
         1.82, BLUE_L, BLUE, 8.4),
        ("FASE 2 \u2014 PENGEMBANGAN (DEVELOPMENT)\n"
         "pengembangan bahan ajar dan media sesuai rancangan \u2192 uji coba (one-to-one, kelompok kecil, dan uji coba "
         "lapangan) \u2192 revisi berkelanjutan; dijalankan bersama manajemen proyek dan layanan pendukung.",
         1.66, PINK_L, PINK, 8.4),
        ("FASE 3 \u2014 EVALUASI (EVALUATION)\n"
         "evaluasi formatif (memperbaiki produk selama proses) \u2192 evaluasi sumatif (menguji efektivitas produk) "
         "\u2192 evaluasi konfirmatif (memastikan ketercapaian tujuan tetap konsisten dalam jangka panjang).",
         1.66, GREEN_L, GREEN, 8.4),
        ("LINGKUNGAN BELAJAR KONDUSIF  \u2192  PENCAPAIAN HASIL BELAJAR\n"
         "pembelajaran berpusat pada pebelajar dan berorientasi pada pemecahan masalah nyata",
         0.86, AMBER_L, AMBER, 8.4),
    ]

    y = H - 1.42
    gap = 0.42
    y_first_top, y_last_center = y, y
    for i, (text, h, fc, ec, fs) in enumerate(blocks):
        yc = y - h / 2
        panel(ax, cx, yc, w, h, text, fc, ec, fs_max=fs, fs_min=6.2,
              tc=ec if i in (0, 3, 4, 5) else GREY_TXT, tag=f"mrk-{i}")
        if i == 0:
            y_first_top = yc + h / 2
        y_last_center = yc
        y -= h
        if i < len(blocks) - 1:
            arrow(ax, (cx, y), (cx, y - gap + 0.06), color=SLATE, lw=1.4, mut=12)
            y -= gap

    for xline, label in [(0.72, "revisi &\nevaluasi\nberkelanjutan"),
                         (9.28, "perencanaan\nproyek &\nlayanan")]:
        ax.plot([xline, xline], [y_last_center, y_first_top], color=GREEN, lw=1.3,
                linestyle=(0, (4, 3)), zorder=1)
        arrow(ax, (xline, y_last_center + 0.15), (xline, y_first_top - 0.05),
              color=GREEN, lw=1.3, ls=(0, (4, 3)), mut=10)
        ax.text(xline + (-0.30 if xline < 5 else 0.30), (y_first_top + y_last_center) / 2, label,
                rotation=90, ha="center", va="center", fontsize=6.6, color=GREEN,
                fontweight="bold", linespacing=1.4)

    autotext(ax, 5, 0.44, 8.4, 0.72,
             "Catatan: ketiga fase bersifat berulang (siklik) \u2014 desain dapat dimulai dari komponen mana pun dan revisi dapat "
             "dilakukan pada setiap tahap. Cincin luar mencerminkan perencanaan proyek, manajemen proyek, dan layanan pendukung.",
             fs_max=7.6, fs_min=6.8, bold=False, tc=SLATE, tag="mrk-note")
    save(fig, "flowchart_morrison_ross.png")


# ======================================================================
# 3. KEMP
# ======================================================================
def flowchart_kemp():
    fig, ax, H = canvas(6.5)
    ax.set_aspect("equal")
    ax.text(5, H - 0.28, "FLOWCHART MODEL KEMP (SEMBILAN KOMPONEN NON-LINIER)", ha="center",
            va="top", fontsize=9.8, fontweight="bold", color=DARK)
    ax.text(5, H - 0.76, "Bentuk oval kontinum \u2014 tidak memiliki titik awal tetap dan setiap komponen saling terkait",
            ha="center", va="top", fontsize=7.6, color=SLATE, style="italic")

    legend = [
        ("Cincin 1 (paling dalam)  : sembilan komponen inti desain pembelajaran", PURPLE),
        ("Cincin 2 (garis putus-putus)  : revisi dan evaluasi formatif pada setiap tahap", "#1D4ED8"),
        ("Cincin 3 (garis titik-titik)  : perencanaan proyek, manajemen proyek, dan layanan pendukung", AMBER),
    ]
    for i, (txt, c) in enumerate(legend):
        ax.text(5, H - 1.18 - i * 0.34, txt, ha="center", va="center", fontsize=7.0,
                color=c, fontweight="bold")

    cx, cy, R = 5.0, 5.40, 2.95
    ax.add_patch(Ellipse((cx, cy), 7.05, 6.85, fill=False, edgecolor=SLATE, linewidth=1.1,
                         linestyle=(0, (5, 4)), zorder=1))
    ax.add_patch(Ellipse((cx, cy), 8.95, 8.35, fill=False, edgecolor=AMBER, linewidth=1.25,
                         linestyle=(0, (2, 2.5)), zorder=1))

    ax.add_patch(Circle((cx, cy), 0.98, facecolor=PURPLE, edgecolor="white", lw=1.2, zorder=4))
    ax.text(cx, cy + 0.32, "INTI DESAIN", ha="center", va="center", fontsize=8.4,
            fontweight="bold", color="white", zorder=5)
    ax.text(cx, cy - 0.22, "Pebelajar \u2022 Tujuan\nMetode \u2022 Evaluasi", ha="center", va="center",
            fontsize=7.4, color="white", zorder=5, linespacing=1.5)

    elems = [
        ("1. Masalah &\ntujuan program", BLUE, BLUE_L),
        ("2. Karakteristik\npebelajar", PINK, PINK_L),
        ("3. Analisis\ntugas & isi", GREEN, GREEN_L),
        ("4. Tujuan\npembelajaran", PURPLE, PURPLE_L),
        ("5. Urutan isi\nmateri", AMBER, AMBER_L),
        ("6. Strategi\npembelajaran", BLUE, BLUE_L),
        ("7. Desain pesan\n& penyampaian", PINK, PINK_L),
        ("8. Instrumen\nevaluasi", GREEN, GREEN_L),
        ("9. Sumber &\nlayanan", PURPLE, PURPLE_L),
    ]
    for i, (txt, ec, fc) in enumerate(elems):
        ang = np.deg2rad(70 - i * 40)
        x, yy = cx + R * np.cos(ang), cy + R * np.sin(ang)
        panel(ax, x, yy, 1.72, 0.95, txt, fc, ec, fs_max=7.6, fs_min=6.2, tc=DARK,
              radius=0.03, tag=f"kemp-{i+1}")

    autotext(ax, 5, 0.48, 9.4, 0.78,
             "Catatan: penomoran hanya menunjukkan urutan logis, bukan urutan wajib. Proses berulang (kontinum), sehingga "
             "revisi dapat dilakukan kapan saja.",
             fs_max=7.6, fs_min=6.8, bold=False, tc=SLATE, tag="kemp-note")
    save(fig, "flowchart_kemp.png")


# ======================================================================
# 4. PETA IRISAN (VENN)
# ======================================================================
def flowchart_venn():
    fig, ax, H = canvas(5.05)
    ax.set_aspect("equal")
    ax.text(5, H - 0.30, "PETA IRISAN (PERSAMAAN DAN PERBEDAAN) KETIGA MODEL", ha="center",
            va="top", fontsize=9.8, fontweight="bold", color=DARK)

    r = 2.30
    c_addie = (5.0, 5.72)
    c_mrk = (3.85, 4.70)
    c_kemp = (6.15, 4.70)
    for (x, y), c in zip([c_addie, c_mrk, c_kemp], [BLUE, PINK, PURPLE]):
        ax.add_patch(Circle((x, y), r, facecolor=c, alpha=0.12, edgecolor=c, linewidth=1.6, zorder=1))

    # judul tiap lingkaran
    ax.text(c_addie[0], c_addie[1] + 1.55, "ADDIE", ha="center", va="center", fontsize=11,
            fontweight="bold", color=BLUE)
    ax.text(c_mrk[0] - 1.35, 2.02, "MORRISON & ROSS", ha="center", va="center", fontsize=9.4,
            fontweight="bold", color=PINK)
    ax.text(c_kemp[0] + 1.35, 2.02, "KEMP", ha="center", va="center", fontsize=11,
            fontweight="bold", color=PURPLE)

    # ciri khas masing-masing model
    autotext(ax, c_addie[0], c_addie[1] + 0.85, 3.2, 0.95,
             "Linier-prosedural, lima tahap berurutan; kerangka umum yang paling luas digunakan",
             fs_max=7.0, fs_min=6.2, tc=BLUE, tag="venn-addie")
    autotext(ax, 2.10, 1.42, 3.3, 0.95,
             "Siklik tiga fase; menonjolkan desain pesan, manajemen proyek, dan layanan pendukung",
             fs_max=7.0, fs_min=6.2, tc=PINK, tag="venn-mrk")
    autotext(ax, 7.90, 1.42, 3.3, 0.95,
             "Non-linier, sembilan komponen; paling fleksibel dan humanistik (tanpa titik awal tetap)",
             fs_max=7.0, fs_min=6.2, tc=PURPLE, tag="venn-kemp")

    # inti persamaan
    panel(ax, 5.0, 4.72, 2.75, 1.55,
          "PERSAMAAN KETIGA MODEL\npendekatan sistem \u2022 berorientasi tujuan \u2022 berpusat pada pebelajar "
          "\u2022 evaluasi dan revisi berkelanjutan",
          "white", GREEN, fs_max=7.4, fs_min=6.0, tc="#065F46", radius=0.05, lw=1.6, tag="venn-center")

    # label irisan berpasangan
    ax.text(3.65, 6.05, "ADDIE \u2229 MRK", ha="center", va="center", fontsize=6.6,
            fontweight="bold", color="#334155", zorder=6)
    ax.text(6.35, 6.05, "ADDIE \u2229 KEMP", ha="center", va="center", fontsize=6.6,
            fontweight="bold", color="#334155", zorder=6)
    ax.text(5.00, 3.28, "MRK \u2229 KEMP", ha="center", va="center", fontsize=6.6,
            fontweight="bold", color="#334155", zorder=6)

    autotext(ax, 5, 0.62, 9.4, 1.05,
             "Kesimpulan: ketiga model tidak saling bertentangan, melainkan berbeda pada tingkat struktur \u2014 ADDIE unggul "
             "sebagai kerangka umum, Morrison\u2013Ross dan Kemp unggul untuk desain fleksibel.",
             fs_max=7.6, fs_min=6.8, bold=False, tc=SLATE, tag="venn-note")
    save(fig, "diagram_venn.png")


if __name__ == "__main__":
    flowchart_addie()
    flowchart_morrison_ross()
    flowchart_kemp()
    flowchart_venn()
    print("\nPERINGATAN LAYOUT:" if WARNINGS else "\nTidak ada peringatan overflow teks.")
    for w in WARNINGS:
        print(" -", w)
