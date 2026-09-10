export const SURVEY_TITLE = 'Photobox yang terbaik di samarinda';

export const SAMARINDA_PHOTOBOX_LIST = [
  'Photomatics Samarinda (Big Mall / SCP)',
  'Selfie Time Samarinda',
  'FotoHokkie Samarinda',
  'Photoplace Samarinda',
  'Snap Studio / Box Samarinda',
  'Visual Studio Samarinda',
  'Lainnya (Tulis Sendiri)',
];

export const MANDATORY_VARIABLES = [
  {
    code: 'V01',
    question_number: 1,
    name: 'Kualitas Hasil Foto',
    question_text: 'Hasil foto pada Photo Box ini memiliki resolusi yang tajam, pencahayaan (lighting) yang pas, dan kualitas warna yang jernih memuaskan.',
    order_index: 1,
  },
  {
    code: 'V02',
    question_number: 2,
    name: 'Harga atau Kesesuaian Harga',
    question_text: 'Harga sewa sesi / paket foto yang ditawarkan terjangkau dan sangat sepadan dengan fasilitas serta hasil foto yang didapatkan.',
    order_index: 2,
  },
  {
    code: 'V03',
    question_number: 3,
    name: 'Variasi Frame atau Template',
    question_text: 'Photo Box ini menyediakan beragam pilihan desain frame kekinian, tema estetik, dan pilihan layout strip foto yang variatif.',
    order_index: 3,
  },
  {
    code: 'V04',
    question_number: 4,
    name: 'Kualitas Properti dan Aksesoris',
    question_text: 'Aksesoris dan properti foto yang disediakan (seperti kacamata lucu, bando, topi, dsb.) lengkap, bersih, dan menarik untuk dipakai berfoto.',
    order_index: 4,
  },
  {
    code: 'V05',
    question_number: 5,
    name: 'Kemudahan Penggunaan',
    question_text: 'Sistem dan perangkat booth (layar sentuh, navigasi menu, hitungan timer) sangat mudah dipahami dan nyaman dioperasikan secara mandiri.',
    order_index: 5,
  },
  {
    code: 'V06',
    question_number: 6,
    name: 'Kecepatan Proses Pengambilan & Cetak Foto',
    question_text: 'Proses pengambilan sesi foto efisien dan hasil cetakan foto fisik keluar dengan cepat tanpa harus menunggu antrean terlalu lama.',
    order_index: 6,
  },
  {
    code: 'V07',
    question_number: 7,
    name: 'Lokasi dan Aksesibilitas',
    question_text: 'Lokasi Photo Box ini strategis, mudah dijangkau di wilayah Samarinda (misal di pusat perbelanjaan / mall), serta memiliki area parkir yang nyaman.',
    order_index: 7,
  },
  {
    code: 'V08',
    question_number: 8,
    name: 'Pelayanan & Kesigapan Staf',
    question_text: 'Petugas / staf penjaga booth bersikap ramah, sopan, komunikatif, dan sigap membantu pengunjung saat dibutuhkan.',
    order_index: 8,
  },
  {
    code: 'V09',
    question_number: 9,
    name: 'Kualitas Cetakan Fisik Foto',
    question_text: 'Kualitas fisik kertas foto tebal, hasil cetakan tajam, warna tidak mudah luntur, dan awet untuk disimpan dalam jangka panjang.',
    order_index: 9,
  },
  {
    code: 'V10',
    question_number: 10,
    name: 'Fasilitas & Kenyamanan Area',
    question_text: 'Area Photo Box bersih, berpendingin ruangan (AC) yang sejuk, memiliki cermin rias yang memadai, serta suasana ruangan yang nyaman.',
    order_index: 10,
  },
];

export const LIKERT_OPTIONS = [
  { value: 1, label: 'Sangat Tidak Setuju', color: 'bg-red-50 text-red-700 border-red-200' },
  { value: 2, label: 'Tidak Setuju', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { value: 3, label: 'Netral', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 4, label: 'Setuju', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 5, label: 'Sangat Setuju', color: 'bg-purple-50 text-purple-700 border-purple-200' },
];
