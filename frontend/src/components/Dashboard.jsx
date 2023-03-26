import { Routes, Route, Link, Outlet } from "react-router-dom";
//FIXME:remove Add order
import React from "react";
import Category from "./Category/Category";
import SubCategory from "./Category/SubCategory";

import Products from "./Products/Products";
import PageError from "./Error";
import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";
import Navbar from "../navbar/Navbar";

import { ReactNotifications } from 'react-notifications-component'

function Dashboard() {
  return (
    <React.Fragment>
      <div className="root">
        <Header />
        <div className="section">
          <Navbar />
          <ReactNotifications />
          <div className="container">
            {/*FIXME: MAke this Routes a saprate components*/}

            <Routes>
              <Route default exact path="/" element={<Home />} />
              <Route exact path="/category" element={<Category />} />
              <Route exact path="/subcategory" element={<SubCategory />} />
              <Route exact path="/products" element={<Products />} />

              <Route path="/*" element={<PageError />} />

            </Routes>
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    </React.Fragment>
  );
}

export default Dashboard;
