// ---------------------------------------------------------------------
// Perhitungan nilai akhir dan predikat
// ---------------------------------------------------------------------
// Nilai akhir sebuah mata pelajaran TIDAK dihitung sebagai rata-rata
// biasa, melainkan menurut bobot tiap penilaian yang ditentukan guru.
// Misalnya tugas 20%, kuis 15%, UTS 30%, dan UAS 35% sehingga seluruhnya
// berjumlah 100%; nilai akhirnya adalah jumlah dari nilai tiap penilaian
// dikalikan bobotnya.
//
// Pembaginya adalah SELURUH bobot penilaian pada mata pelajaran tersebut,
// bukan hanya bobot yang sudah dinilai. Penilaian yang belum dikerjakan
// atau belum dinilai tidak menyumbang nilai sama sekali, sehingga siswa
// yang hanya mengikuti UTS (25%) dan UAS (30%) tidak dapat memperoleh
// nilai akhir tinggi selama tugas-tugasnya masih kosong.
//
// Capaian atas penilaian yang sudah dinilai saja tetap dilaporkan
// terpisah sebagai `nilai_sementara`, yaitu gambaran mutu pekerjaan yang
// sudah dikerjakan siswa tanpa memperhitungkan penilaian yang belum ada.
// Ketika seluruh penilaian selesai dinilai, kedua angka tersebut sama.
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
  const jumlahBerbobot = dinilai.reduce(
    (a, d) => a + Number(d.skor) * Number(d.bobot || 0), 0);

  let nilai = null;         // nilai akhir terhadap seluruh bobot penilaian
  let sementara = null;     // capaian atas penilaian yang sudah dinilai saja
  let berbobot = false;

  if (dinilai.length === 0) {
    // Belum ada satu pun penilaian yang dinilai guru
    nilai = null;
  } else if (totalBobot > 0) {
    // Perhitungan menurut bobot, sesuai ketentuan penilaian sekolah.
    // Penilaian yang belum dinilai menyumbang nol pada nilai akhir.
    nilai = bulat(jumlahBerbobot / totalBobot);
    sementara = bulat(jumlahBerbobot / bobotDinilai);
    berbobot = true;
  } else {
    // Bobot belum ditentukan guru: sementara dipakai rata-rata biasa
    nilai = bulat(dinilai.reduce((a, d) => a + Number(d.skor), 0) / dinilai.length);
    sementara = nilai;
  }

  return {
    nilai_akhir: nilai,
    nilai_sementara: sementara,
    predikat: predikat(nilai),
    ketuntasan: ketuntasan(nilai),
    jumlah_dinilai: dinilai.length,
    jumlah_penilaian: daftar.length,
    total_bobot: bulat(totalBobot),
    bobot_dinilai: bulat(bobotDinilai),
    bobot_belum_dinilai: bulat(totalBobot - bobotDinilai),
    // Seluruh penilaian sudah dinilai sehingga nilai akhirnya final
    lengkap: totalBobot > 0 && bobotDinilai >= totalBobot,
    berbobot,
  };
}

module.exports = { KKM, PREDIKAT, predikat, ketuntasan, hitungNilaiAkhir, bulat };
