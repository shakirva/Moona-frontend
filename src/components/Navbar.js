const handleLogout = () => {
  localStorage.removeItem('adminToken');
  window.location.href = '/login';
};
