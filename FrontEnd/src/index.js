import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import store from "redux/store";
import theme from "./theme/theme.js";

import AuthLayout from "./layouts/Auth.js";
import AdminLayout from "./layouts/Admin.js";
import { userLogin } from "./redux/action/index.js";
import { userRole } from "./redux/action/index.js";
import Cookies from 'js-cookie';
const App = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    // Check for authentication when the component mounts
    // const isAuthenticated = localStorage.getItem("token") !== null;
    // debugger
    const isAuthenticated = localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined;
    // You may dispatch an action to set the user's authentication state in Redux here
    if (isAuthenticated) {
      const action = userLogin(); // Call the action creator
      dispatch(action); // Dispatch the action object returned by the action creator
    }
    const isAdmin = localStorage.getItem("isAdmin") !== null;
    // const isAdmin = Cookies.get('isAdmin') !== null;
    if (isAdmin) {
      dispatch(userRole(localStorage.getItem("isAdmin")));
      // dispatch(userRole(Cookies.get('isAdmin')));
    }
  }, []);

  return (
    <ChakraProvider theme={theme} resetCss={false} position="relative">
      <BrowserRouter>
        <Switch>
          <Route
            path="/auth"
            render={(props) =>
              !user.login ? (
                <AuthLayout {...props} />
              ) : (
                <Redirect to="/admin/company" />
              )
            }
          />
          <Route
            path="/admin"
            render={(props) =>
              user.login ? (
                <AdminLayout {...props} />
              ) : (
                <Redirect to="/auth/signin" />
              )
            }
          />
          <Redirect from="/" to="/auth/signin" />
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
