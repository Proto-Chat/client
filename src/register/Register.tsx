import React from 'react';
import './Register.css';
import { useSocket, useSocketMessage } from '../utils/socket';

function RegisterPage() {
  const socket = useSocket();
  const [showCode, setShowCode] = React.useState(false);

  useSocketMessage(0, 1, null, data => {
    switch (data.type) {
      case 1: alert('email already exists!'); break;
      case 2: alert('username already exists!'); break;
      default: setShowCode(true); break;
    }
  });

  useSocketMessage(0, 2, null, data => {
    switch (data.type) {
      case 1: alert('incorrect code!'); break;
      case 2: alert('code expired!\nplease refresh the page and try again!'); break;
      default: window.location.href = 'chat.itamarorenn.com'; break;
    }
  });

  const handleRegister = React.useCallback((event: React.FormEvent) => {
    event.preventDefault();
    const items = (event.target as HTMLFormElement).elements;

    const username = (items.namedItem('username') as HTMLInputElement)?.value;
    const password = (items.namedItem('password') as HTMLInputElement)?.value;
    const email = (items.namedItem('email') as HTMLInputElement)?.value;

    if (username == null || password == null || email == null) return;

    socket.send(0, 1, null, { username, password, email });
  }, [socket]);

  const handleSendCode = React.useCallback((event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const code = form.attributes.getNamedItem('confCode')?.value;
    if (code == null) return;

    socket.send(0, 2, null, { confCode: code });
  }, [socket]);

  const inner = showCode ? (
    <form id="confCodeInpWrapper" className="signupdiv" onSubmit={handleSendCode}>
      <h1>Confirmation email sent!</h1>
      <label htmlFor="confCode">Confirmation Code</label>
      <input type="text" className="inputField" id="confCode" name="confCode" />
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button className="submitBtn">SUBMIT</button>
      </div>
    </form>
  ) : (
    <div id="signupInpWrapper">
      <form className="signupdiv" onSubmit={handleRegister}>
        <h1 style={{ textAlign: 'center' }}>Create an account</h1>
        <label htmlFor="email" className="inputDiv">
          Email
          <input type="email" className="inputField" id="email" name="email" />
        </label>

        <label htmlFor="username" className="inputDiv">
          Username
          <input type="text" className="inputField" id="username" name="username" />
        </label>

        <label htmlFor="password" className="inputDiv">
          Password
          <input type="password" className="inputField" id="password" name="password" />
        </label>

        <div style={{ marginTop: "20px", textAlign: 'center' }}>
          <button className="submitBtn">SUBMIT</button>
        </div>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <a className="backBtn" href='/'>HOME</a>
      </div>
    </div>
  );

  return (
    <>
      {inner}
      <br /><br />
      <div style={{ textAlign: 'center', color: 'red' }}>
        <h1>ALL DATA IS UNENCRYPTED DURING THE ALPHA STAGE</h1>
        <p>including your passwords</p>
      </div>
    </>
  );
}

export default React.memo(RegisterPage);