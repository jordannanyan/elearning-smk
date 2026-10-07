// ---------------------------------------------------------------------
// Kendali status data pada halaman administrator.
//
// Mengaktifkan, menonaktifkan, dan menghapus permanen digabung menjadi
// satu dropdown pada kolom Status. Dengan begitu tombol hapus tidak lagi
// tersebar sebagai tombol merah di dalam tabel: penghapusan permanen
// hanya dapat dijangkau dari dropdown ini, sehingga kecil kemungkinan
// terpilih secara tidak sengaja.
// ---------------------------------------------------------------------
export default function PilihStatus({ aktif, bolehHapus, alasanTakBolehHapus, onUbahStatus, onHapus }: {
  aktif: boolean;
  bolehHapus: boolean;
  alasanTakBolehHapus?: string;
  onUbahStatus: (jadiAktif: boolean) => void;
  onHapus: () => void;
}) {
  function pilih(nilai: string) {
    if (nilai === 'hapus') onHapus();
    else onUbahStatus(nilai === 'aktif');
  }

  return (
    <select
      className={`pilih-status ${aktif ? 'aktif' : 'nonaktif'}`}
      value={aktif ? 'aktif' : 'nonaktif'}
      title={bolehHapus ? undefined : alasanTakBolehHapus}
      onChange={(e) => pilih(e.target.value)}
    >
      <option value="aktif">Aktif</option>
      <option value="nonaktif">Nonaktif</option>
      <option value="hapus" disabled={!bolehHapus}>Hapus permanen</option>
    </select>
  );
}
