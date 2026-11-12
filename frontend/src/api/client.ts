import axios from 'axios';

// Alamat server API. Ketika dikembangkan di komputer sendiri, backend
// berjalan terpisah pada localhost:4000. Pada peladen, frontend dan API
// disajikan dari alamat yang sama sehingga nilainya dikosongkan melalui
// VITE_API_BASE dan seluruh permintaan memakai alamat relatif.
export const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000';

const api = axios.create({ baseURL: `${API_BASE}/api` });

// Sisipkan token pada setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Jika token kadaluarsa/invalid, paksa logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!location.pathname.startsWith('/login')) location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
