import React, { useState, useContext } from "react";
import {postReq } from "./middleware/AxiosApisCall";
import AuthContext from "../Context/AuthContext";
import { useCookies } from "react-cookie";
import { SuccessAlert, ErrorAlert } from "./middleware/AlertMsg";

import Clogo from "../assets/logo.png";
function Login() {
  const path = "Login";
  const [inputs, setInputs] = useState({});
  const [cookies, setCookie] = useCookies(["user"]);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await postReq(path,inputs);
      console.log("🚀 ~ file: Login.jsx:24 ~ submitData ~ inputs", inputs)
      if (response.success) {
        setCookie("JWTcookie", response.data ,{ path: "/" });
        setIsLoggedIn(true);
        SuccessAlert({
          title: "Login",
          message: "Login successfully",
        });
      } else {
        ErrorAlert({ title: "Login", message:response.msg });
      }

  };

  return (
    <React.Fragment>
      <div className="loginbody">
        <div className="loginbox">
          <img src={Clogo} className="cicon" />
          <h3>Sign In Here</h3>
          <form onSubmit={handleSubmit}>
            <div className="inputdiv">
              <label>User ID</label>
              <input
                type="text"
                name="user_id"
                value={inputs.user_id || ""}
                onChange={handleChange}
                placeholder="User ID"
                required
              />
            </div>
            <div className="inputdiv">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={inputs.password || ""}
                onChange={handleChange}
                placeholder="User password"
                required
              />
            </div>
           
             <input  type="submit" value="Login" />
          </form>
          <a href="#" className="forgot">
            Forgot Password
          </a>
        </div>
      </div>
      </React.Fragment>
  )
}
  

export default Login;

