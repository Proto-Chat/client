import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

function LoginPage() {
  return (
    <span id="bodyWrapper">
      <form id="loadingdiv" className="textc">
        <input placeholder="username" className="uinp" />
        <input placeholder="password" type="password" className="uinp margin10" />
        <button className="loginbtn margin10">login</button>
        <div className="mv5">
          <h2>Don't have an account?</h2>
          <Link to="/register" className="signupbtn margin10">sign up</Link>
        </div>
      </form>
    </span>
  );
}

export default React.memo(LoginPage);