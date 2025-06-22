export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (response.status === 401 || response.status === 403) {
    try {
      const refreshRes = await fetch('http://localhost:5000/api/admin/auth/refresh-token', {
        method: 'POST',
        credentials: 'include',
      });

      const refreshData = await refreshRes.json();

      if (refreshData.success && refreshData.accessToken) {
        localStorage.setItem('token', refreshData.accessToken);
        return await fetchWithAuth(url, options); // Retry original request
      } else {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return null;
      }
    } catch (err) {
      console.error('Failed to refresh token:', err);
      localStorage.removeItem('token');
      window.location.href = '/login';
      return null;
    }
  }

  return response;
}
