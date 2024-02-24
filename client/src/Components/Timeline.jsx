import { useState, useEffect } from "react";
import { FaImage } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Alert, Avatar } from "@mui/material";
import Button from "@mui/material/Button";
import MakeRequest from "../utils/MakeRequest";
import Post from "./Post";

const TimeLine = (props) => {
  const [posts, setPosts] = useState(null);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [postCreated, setPostCreated] = useState(false);
  const userId = props.data._id;

  const profilePicture = props.data.profilePicture;

  const Request = async (URL, requestOptions) => {
    const respData = await MakeRequest(URL, requestOptions);

    if (respData) {
      setIsLoaded(true);
      setPosts((prevPosts) => respData.posts || prevPosts);
    }
  };

  useEffect(() => {
    const URL = "http://localhost:5000/api/v1/posts";
    const accessToken = localStorage.getItem("accessToken");

    const requestOptions = {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    Request(URL, requestOptions);
  }, []);

  const handlePostCreate = async (e) => {
    e.preventDefault();
    setIsLoaded(false);

    const BASE_URL = "http://localhost:5000/api/v1/posts";
    const accessToken = localStorage.getItem("accessToken");

    // create a multipart form for post creation
    const formData = new FormData();
    formData.append("content", content);
    formData.append("file", image);

    const requestOptions = {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    };

    // Send post request
    await Request(BASE_URL, requestOptions);
    setImage(null);

    // display success message after post creation for 2 seconds
    setPostCreated(true);
    setTimeout(() => setPostCreated(false), 2000);

    // re-fetch data
    const URL = "http://localhost:5000/api/v1/posts";
    Request(URL, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  };

  return (
    <div className="bg-black w-full sm:w-2/4 sm:ml-40 ml-14 p-2">
      <div className="w-full bg-darkBg text-darkthemetext p-3">
        {postCreated && (
          <Alert severity="info">You successfully created a post.</Alert>
        )}
        <h3 className="text-left font-bold">Home</h3>
      </div>

      <div className="w-full bg-darkBg text-darkthemetext p-3 mb-2 min-h-fit flex gap-3">
        <Avatar
          alt={props.data.displayname}
          src={
            profilePicture
              ? `http://localhost:5000/uploads/${profilePicture}`
              : "/no-profile-picture.jpg"
          }
        />
        <form className="w-full" onSubmit={handlePostCreate}>
          <input
            type="text"
            name="content"
            placeholder="Share a new post!"
            className="text-lg w-full outline-none bg-transparent"
            onChange={(e) => setContent(e.target.value)}
            required
          />
          {/* display image preview */}
          {image && (
            <div className="w-full">
              <img
                src={URL.createObjectURL(image)}
                alt="Selected Image Preview"
                className="w-full object-scale-down h-72 my-5"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 text-blue-900 text-md my-5 pt-2">
            <label htmlFor="file">
              <FaImage />
            </label>
            <input
              className="hidden"
              id="file"
              name="file"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <Button variant="contained" type="submit">Post</Button>
          </div>
        </form>
        <span className="cursor-pointer text-xl" onClick={() => setImage(null)}>
          <RiDeleteBin6Line />
        </span>
      </div>
      {isLoaded &&
        posts.map((post) => (
          <Post
            key={post._id}
            id={post._id}
            userId={post.user._id}
            username={post.user.username}
            displayname={post.user.displayname}
            imageUrl={post.imageUrl}
            content={post.content}
            profilePicture={post.user.profilePicture}
            createdAt={post.createdAt}
            comments={post.comments}
            likes={post.likes}
            likedByCurrentUser={post.likedBy.hasOwnProperty(userId) || false}
            onClick={() => handlePostClick(post._id)}
          />
        ))}
    </div>
  );
};

export default TimeLine;
