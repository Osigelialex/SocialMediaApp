import { useState } from "react";
import ProfilePicture from "./profilePicture";
import API_BASE_URL from "../apiConfig";
import MakeRequest from "../utils/MakeRequest";

const userCard = ({ user }) => {
  const userId = JSON.parse(localStorage.getItem("userData"))._id;
  const [followed, setFollowed] = useState(user.followers.includes(userId));
  const [unfollowed, setUnfollowed] = useState(
    !user.followers.includes(userId)
  );
  console.log(followed);

  const followUser = async () => {
    const url = `${API_BASE_URL}/users/${user._id}/follow`;
    const token = localStorage.getItem("accessToken");
    const requestOptions = {
      method: "POST",
      credential: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const data = await MakeRequest(url, requestOptions);
    if (data.status === "success") {
      setFollowed(true);
      setUnfollowed(false);
    }
  };

  const unfollowUser = async () => {
    const url = `${API_BASE_URL}/users/${user._id}/unfollow`;
    const token = localStorage.getItem("accessToken");
    const requestOptions = {
      method: "DELETE",
      credential: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const data = await MakeRequest(url, requestOptions);
    if (data.status === "success") {
      setUnfollowed(true);
      setFollowed(false);
    }
  };

  return (
    <div className="bg-darkBg text-darkthemetext rounded-md p-2 my-1 flex justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <ProfilePicture
          profilePicture={user.profilePicture}
          alt={user.username}
          userId={user._id}
        />
        <div>
          <p className="font-bold text-darkthemetext">{user.displayname}</p>
          <p className="text-gray-500">@{user.username}</p>
        </div>
      </div>

      {followed && (
        <button onClick={unfollowUser} className="text-blue-600">
          Unfollow
        </button>
      )}
      {unfollowed && (
        <button onClick={followUser} className="text-blue-600">
          Follow
        </button>
      )}
    </div>
  );
};

export default userCard;
