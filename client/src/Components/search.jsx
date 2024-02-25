import { useState, useEffect } from "react";
import API_BASE_URL from "../apiConfig";
import MakeRequest from "../utils/MakeRequest";
import CircularProgress from "@mui/material/CircularProgress";
import ProfilePicture from "./profilePicture";

const search = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (search.trim() !== "") {
        searchUser();
      }
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [search]);

  const searchUser = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    const url = `${API_BASE_URL}/search?query=${search}`;

    const requestOptions = {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const fetchedResults = await MakeRequest(url, requestOptions);
    if (fetchedResults) {
      setLoading(false);
      setNotFound(false);
      setSearchResults(fetchedResults.user);
    } else {
      setLoading(false);
      setSearchResults(null);
      setNotFound(true);
    }
  };

  return (
    <div className="bg-darkBg rounded-xl p-4 mb-14 w-full text-darkthemetext">
      <div className="flex gap-3">
        <input
          type="text"
          name="query"
          value={search}
          placeholder="Search for a user..."
          onChange={(e) => setSearch(e.target.value)}
          className="text-darkthemetext p-2 bg-field rounded-md w-full outline-none"
        />
      </div>
      <div className="grid place-items-center my-3">
        {loading && <CircularProgress />}
      </div>
      {searchResults && (
        <div
          className="bg-darkBg text-darkthemetext rounded-md p-2 my-1 flex justify-between shadow-lg"
        >
          <div className="flex items-center gap-3">
            <ProfilePicture
              profilePicture={searchResults.profilePicture}
              alt={searchResults.username}
              userId={searchResults._id}
            />
            <div>
              <p className="font-bold text-darkthemetext">{searchResults.displayname}</p>
              <p className="text-gray-500">@{searchResults.username}</p>
            </div>
          </div>
        </div>
      )}
      {notFound && <p>No user found</p>}
    </div>
  );
};

export default search;
