import ProfilePicture from "./profilePicture";

const CommentCard = ({ profilePicture, displayname, username, comment, userId }) => {
  return (
    <div className="flex gap-3 p-2 bg-white mb-2">
      <ProfilePicture
        profilePicture={profilePicture}
        alt={username}
        userId={userId}
      />
      <div>
        <p className="text-md sm:text-lg text-gray-900">{displayname}</p>
        <p className="text-sm sm:text-md text-gray-500">@{username}</p>
        <p className="text-md sm:text-md text-gray-900">{comment}</p>
      </div>
    </div>
  );
}

export default CommentCard;