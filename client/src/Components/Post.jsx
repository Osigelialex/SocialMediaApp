import { useState } from "react";
import { motion } from "framer-motion";
import { FaRegCommentAlt } from "react-icons/fa";
import { GiSelfLove } from "react-icons/gi";
import { FcLike } from "react-icons/fc";
import MakeRequest from "../utils/MakeRequest";
import { Alert } from "@mui/material";
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
  const [liked, setPostLiked] = useState(likedByCurrentUser);
  const [likeCount, setLikeCount] = useState(likes);
  const history = useHistory();

  const handleClick = (event) => {
    const isLikeButton = event.target.matches(".like-button");
    const isProfilePic = event.target.matches(".profile-pic");

    if (!isLikeButton && !isProfilePic) {
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
      className="w-full rounded-xl mb-2 p-2 min-h-fit my-3 bg-darkBg text-darkthemetext cursor-pointer"
      onClick={(e) => handleClick(e)}
    >
      {/* error messages for like errors */}
      {errorLikingPost && <Alert severity="error">Error Liking post</Alert>}
      {errorUnlikingPost && <Alert severity="error">Error Unliking post</Alert>}

      <div className="flex justify-between">
        <div className="flex gap-2">
          <ProfilePicture
            profilePicture={profilePicture}
            alt={username}
            userId={userId}
          />
          <div>
            <p className="text-md sm:text-lg text-darkthemetext">{displayname}</p>
            <p className="text-sm sm:text-md text-gray-500">@{username}</p>
          </div>
        </div>
      </div>
      <p className="font-medium my-3 text-darkthemetext">{content}</p>
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
        <span
          className="text-md flex comment-button"
          onClick={(e) => {
            e.stopPropagation();
            history.push(`/post/${id}`)
          }}
        >
          <FaRegCommentAlt className="mr-1" />
          {commentCount} comments
        </span>
      </div>
    </div>
  );
};

export default Post;
