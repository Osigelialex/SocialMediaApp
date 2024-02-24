import Post from "./Post";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { LuImagePlus } from "react-icons/lu";
import DialogTitle from "@mui/material/DialogTitle";
import { IoPencil } from "react-icons/io5";
import { Avatar } from "@mui/material";
import { useState } from "react";
import MakeRequest from "../utils/MakeRequest";

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
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
        <span
          className="absolute right-5 rounded-full p-3 cursor-pointer"
          onClick={handleClickOpen}
        >
          <IoPencil />
        </span>
        <div className="flex flex-col items-center">
          <Avatar
            alt={displayname}
            src={
              profilePicture
                ? `http://localhost:5000/uploads/${profilePicture}`
                : "/no-profile-picture.jpg"
            }
          />
          <p className="text-lg sm:text-2xl font-bold text-center">
            {displayname}
          </p>

          <p className="text-gray-500 text-sm sm:text-md">@{username}</p>
          <div className="flex gap-3">
            <p className="text-md sm:text-lg font-bold">
              {following} <span className="text-gray-500">Following</span>
            </p>
            <p className="text-md sm:text-lg font-bold">
              {followers} <span className="text-gray-500">Followers</span>
            </p>
          </div>
          {bio !== null && <p className="text-sm sm:text-md text-gray-500 w-2/3 my-4">{bio}</p>}
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
                  post.likedBy.hasOwnProperty(userId) || false
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
