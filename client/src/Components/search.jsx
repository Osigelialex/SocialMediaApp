import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import API_BASE_URL from "../apiConfig";
import MakeRequest from "../utils/MakeRequest";
import CircularProgress from "@mui/material/CircularProgress";
import ProfilePicture from "./profilePicture";
import { SlUserFollow } from "react-icons/sl";

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
    <div className="bg-white rounded-xl p-4 mb-14 w-full">
      <div className="flex gap-3">
        <TextField
          margin="dense"
          id="search"
          name="query"
          label="Search for a user"
          variant="outlined"
          fullWidth
          type="text"
          value={search}
          on
          onChange={(e) => { setSearch(e.target.value) }}
        />
      </div>
      <div className="grid place-items-center my-3">
        {loading && <CircularProgress />}
      </div>
      {searchResults && (
        <div className="flex justify-between bg-slate-50 rounded-md shadow-md p-2">
          <div className="flex gap-2">
            <ProfilePicture
              profilePicture={searchResults.profilePicture}
              alt={searchResults.username}
              userId={searchResults._id}
            />

            <div>
              <p>{searchResults.displayname}</p>
              <p>@{searchResults.username}</p>
            </div>
          </div>
          <div className="grid place-items-center cursor-pointer">
            <SlUserFollow size={20} />
          </div>
        </div>
      )}
      {notFound && <p>No user found</p>}
    </div>
  );
};

export default search;
