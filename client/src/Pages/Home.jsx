import SideNav from "../Components/SideNav";
import TimeLine from "../Components/Timeline";
import Aside from "../Components/Aside";

const Home = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));

  return (
    <div className="min-h-screen flex font-roboto">
      <SideNav userId={userData._id} profilePicture={userData.profilePicture} />
      <TimeLine data={userData} />
      <Aside />
    </div>
  );
};

export default Home;
