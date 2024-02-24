import SideNav from "../Components/SideNav";
import TimeLine from "../Components/Timeline";
import FollowSuggestion from "../Components/FollowSuggestion";
import MakeRequest from "../utils/MakeRequest";
import { useEffect, useState } from "react";
import API_BASE_URL from "../apiConfig";

const Home = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const request = async () => {
      if (!userData) {
        return;
      }
      const accessToken = localStorage.getItem("accessToken");
      const baseURL = `${API_BASE_URL}/users/${userData._id}/suggestions`;

      const requestOptions = {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const responseData = await MakeRequest(baseURL, requestOptions);
      if (responseData) {
        setSuggestions(responseData.suggestions);
      } else {
        setSuggestions([]);
      }
    };

    request();
  }, []);

  return (
    <div className="min-h-screen flex font-roboto">
      <SideNav userId={userData._id} profilePicture={userData.profilePicture} />
      <TimeLine data={userData} />
      <FollowSuggestion suggestions={suggestions} />
    </div>
  );
};

export default Home;
