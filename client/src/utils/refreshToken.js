const refreshToken = async () => {
  const REFRESH_URL = 'http://localhost:5000/api/v1/auth/refresh-token';

  const resp = await fetch(REFRESH_URL, {
    method: 'POST',
    credentials: 'include'
  })

  if (resp.status === 401) {
    return null;
  }

  const data = await resp.json();
  localStorage.setItem('accessToken', data.accessToken);
  return data.accessToken;
}

export default refreshToken;
