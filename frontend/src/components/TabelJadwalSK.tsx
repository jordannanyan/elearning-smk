import type { JamPelajaran, SlotJadwal } from '../api/types';

// ---------------------------------------------------------------------
// Tabel jadwal dengan susunan yang sama dengan jadwal resmi sekolah:
// baris JAM KE- terhadap kolom kelas, dikelompokkan menurut fase, dengan
// isi sel berupa kode gabungan huruf mata pelajaran dan nomor guru
// (misalnya E16). Baris istirahat ikut ditampilkan sebagaimana pada SK.
// ---------------------------------------------------------------------
interface Props {
  hari: string;
  kelas: { id: number; nama_kelas: string; tingkat: string }[];
  jam: JamPelajaran[];
  slot: SlotJadwal[];
  sorotKelas?: string | null;   // kelas siswa yang sedang masuk
  sorotGuru?: number | null;    // id guru yang sedang masuk
}

const LABEL_JENIS: Record<string, string> = {
  istirahat: 'ISTIRAHAT',
  jumatan: "JUM'ATAN",
};

export default function TabelJadwalSK({ hari, kelas, jam, slot, sorotKelas, sorotGuru }: Props) {
  // Fase E memuat kelas X, fase F memuat kelas XI dan XII, mengikuti
  // pengelompokan pada jadwal resmi.
  const faseE = kelas.filter((k) => k.tingkat === 'X');
  const faseF = kelas.filter((k) => k.tingkat !== 'X');

  const isi = new Map<string, SlotJadwal>();
  for (const s of slot) isi.set(`${s.id_kelas}|${s.jam_ke}`, s);

  const barisJam = jam.filter((j) => j.jenis === 'pelajaran');
  const kolomTotal = kelas.length + 1;

  function selKelas(k: typeof kelas[number], jamKe: number) {
    return isi.get(`${k.id}|${jamKe}`) || null;
  }

  // Sel dengan keterangan yang sama dan berurutan digabung menjadi satu,
  // seperti UPACARA BENDERA yang pada SK ditulis memanjang satu baris.
  function barisSel(jamKe: number) {
    const hasil: JSX.Element[] = [];
    let i = 0;
    while (i < kelas.length) {
      const s = selKelas(kelas[i], jamKe);
      const keg = s?.kegiatan && s.kegiatan !== 'P5' ? s.kegiatan : null;
      let rentang = 1;
      if (keg) {
        while (i + rentang < kelas.length) {
          const b = selKelas(kelas[i + rentang], jamKe);
          if (!b || b.kegiatan !== keg) break;
          rentang += 1;
        }
      }
      const disorot = (sorotKelas && kelas[i].nama_kelas === sorotKelas)
        || (sorotGuru != null && s?.id_guru === sorotGuru);
      hasil.push(
        <td key={kelas[i].id} colSpan={rentang}
          className={`${keg ? 'kegiatan' : ''} ${disorot && !keg ? 'sorot' : ''}`}
          title={s ? [s.kegiatan === 'P5' ? 'P5 — Projek Penguatan Profil Pelajar Pancasila'
            : s.nama_mapel, s.nama_guru].filter(Boolean).join(' — ') : undefined}>
          {keg ? keg
            : s ? (s.kode
              // Pada jadwal resmi, jam P5 ditulis hanya dengan nomor guru
              // pendampingnya, sehingga ditampilkan apa adanya di sini.
              || (s.kegiatan === 'P5' ? String(s.kode_jadwal ?? 'P5') : ''))
              : ''}
        </td>,
      );
      i += rentang;
    }
    return hasil;
  }

  return (
    <div className="jadwal-hari">
      <div className="judul-hari">{hari}</div>
      <div className="table-wrap">
        <table className="tabel-jadwal">
          <thead>
            <tr>
              <th rowSpan={2} className="kol-jam">JAM KE-</th>
              {faseE.length > 0 && <th colSpan={faseE.length}>FASE E</th>}
              {faseF.length > 0 && <th colSpan={faseF.length}>FASE F</th>}
            </tr>
            <tr>
              {kelas.map((k) => (
                <th key={k.id} className={sorotKelas === k.nama_kelas ? 'sorot' : ''}>
                  {k.nama_kelas}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jam.map((j, idx) => (
              j.jenis === 'pelajaran' ? (
                <tr key={`j${j.jam_ke}`}>
                  <td className="kol-jam">{j.jam_ke}</td>
                  {barisSel(j.jam_ke as number)}
                </tr>
              ) : (
                <tr key={`i${idx}`} className="baris-istirahat">
                  <td colSpan={kolomTotal}>
                    {j.mulai} {LABEL_JENIS[j.jenis] || j.jenis.toUpperCase()} {j.selesai}
                  </td>
                </tr>
              )
            ))}
            {barisJam.length === 0 && (
              <tr><td colSpan={kolomTotal} className="center-msg">Belum ada jadwal</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
