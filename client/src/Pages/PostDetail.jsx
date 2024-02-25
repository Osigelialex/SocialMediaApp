import SideNav from "../Components/SideNav";
import MakeRequest from "../utils/MakeRequest";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../apiConfig";
import CircularProgress from "@mui/material/CircularProgress";
import Aside from "../Components/Aside";
import Post from "../Components/Post";
import CommentCard from "../Components/commentCard";
import { MdOutlineDelete } from "react-icons/md";
import { Alert } from "@mui/material";

const PostDetail = () => {
  const [postData, setPostData] = useState(null);
  const [postComments, setPostComments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [textarea, setTextarea] = useState("");
  const [commentCreated, setCommentCreated] = useState(false);
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

  const deleteContents = () => {
    setTextarea("");
  }

  const createComment = async () => {
    const url = `${API_BASE_URL}/posts/${postId}/comments`;
    const requestOptions = {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: textarea })
    }
    const data = await MakeRequest(url, requestOptions);
    if (data) {
      // display for two seconds
      setCommentCreated(true);
      setTimeout(() => setCommentCreated(false), 2000);
      setTextarea('');
    }
  }

  useEffect(() => {
    getPostData()
      .then(() => getPostComments())
      .then(() => setLoading(false));
  }, []);

  useEffect(() => {
    getPostComments();
  }, [commentCreated]);

  return (
    <div className="min-h-screen flex font-roboto text-black">
      <SideNav profilePicture={loggedInUser.profilePicture} />
      <div className="bg-black w-full sm:w-2/4 sm:ml-40 ml-14 p-2">
        {/* show comment created alert */}
        {commentCreated && <Alert severity="success">Comment created successfully</Alert>}
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
          <p className="text-sm my-2 font-medium">Add your comment</p>
          <textarea
            value={textarea}
            placeholder="Share your thoughts..."
            className="w-full P-2 focus:outline-darkthemetext bg-darkBg text-darkthemetext outline-none h-32 text-lg"
            onChange={(e) => setTextarea(e.target.value)}
          ></textarea>

          <div className="w-full bg-field flex gap-3 align-middle justify-end m-0 p-2 border-1 border-black">
            <MdOutlineDelete size={30} style={{ color: 'white' }} onClick={deleteContents} className="cursor-pointer" />
            <button
              className="rounded-lg font-bold p-2 bg-darkthemetext"
              onClick={createComment}
            >Comment</button>
          </div>

          <h3 className="text-left font-bold text-black text-lg my-3" onClick={createComment}>
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
      <Aside />
    </div>
  );
};

export default PostDetail;
