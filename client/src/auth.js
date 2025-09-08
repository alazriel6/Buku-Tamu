export const isAdmin = () => {
  // Cek admin manual
  if (localStorage.getItem('admin_token')) return true;
  // Cek JWT dan role admin
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  } catch {
    return false;
  }
};

// JWT Auth
export const setToken = (token) => {
  localStorage.setItem('jwt_token', token);
};

export const getToken = () => {
  return localStorage.getItem('jwt_token');
};

export const removeToken = () => {
  localStorage.removeItem('jwt_token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

// Google Login
export const loginWithGoogle = () => {
  window.location.href = 'http://localhost:5000/api/auth/google';
};

export const loginAdmin = () => {
    localStorage.setItem('admin_token', 'true');
};

export const logoutAdmin = () => {
  localStorage.removeItem('admin_token'); // Atau kunci yang kamu gunakan
};
export const isLoggedIn = () => {
    return localStorage.getItem('admin_token') !== null;
};
// Proteksi route (untuk komponen React)
export const requireAuth = (next) => {
  if (!isAuthenticated()) {
    window.location.href = '/login';
    return null;
  }
  return next;
};