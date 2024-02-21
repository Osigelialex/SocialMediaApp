import {
  IoHome,
  IoSearch,
  IoLogOutSharp,
} from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import MakeRequest from "../utils/MakeRequest";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";

const SideNav = ({ userId, profilePicture, displayname }) => {
  const [logoutFailure, setLogoutFailure] = useState(false);
  const id = JSON.parse(localStorage.getItem("userData"))._id;
  const history = useHistory();

  const handleLogout = async () => {
    const URL = "http://localhost:5000/api/v1/auth/logout";
    const accessToken = localStorage.getItem("accessToken");

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    };

    const responseData = await MakeRequest(URL, requestOptions);
    if (!responseData) {
      setLogoutFailure(true);
      setTimeout(() => setLogoutFailure(false), 2000);
      return;
    }

    localStorage.clear();
    history.push("/");
  };

  return (
    <div className="w-40 fixed hidden flex-1 sm:flex flex-col justify-between overflow-y-scroll no-scrollbar mr-2 border-r-2 h-screen p-3 text-gray-700">
      {logoutFailure && <Error action="log out" />}
      <Link to="/home">
        <NavItem icon={<IoHome />} />
      </Link>
      <NavItem icon={<IoSearch />} />
      <Link to={`/profile/${userId || id}`}>
        <NavItem icon={<FaUser />} />
      </Link>
      <NavItem icon={<IoLogOutSharp />} onClick={handleLogout} />

      <Avatar
        alt={displayname}
        src={
          profilePicture
            ? `http://localhost:5000/uploads/${profilePicture}`
            : "/no-profile-picture.jpg"
        }
        className="mx-auto"
      />
    </div>
  );
};

const NavItem = ({ icon, onClick }) => {
  return (
    <div
      className="p-4 my-6 grid place-items-center sm:w-1/2 text-xl mx-auto cursor-pointer hover:bg-gray-200 rounded-full"
      onClick={onClick}
    >
      {icon}
    </div>
  );
};

export default SideNav;
