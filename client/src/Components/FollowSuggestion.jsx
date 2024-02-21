import ProfilePicture from "./profilePicture";
import { SlUserFollow } from "react-icons/sl";
import { useState } from "react";
import Search from "./search";

const FollowSuggestion = ({ suggestions }) => {
  const [followed, setFollowed] = useState(false);

  return (
    <div className="p-2 bg-[#efefef] hidden sm:block flex-1">
      {/* search section */}
      <Search />

      {/* follow suggestions */}
      <div className="border-2 bg-white rounded-md p-2">
        <h2 className="text-center text-md font-medium">Who to follow</h2>
      </div>
      {suggestions &&
        suggestions.map((suggestion) => {
          return (
            <div className="bg-white rounded-md p-2 my-1 flex justify-between">
              <div className="flex items-center gap-3">
                <ProfilePicture
                  profilePicture={suggestion.profilePicture}
                  alt={suggestion.username}
                  userId={suggestion._id}
                />
                <div>
                  <p className="font-bold">{suggestion.displayname}</p>
                  <p className="text-gray-500">@{suggestion.username}</p>
                </div>
              </div>
              {!followed && (
                <button>
                  <SlUserFollow size={20} />
                </button>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default FollowSuggestion;
