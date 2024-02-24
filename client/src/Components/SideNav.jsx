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
    <div className="sm:w-40 w-14 fixed flex-1 bg-darkBg sm:flex flex-col justify-between overflow-y-scroll no-scrollbar mr-1 h-screen text-gray-700">
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
      className="my-6 grid place-items-center w-12 h-12 text-xl mx-auto cursor-pointer hover:bg-gray-800 rounded-full"
      onClick={onClick}
    >
      {icon}
    </div>
  );
};

export default SideNav;
