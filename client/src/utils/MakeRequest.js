import refreshToken from "./refreshToken";

const MakeRequest = async (URL, requestOptions) => {
  try {
    let resp = await fetch(URL, requestOptions);

    if (resp.status === 401) {
      const newAccessToken = await refreshToken();
      requestOptions.headers.Authorization = `Bearer ${newAccessToken}`;
      resp = await fetch(URL, requestOptions);
    }

    const data = await resp.json();
    return data.status === 'success' ? data : null;
  } catch (err) {
    return null;
  }
};

export default MakeRequest;