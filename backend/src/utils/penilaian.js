// ---------------------------------------------------------------------
// Perhitungan nilai akhir dan predikat
// ---------------------------------------------------------------------
// Nilai akhir sebuah mata pelajaran TIDAK dihitung sebagai rata-rata
// biasa, melainkan menurut bobot tiap penilaian yang ditentukan guru.
// Misalnya tugas 20%, kuis 15%, UTS 30%, dan UAS 35% sehingga seluruhnya
// berjumlah 100%; nilai akhirnya adalah jumlah dari nilai tiap penilaian
// dikalikan bobotnya.
//
// Selama semester masih berjalan biasanya belum seluruh penilaian
// terlaksana. Agar angkanya tetap wajar, pembaginya adalah jumlah bobot
// penilaian yang SUDAH dinilai, bukan 100. Dengan begitu, ketika seluruh
// penilaian selesai dan bobotnya genap 100%, hasilnya sama persis dengan
// jumlah nilai dikali bobot masing-masing.
// ---------------------------------------------------------------------

const KKM = 75;

const PREDIKAT = [
  { batas: 90, huruf: 'A', keterangan: 'Sangat Baik' },
  { batas: 80, huruf: 'B', keterangan: 'Baik' },
  { batas: 70, huruf: 'C', keterangan: 'Cukup' },
  { batas: 0, huruf: 'D', keterangan: 'Perlu Bimbingan' },
];

function predikat(nilai) {
  if (nilai === null || nilai === undefined) {
    return { huruf: '-', keterangan: 'Belum ada nilai' };
  }
  const p = PREDIKAT.find((x) => Number(nilai) >= x.batas) || PREDIKAT[PREDIKAT.length - 1];
  return { huruf: p.huruf, keterangan: p.keterangan };
}

function ketuntasan(nilai) {
  if (nilai === null || nilai === undefined) {
    return { tuntas: null, label: 'Belum dinilai' };
  }
  return Number(nilai) >= KKM
    ? { tuntas: true, label: 'Tuntas' }
    : { tuntas: false, label: 'Belum Tuntas' };
}

const bulat = (n) => (n === null || n === undefined
  ? null : Math.round(Number(n) * 100) / 100);

/**
 * @param {{skor: any, bobot: any}[]} daftar seluruh penilaian pada satu mata pelajaran
 * @returns ringkasan nilai akhir beserta keterangan bobotnya
 */
function hitungNilaiAkhir(daftar) {
  const dinilai = daftar.filter((d) => d.skor !== null && d.skor !== undefined);
  const totalBobot = daftar.reduce((a, d) => a + Number(d.bobot || 0), 0);
  const bobotDinilai = dinilai.reduce((a, d) => a + Number(d.bobot || 0), 0);

  let nilai = null;
  let berbobot = false;

  if (bobotDinilai > 0) {
    // Perhitungan menurut bobot, sesuai ketentuan penilaian sekolah
    const jumlah = dinilai.reduce((a, d) => a + Number(d.skor) * Number(d.bobot || 0), 0);
    nilai = bulat(jumlah / bobotDinilai);
    berbobot = true;
  } else if (dinilai.length > 0) {
    // Bobot belum ditentukan guru: sementara dipakai rata-rata biasa
    nilai = bulat(dinilai.reduce((a, d) => a + Number(d.skor), 0) / dinilai.length);
  }

  return {
    nilai_akhir: nilai,
    predikat: predikat(nilai),
    ketuntasan: ketuntasan(nilai),
    jumlah_dinilai: dinilai.length,
    jumlah_penilaian: daftar.length,
    total_bobot: bulat(totalBobot),
    bobot_dinilai: bulat(bobotDinilai),
    berbobot,
  };
}

module.exports = { KKM, PREDIKAT, predikat, ketuntasan, hitungNilaiAkhir, bulat };
