import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./views/login_component";
import SignUp from "./views/signup_component";
import UserDetails from "./views/userDetails";
import VerifyOTP from "./views/verifyOTP";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route path="/sign-in" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/verifyOTP" element={<VerifyOTP />} />
              <Route path="/userDetails" element={<UserDetails />} />    
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
