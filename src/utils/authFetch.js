export const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');
  
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  
    const config = {
      ...options,
      headers,
      credentials: 'include',
    };
  
    return fetch(url, config);
  };
  