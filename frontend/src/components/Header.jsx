import React from "react";
import snaxsmart from "../assets/logo.png";
import { useCookies } from "react-cookie";
import { useContext } from "react";
import AuthContext from "../Context/AuthContext";
import NavContext from "../Context/NavContext";
import * as FaIcons from "react-icons/fa";
import { Link } from "react-router-dom";


function Header() {
 
  const [cookies, setCookie,removeCookie] = useCookies(["user"]);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { sidebar, setSidebar } = useContext(NavContext);

  function logout() {
    alert("Are you want to Log out?");
    setIsLoggedIn(false);
   
    removeCookie('JWTcookie',{path:"/"});
  

  }

  function showSidebar() {
    setSidebar(!sidebar);
  }

  return (
    <React.Fragment>
      <div className="header">
  
       
     <div className="navbar-btn">
   
         {!sidebar &&
 
          <Link to='#' className='navbar-icon'>
          <FaIcons.FaBars size={30} onClick={() => setSidebar(true)}/>
          </Link>
     
      }
      
      </div>
     
  

        <div className="headercontent">
          <img src={snaxsmart} alt="snaxsmart" className="logo"/>
        </div>

        <div className="headercontent">
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Header;
