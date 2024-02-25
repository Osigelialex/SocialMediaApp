import { useState, useEffect } from "react";
import UserCard from "./userCard";
import API_BASE_URL from "../apiConfig";
import MakeRequest from "../utils/MakeRequest";
import Search from './search';

const Aside = () => {
  const [suggestions, setSuggestions] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));

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

  const updateSuggestions = () => {
    request();
  };

  useEffect(() => {
    request();
  }, []);

  return (
    <div className="p-2 bg-black hidden sm:block flex-1">
      {/* search section */}
      <Search />

      {/* follow suggestions */}
      <div className="bg-darkBg text-darkthemetext rounded-lg p-2">
        <h2 className="text-center font-bold mb-5 text-xl">Who to follow</h2>
        {suggestions &&
          suggestions.map((user) => {
            return <UserCard user={user} onFollowed={updateSuggestions} />;
          })}
        {suggestions.length === 0 && (
          <h3 className="text-md font-light text-center my-2">
            No suggestions found
          </h3>
        )}
      </div>
    </div>
  );
};

export default Aside;
