import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import type { Role } from './api/types';
import Layout from './components/Layout';
import Login from './pages/Login';

import AdminDashboard from './pages/admin/Dashboard';
import DataGuru from './pages/admin/DataGuru';
import DataSiswa from './pages/admin/DataSiswa';
import DataKelas from './pages/admin/DataKelas';
import DataMapel from './pages/admin/DataMapel';

import GuruDashboard from './pages/guru/Dashboard';
import GuruMateri from './pages/guru/Materi';
import GuruTugas from './pages/guru/Tugas';
import GuruForum from './pages/guru/Forum';

import SiswaDashboard from './pages/siswa/Dashboard';
import SiswaMateri from './pages/siswa/Materi';
import SiswaTugas from './pages/siswa/Tugas';
import SiswaNilai from './pages/siswa/Nilai';
import SiswaForum from './pages/siswa/Forum';

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
        <Route path="/admin/guru" element={<DataGuru />} />
        <Route path="/admin/siswa" element={<DataSiswa />} />
        <Route path="/admin/kelas" element={<DataKelas />} />
        <Route path="/admin/mapel" element={<DataMapel />} />
      </Route>

      <Route element={<Protected role="guru"><Layout /></Protected>}>
        <Route path="/guru" element={<GuruDashboard />} />
        <Route path="/guru/materi" element={<GuruMateri />} />
        <Route path="/guru/tugas" element={<GuruTugas />} />
        <Route path="/guru/forum" element={<GuruForum />} />
      </Route>

      <Route element={<Protected role="siswa"><Layout /></Protected>}>
        <Route path="/siswa" element={<SiswaDashboard />} />
        <Route path="/siswa/materi" element={<SiswaMateri />} />
        <Route path="/siswa/tugas" element={<SiswaTugas />} />
        <Route path="/siswa/nilai" element={<SiswaNilai />} />
        <Route path="/siswa/forum" element={<SiswaForum />} />
      </Route>

      <Route path="*" element={<Home />} />
    </Routes>
  );
}
