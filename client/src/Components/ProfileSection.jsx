import Post from "./Post";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { LuImagePlus } from "react-icons/lu";
import DialogTitle from "@mui/material/DialogTitle";
import { Avatar } from "@mui/material";
import { useState } from "react";
import MakeRequest from "../utils/MakeRequest";
import API_BASE_URL from "../apiConfig";
import updateUser from "../utils/updateUser";

const ProfileSection = ({
  userId,
  displayname,
  username,
  followers,
  following,
  profilePicture,
  bio,
  posts,
}) => {
  const [open, setOpen] = useState(false);
  const [newDisplayname, setNewDisplayname] = useState(displayname);
  const [newBio, setNewBio] = useState(bio);
  const [followerCount, setFollowerCount] = useState(followers.length);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const loggedInUser = JSON.parse(localStorage.getItem("userData"));
  const isLoggedInUsersProfile = loggedInUser._id === userId;
  const [followed, setFollowed] = useState(
    followers.includes(loggedInUser._id)
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const followUser = async () => {
    const url = `${API_BASE_URL}/users/${userId}/follow`;
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
      setFollowerCount(followerCount + 1);
      updateUser();
    }
  };

  const unfollowUser = async () => {
    const url = `${API_BASE_URL}/users/${userId}/unfollow`;
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
      setFollowed(false);
      setFollowerCount(followerCount - 1);
      updateUser();
    }
  };

  return (
    <div className="w-full sm:w-2/4 sm:ml-40 ml-14 bg-black p-2">
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event) => {
            event.preventDefault();

            // create multipart form
            const formData = new FormData();
            formData.append("displayname", newDisplayname);
            formData.append("bio", newBio);
            formData.append("file", newProfilePicture);

            const requestOptions = {
              method: "PUT",
              credentials: "include",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
              body: formData,
            };
            const respData = await MakeRequest(
              `http://localhost:5000/api/v1/users/${userId}`,
              requestOptions
            );
            if (respData) {
              // update the userdata in localstorage to match updated data
              const userData = JSON.parse(localStorage.getItem("userData"));
              userData.displayname = newDisplayname;
              userData.bio = newBio;
              userData.profilePicture = respData.user.profilePicture;

              localStorage.setItem("userData", JSON.stringify(userData));
            }
            handleClose();
          },
        }}
      >
        <DialogTitle>Edit your profile</DialogTitle>
        <DialogContent>
          <label htmlFor="file" className="m-2 cursor-pointer">
            {newProfilePicture ? (
              <Avatar
                alt={displayname}
                src={URL.createObjectURL(newProfilePicture)}
              />
            ) : (
              <LuImagePlus size={50} />
            )}
          </label>
          <input
            type="file"
            id="file"
            name="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setNewProfilePicture(e.target.files[0])}
          />
          <TextField
            margin="dense"
            id="displayname"
            name="displayname"
            label="Display Name"
            variant="outlined"
            value={newDisplayname}
            onChange={(e) => setNewDisplayname(e.target.value)}
            fullWidth
            type="text"
          />
          <TextField
            margin="dense"
            id="bio"
            name="bio"
            label="bio"
            variant="outlined"
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            fullWidth
            type="text"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
      <div className="text-center p-3 bg-darkBg text-darkthemetext rounded-md relative">
        {isLoggedInUsersProfile ? (
          <span
            className="absolute right-5 rounded-full p-3 cursor-pointer"
            onClick={handleClickOpen}
          >
            <Button variant="outlined">Edit Profile</Button>
          </span>
        ) : (
          <span className="absolute right-5">
            {followed ? (
              <Button variant="outlined" onClick={unfollowUser}>Unfollow</Button>
            ) : (
              <Button variant="outlined" onClick={followUser}>Follow</Button>
            )}
          </span>
        )}
        <div className="flex flex-col items-start">
          <Avatar
            sx={{ width: 60, height: 60 }}
            alt={displayname}
            src={
              profilePicture
                ? `http://localhost:5000/uploads/${profilePicture}`
                : "/no-profile-picture.jpg"
            }
          />
          <p className="text-lg sm:text-2xl font-bold text-center mt-2">
            {displayname}
          </p>

          <p className="text-gray-500 text-sm sm:text-md mb-2">@{username}</p>
          <div className="flex gap-3 my-2">
            <p className="text-md sm:text-lg font-bold">
              {following.length} <span className="text-gray-500">Following</span>
            </p>
            <p className="text-md sm:text-lg font-bold">
              {followerCount} <span className="text-gray-500">Followers</span>
            </p>
          </div>
          {bio !== null && (
            <p className="text-sm sm:text-md text-darkthemetext font-bold w-2/3 my-4 text-left">
              {bio}
            </p>
          )}
        </div>
      </div>
      <div>
        {posts &&
          posts.map((post) => {
            return (
              <Post
                key={post._id}
                id={post._id}
                profilePicture={profilePicture}
                displayname={displayname}
                username={username}
                content={post.content}
                likedByCurrentUser={
                  post.likedBy.hasOwnProperty(loggedInUser._id) || false
                }
                likes={post.likes}
                imageUrl={post.imageUrl}
                comments={post.comments}
                createdAt={post.createdAt}
              />
            );
          })}
      </div>
    </div>
  );
};

export default ProfileSection;
