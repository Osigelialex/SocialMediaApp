import { Link } from "react-router-dom";

const ProfilePicture = ({ profilePicture, alt, userId }) => {
  return (
    <>
      <Link to={`/profile/${userId}`}>
        {!profilePicture ? (
          <div className="w-12 h-12 profile-pic bg-gray-300 rounded-full cursor-pointer grid place-items-center">
            <p className="text-center text-2xl text-white">
              {alt[0].toUpperCase()}
            </p>
          </div>
        ) : (
          <img
            src={`http://localhost:5000/uploads/${profilePicture}`}
            alt="profile picture"
            className={`rounded-full w-12 h-12 cursor-pointer profile-pic`}
          />
        )}
      </Link>
    </>
  );
};

ProfilePicture.defaultProps = {
  profilePicture: null,
  alt: "user",
  userId: "",
};

export default ProfilePicture;
