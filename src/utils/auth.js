export const isAuthenticated = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/admin/auth/check-session', {
      method: 'GET',
      credentials: 'include',
    });

    const data = await res.json();
    return data.success;
  } catch (err) {
    return false;
  }
};

export const logout = async () => {
  try {
    await fetch('http://localhost:5000/api/admin/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    console.error('Logout failed:', err);
  }
};
