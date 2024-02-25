import API_BASE_URL from "../apiConfig";
import MakeRequest from "./MakeRequest";

const updateUser = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const baseURL = `${API_BASE_URL}/me`;
  const requestOptions = {
    method: "GET",
    credentials: "include",
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  const responseData = await MakeRequest(baseURL, requestOptions);
  localStorage.removeItem('userData');
  localStorage.setItem('userData', JSON.stringify(responseData.user));
};

export default updateUser;
