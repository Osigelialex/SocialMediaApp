import SideNav from "../Components/SideNav";
import MakeRequest from "../utils/MakeRequest";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../apiConfig";
import CircularProgress from "@mui/material/CircularProgress";
import FollowSuggestion from "../Components/FollowSuggestion";
import Post from "../Components/Post";
import CommentCard from "../Components/commentCard";
import ProfilePicture from "../Components/profilePicture";
import Button from "@mui/material/Button";

const PostDetail = () => {

  const [postData, setPostData] = useState(null);
  const [postComments, setPostComments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestions] = useState(null);
  const loggedInUser = JSON.parse(localStorage.getItem("userData"));
  const { postId } = useParams();

  const getPostData = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const url = `${API_BASE_URL}/posts/${postId}`;

    const requestOptions = {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const fetchedPost = await MakeRequest(url, requestOptions);
    if (fetchedPost) {
      setPostData(fetchedPost.post);
    }
  };

  const getPostComments = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const url = `${API_BASE_URL}/posts/${postId}/comments`;

    const requestOptions = {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const fetchedComments = await MakeRequest(url, requestOptions);
    if (fetchedComments) {
      setPostComments(fetchedComments);
    }
  };

  const fetchSuggestions = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const accessToken = localStorage.getItem("accessToken");
    const baseURL = `${API_BASE_URL}/users/${userData._id}/suggestions`;

    const requestOptions = {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const responseData = await MakeRequest(baseURL, requestOptions);
    if (responseData) {
      setSuggestions(responseData.suggestions);
    }
  };

  useEffect(() => {
    getPostData()
      .then(() => fetchSuggestions())
      .then(() => getPostComments())
      .then(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex font-roboto text-black">
      <SideNav profilePicture={loggedInUser.profilePicture} />
      <div className="bg-[#efefef] w-full sm:w-2/4 sm:ml-40 p-2">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <CircularProgress />
          </div>
        ) : (
          <Post
            id={postData._id}
            userId={postData.user._id}
            username={postData.user.username}
            displayname={postData.user.displayname}
            imageUrl={postData.imageUrl}
            content={postData.content}
            comments={postData.comments}
            likes={postData.likes}
            likedByCurrentUser={postData.likedBy.hasOwnProperty(
              loggedInUser._id
            )}
            profilePicture={postData.user.profilePicture}
          />
        )}
        <div>
          <div className="p-2 flex justify-between gap-3">
            <ProfilePicture
              profilePicture={loggedInUser.profilePicture}
              alt={loggedInUser.username}
              userId={loggedInUser._id}
            />
            <form className="w-3/4">
              <input 
                type='text'
                placeholder="Post your reply..."
                className="border-none text-lg p-2 bg-transparent w-full text-gray-500 focus:outline-none"
              />
            </form>
            <Button variant="contained" type="submit">Reply</Button>
          </div>
          <h3 className="text-left font-bold text-black text-lg my-3">
            Comments
          </h3>
          {postComments &&
            postComments.comments.map((comment) => (
              <CommentCard
                key={comment._id}
                displayname={comment.user.displayname}
                username={comment.user.username}
                profilePicture={comment.user.profilePicture}
                comment={comment.content}
                userId={comment.user._id}
              />
            ))}
        </div>
      </div>
      <FollowSuggestion suggestions={suggestion} />
    </div>
  );
};

export default PostDetail;
