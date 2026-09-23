// ---------------------------------------------------------------------
// Paginasi sederhana agar daftar yang panjang tidak menumpuk pada satu
// halaman. Dipakai pada daftar tugas siswa dan daftar data lainnya.
// ---------------------------------------------------------------------
export default function Paginasi({ halaman, totalData, perHalaman, onGanti }: {
  halaman: number; totalData: number; perHalaman: number; onGanti: (h: number) => void;
}) {
  const totalHalaman = Math.max(1, Math.ceil(totalData / perHalaman));
  if (totalHalaman <= 1) return null;

  const awal = (halaman - 1) * perHalaman + 1;
  const akhir = Math.min(halaman * perHalaman, totalData);

  // Tampilkan maksimal lima nomor halaman di sekitar halaman aktif
  const mulai = Math.max(1, Math.min(halaman - 2, totalHalaman - 4));
  const nomor = Array.from({ length: Math.min(5, totalHalaman) }, (_, i) => mulai + i);

  return (
    <div className="paginasi">
      <span className="info">Menampilkan {awal}–{akhir} dari {totalData} data</span>
      <button onClick={() => onGanti(halaman - 1)} disabled={halaman <= 1}>‹</button>
      {nomor.map((n) => (
        <button key={n} className={n === halaman ? 'aktif' : ''} onClick={() => onGanti(n)}>{n}</button>
      ))}
      <button onClick={() => onGanti(halaman + 1)} disabled={halaman >= totalHalaman}>›</button>
    </div>
  );
}
