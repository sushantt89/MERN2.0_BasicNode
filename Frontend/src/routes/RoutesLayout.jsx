import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import AddBook from "../pages/addBook/AddBook";
const RoutesLayout = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/addBook" element={<AddBook />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default RoutesLayout;
