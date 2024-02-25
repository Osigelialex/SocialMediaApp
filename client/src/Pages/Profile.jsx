import SideNav from "../Components/SideNav";
import ProfileSection from "../Components/ProfileSection";
import Aside from "../Components/Aside";
import MakeRequest from "../utils/MakeRequest";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import API_BASE_URL from "../apiConfig";

const Profile = () => {
  const { userId } = useParams();
  const [posts, setPosts] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const loggedInUser = JSON.parse(localStorage.getItem("userData"));

  const fetchUserData = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const baseURL = `${API_BASE_URL}/users/${userId}`;
    const requestOptions = {
      method: "GET",
      credentials: "include",
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const responseData = await MakeRequest(baseURL, requestOptions);
    setUserData(responseData.user);
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]); // Only fetch userData when userId changes

  useEffect(() => {
    const fetchPosts = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const baseURL = `${API_BASE_URL}/posts/user/${userId}`;
      const requestOptions = {
        method: "GET",
        credentials: "include",
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const responseData = await MakeRequest(baseURL, requestOptions);
      setPosts(responseData.posts);
      setLoading(false);
    };

    fetchPosts();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex font-roboto text-black">
        <SideNav
          profilePicture={loggedInUser.profilePicture}
          displayname={loggedInUser.displayname}
        />
        <div className="w-full sm:w-2/4 sm:ml-40 ml-14 bg-black p-2 grid place-items-center">
          <CircularProgress color="inherit" />
        </div>
        <Aside />
      </div>
    );
  } else {
    return (
      <div className="min-h-screen flex font-roboto text-darkthemetext">
        <SideNav
          profilePicture={loggedInUser.profilePicture}
          displayname={loggedInUser.displayname}
        />
        <ProfileSection
          userId={userData._id}
          displayname={userData.displayname}
          username={userData.username}
          followers={userData.followers}
          following={userData.following}
          bio={userData.bio}
          profilePicture={userData.profilePicture}
          posts={posts}
        />
        <Aside />
      </div>
    );
  }
};

export default Profile;
