import { useState } from "react";
import { motion } from "framer-motion";
import { FaRegCommentAlt } from "react-icons/fa";
import { GiSelfLove } from "react-icons/gi";
import { FcLike } from "react-icons/fc";
import MakeRequest from "../utils/MakeRequest";
import { Alert } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ProfilePicture from "./profilePicture";
import API_BASE_URL from "../apiConfig";
import { useHistory } from "react-router-dom";

const Post = ({
  id,
  userId,
  username,
  displayname,
  imageUrl,
  content,
  comments,
  likes,
  likedByCurrentUser,
  profilePicture,
}) => {
  const [errorUnlikingPost, setErrorUnlikingPost] = useState(false);
  const [errorLikingPost, setErrorLikingPost] = useState(false);
  const [commentCount, setCommentCount] = useState(comments);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [liked, setPostLiked] = useState(likedByCurrentUser);
  const [likeCount, setLikeCount] = useState(likes);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const history = useHistory();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (event) => {
    const isLikeButton = event.target.matches(".like-button");
    const isCommentButton = event.target.matches(".comment-button");
    const isCancelButton = event.target.matches(".cancel");

    if (!isLikeButton && !isCommentButton && !isCancelButton) {
      history.push(`/post/${id}`);
    }
  };

  const unlikePost = async () => {
    const postId = id;
    const BASE_URL = `${API_BASE_URL}/posts/${postId}/likes`;
    const accessToken = localStorage.getItem("accessToken");

    const requestOptions = {
      method: "DELETE",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ id: postId }),
    };

    const responseData = await MakeRequest(BASE_URL, requestOptions);
    if (!responseData) {
      setErrorUnlikingPost(true);
      setTimeout(() => setErrorUnlikingPost(false), 2000);
      return;
    }

    setLikeCount(likeCount - 1);
    setPostLiked(false);
  };

  const likePost = async () => {
    const postId = id;
    const BASE_URL = `${API_BASE_URL}/posts/${postId}/likes`;
    const accessToken = localStorage.getItem("accessToken");

    const requestOptions = {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ id: postId }),
    };

    const responseData = await MakeRequest(BASE_URL, requestOptions);
    if (!responseData) {
      setErrorLikingPost(true);
      setTimeout(() => setErrorLikingPost(false), 2000);
      return;
    }

    setLikeCount(likeCount + 1);
    setPostLiked(true);
  };

  return (
    <div
      className="w-full rounded-xl mb-2 p-2 min-h-fit my-3 text-gray-700 bg-white cursor-pointer hover:bg-slate-100"
      onClick={(event) => handleClick(event)}
    >
      {/* error messages for like errors */}
      {errorLikingPost && <Alert severity="error">Error Liking post</Alert>}
      {errorUnlikingPost && <Alert severity="error">Error Unliking post</Alert>}

      {/* Comment Dialog box */}
      <Dialog
        sx={{ "& .MuiDialog-paper": { width: "80%" } }}
        open={open}
        onClose={handleClose}
        className="dialog"
        PaperProps={{
          component: "form",
          onSubmit: async (event) => {
            event.preventDefault();

            // send request to create comment
            const requestOptions = {
              method: "POST",
              credentials: "include",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ content: comment }),
            };

            const responseData = await MakeRequest(
              `${API_BASE_URL}/posts/${id}/comments`,
              requestOptions
            );

            if (responseData) {
              setComment("");
              setCommentCount(commentCount + 1);
              handleClose();

              // redirect to created comment
              history.push(`/post/${id}`);
            }
          },
        }}
      >
        <div className="flex gap-3 p-2">
          <ProfilePicture
            profilePicture={profilePicture}
            alt={username}
            userId={userId}
          />
          <div>
            <p className="text-md sm:text-lg text-gray-900">{displayname}</p>
            <p className="text-sm sm:text-md text-gray-500">@{username}</p>
          </div>
        </div>
        <div className="p-2 m-2">
          <p className="text-md sm:text-lg text-gray-900">{content}</p>
          {imageUrl ? imageUrl : ""}
        </div>
        <div className="p-2 m-1">
          <p className="text-gray-500 ml-4 text-lg">Replying to {username}</p>
        </div>
        <DialogContent>
          <ProfilePicture
            profilePicture={userData.profilePicture}
            alt={username}
            userId={userData._id}
          />
          <TextField
            margin="dense"
            id="comment"
            name="content"
            label="Type in a comment..."
            variant="outlined"
            value={comment}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              setComment(e.target.value)
            }}
            fullWidth
            type="text"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} className="cancel">Cancel</Button>
          <Button type="submit" className="create-comment">Comment</Button>
        </DialogActions>
      </Dialog>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <ProfilePicture
            profilePicture={profilePicture}
            alt={username}
            userId={userId}
          />
          <div>
            <p className="text-md sm:text-lg text-gray-900">{displayname}</p>
            <p className="text-sm sm:text-md text-gray-500">@{username}</p>
          </div>
        </div>
      </div>
      <p className="font-medium my-3 text-gray-900">{content}</p>
      {imageUrl ? (
        <img
          className="cursor-pointer h-auto w-full object-fit"
          src={`http://localhost:5000/${imageUrl}`}
        />
      ) : (
        ""
      )}
      <div className="flex ml-5 mt-5 cursor-pointer justify-between">
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{
            scale: 0.8,
            borderRadius: "100%",
          }}
        >
          <span
            className="text-md flex like-button"
            onClick={(e) => {
              e.stopPropagation();
              liked ? unlikePost() : likePost();
            }}
          >
            {liked ? <FcLike /> : <GiSelfLove />}
            {likeCount}
          </span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{
            scale: 0.8,
            borderRadius: "100%",
          }}
        >
          <span
            className="text-md flex comment-button"
            onClick={(e) => {
              e.stopPropagation();
              handleClickOpen();
            }}
          >
            <FaRegCommentAlt />
            {commentCount}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default Post;
