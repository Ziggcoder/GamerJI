import React, { useState } from 'react'
import { useCookies } from 'react-cookie';
import "./App.css";
import 'react-notifications-component/dist/theme.css'
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AuthContext  from './Context/AuthContext';
import NavContext from './Context/NavContext';


function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [isLoggedIn, setIsLoggedIn] = useState(cookies.JWTcookie != undefined);
  const [sidebar, setSidebar] = useState();


  return (
    <React.Fragment>
    
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        {isLoggedIn ? (
          <NavContext.Provider value={{ sidebar, setSidebar }}>
            <Dashboard />
          </NavContext.Provider>
        ) : (
          <Login />
        )}
      </AuthContext.Provider>
      </React.Fragment>
  );
}

export default App;
