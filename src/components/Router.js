import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";
import SetName from "routes/SetName";

const AppRouter = ({ userObj, isLoggedIn, refreshUser }) => {
  return (
    <Router>
      {isLoggedIn ? (
        userObj.displayName === null ? null : (
          <Navigation userObj={userObj} />
        )
      ) : null}
      {/* {isLoggedIn && <Navigation userObj={userObj} />} */}
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/createAccount">
              <SetName userObj={userObj} refreshUser={refreshUser} />
            </Route>
            <Route exact path="/">
              <Home userObj={userObj} />
            </Route>
            <Route exact path="/profile">
              <Profile userObj={userObj} refreshUser={refreshUser} />
            </Route>
          </>
        ) : (
          <>
            <Route exact path="/">
              <Auth />
            </Route>
          </>
        )}
      </Switch>
    </Router>
  );
};

export default AppRouter;
