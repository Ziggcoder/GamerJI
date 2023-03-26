import React, {useContext} from "react";
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Navbar.css";
import NavContext from "../Context/NavContext";
function Navbar() {
  const path = "Permission/LoadMenu/";
  const { sidebar, setSidebar } = useContext(NavContext);
  return (
    <React.Fragment>
      <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items">
          <li>
            <Link to="#" className="navbar-icon crossbutton">
              <AiIcons.AiOutlineClose
                size={25}
                onClick={() => setSidebar(!sidebar)}
              />
          </Link>*
          </li>
          <li className="nav-text" id='visible'>
          <Link to="/">
          <AiIcons.AiFillHome />
            <span>Home</span>
          </Link>
          </li>
          <li className="nav-text" id='visible'>
          <Link to="/category">
          <FaIcons.FaEnvelopeOpenText />
            <span>Category</span>
          </Link>
          </li>
          <li className="nav-text" id='visible'>
          <Link to="/subcategory">
          <FaIcons.FaEnvelopeOpenText />
            <span>Subcategory</span>
          </Link>
          </li>
          <li className="nav-text" id='visible'>
          <Link to="/products">
          <FaIcons.FaEnvelopeOpenText />
            <span>Product</span>
          </Link>
          </li>
           
        </ul>
      </nav>
    
    </React.Fragment>
  );
}

export default Navbar;
