import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loginn from "./Loginn";
import Signupp from "./Signupp";
import Home from "../homepage/Home";
import AdminPage from "../homepage/AdminPage";
import ForgotPassword from "./ForgotPassword";
import CustomerPage from "../homepage/CustomerPage";
import AgentPage from "../homepage/AgentPage";

const Direct = () => {
  return (
    <div>  <Router>
  
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminPage/>}/>
      <Route path="/loginn" element={<Loginn />} />
      <Route path="/signupp" element={<Signupp />} />
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/customer" element={<CustomerPage/>}/>
      <Route path="/agent" element={<AgentPage/>}/>
      
          
    </Routes>
  </Router>
  </div>
  )
}

export default Direct