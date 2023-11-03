import React from 'react';
import './Login.css';

function LoginPage() {
  return (
    <span id="bodyWrapper">
      <div id="loadingdiv" className="textc">
        <input placeholder="username" className="uinp" />
        <div>
          <input placeholder="password" type="password" className="uinp margin10" />
        </div>
        <div>
          <button className="loginbtn margin10">login</button>
        </div>
        <div className="mv5">
          <h2>Don't have an account?</h2>
          <button className="signupbtn margin10">sign up</button>
        </div>
      </div>
    </span>
  );
}

export default React.memo(LoginPage);