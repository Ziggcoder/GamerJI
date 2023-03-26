import React, { useState } from "react";
import {Link, Outlet } from "react-router-dom";

function SubLink(props) {
  const [Sublinks,setSubLinks]=useState(props.sublinks)
  return (
     <Outlet/>
  );
}

export default SubLink;