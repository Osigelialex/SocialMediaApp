import Search from "./search";
import UserCard from "./userCard";

const FollowSuggestion = ({ suggestions }) => {
  return (
    <div className="p-2 bg-black hidden sm:block flex-1">
      {/* search section */}
      <Search />

      {/* follow suggestions */}
      <div className="bg-darkBg text-darkthemetext rounded-lg p-2">
        <h2 className="text-center text-md font-medium">Who to follow</h2>
        {suggestions &&
          suggestions.map((user) => {
            return <UserCard user={user} />;
          })}
        {suggestions.length === 0 && (
          <h3 className="text-md font-light text-center my-2">
            No suggestions found
          </h3>
        )}
      </div>
    </div>
  );
};

export default FollowSuggestion;
