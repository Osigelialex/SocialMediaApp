import Login from "./Pages/Authentication/Login";
import Signup from "./Pages/Authentication/Signup";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import PostDetail from "./Pages/PostDetail";
import RequestPasswordReset from "./Pages/Authentication/RequestPasswordReset";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="min-h-full">
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/requestpasswordreset">
            <RequestPasswordReset />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/profile/:userId">
            <Profile />
          </Route>
          <Route exact path="/post/:postId">
            <PostDetail />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
