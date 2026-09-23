import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import type { Role } from './api/types';
import Layout from './components/Layout';
import Login from './pages/Login';

import AdminDashboard from './pages/admin/Dashboard';
import AdminPeriode from './pages/admin/Periode';
import DataGuru from './pages/admin/DataGuru';
import DataSiswa from './pages/admin/DataSiswa';
import DataKelas from './pages/admin/DataKelas';
import DataMapel from './pages/admin/DataMapel';

import GuruDashboard from './pages/guru/Dashboard';
import GuruKelas from './pages/guru/KelasSaya';
import GuruKelasDetail from './pages/guru/KelasDetail';
import GuruPertemuan from './pages/guru/PertemuanDetail';
import GuruPenilaian from './pages/guru/Penilaian';

import SiswaDashboard from './pages/siswa/Dashboard';
import SiswaKelas from './pages/siswa/KelasSaya';
import SiswaKelasDetail from './pages/siswa/KelasDetail';
import SiswaPertemuan from './pages/siswa/PertemuanDetail';
import SiswaTugas from './pages/siswa/Tugas';
import SiswaNilai from './pages/siswa/Nilai';

function Protected({ role, children }: { role: Role; children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return children;
}

function Home() {
  const { user } = useAuth();
  return <Navigate to={user ? `/${user.role}` : '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route element={<Protected role="admin"><Layout /></Protected>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/periode" element={<AdminPeriode />} />
        <Route path="/admin/guru" element={<DataGuru />} />
        <Route path="/admin/siswa" element={<DataSiswa />} />
        <Route path="/admin/kelas" element={<DataKelas />} />
        <Route path="/admin/mapel" element={<DataMapel />} />
      </Route>

      <Route element={<Protected role="guru"><Layout /></Protected>}>
        <Route path="/guru" element={<GuruDashboard />} />
        <Route path="/guru/kelas" element={<GuruKelas />} />
        <Route path="/guru/kelas/:id" element={<GuruKelasDetail />} />
        <Route path="/guru/pertemuan/:id" element={<GuruPertemuan />} />
        <Route path="/guru/penilaian" element={<GuruPenilaian />} />
      </Route>

      <Route element={<Protected role="siswa"><Layout /></Protected>}>
        <Route path="/siswa" element={<SiswaDashboard />} />
        <Route path="/siswa/kelas" element={<SiswaKelas />} />
        <Route path="/siswa/kelas/:id" element={<SiswaKelasDetail />} />
        <Route path="/siswa/pertemuan/:id" element={<SiswaPertemuan />} />
        <Route path="/siswa/tugas" element={<SiswaTugas />} />
        <Route path="/siswa/nilai" element={<SiswaNilai />} />
      </Route>

      <Route path="*" element={<Home />} />
    </Routes>
  );
}
