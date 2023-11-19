import React from 'react';
import { ws } from '../utils/socket';
import '../styles/login.css';

function recieveCode(data) {
  if (data.type == 1) return alert('email already exists!');
  if (data.type == 2) return alert('username already exists!');

  const element = document.getElementById('signupInpWrapper');
  element.style.display = 'none';

  const confEl = document.getElementById('confCodeInpWrapper');
  confEl.style.display = 'block';
}

function sendConfCode() {
  const code = document.getElementById('confCode').value;
  if (code) {
    ws.send(JSON.stringify({
      code: 0,
      op: 2,
      data: {
        confCode: code
      }
    }));
  }
}

function recieveCodeResponse(data) {
  if (data.type == 1) return alert('incorrect code!');
  else if (data.type == 2) return alert('code expired!\nplease refresh the page and try again!');
  window.location.href = '';
}

function createConfcodeRequest() {
  const username = document.getElementById('unameinp').value;
  const password = document.getElementById('upassinp').value;
  const email = document.getElementById('uemailinp').value;
  if (!username || !password || !email) return;

  ws.send(JSON.stringify({
    code: 0,
    op: 1,
    data: {
      username: username,
      password: password,
      email: email
    }
  }));
}

function JoinPage() {
  React.useEffect(() => {
    ws.addEventListener('error', (err) => {
      alert('Uh oh!\nAn error occured!');
      window.location.href = '/';

      console.error(err);
    });

    ws.addEventListener('close', (ev) => console.log(ev));

    ws.addEventListener('message', (message) => {
      const data = JSON.parse(message.data);
      if (data.code != 0) return;
      else if (data.op == 1) recieveCode(data);
      else if (data.op == 2) recieveCodeResponse(data);
    });
  }, []);

  return (
    <div>
      <div id="signupInpWrapper">
        <div className="signupdiv">
          <h1 style={{ textAlign: "center" }}>Create an account</h1>
          <div>
            <label htmlFor="uemailinp">email</label>
            <input type="email" className="inputField" id="uemailinp" />
          </div>

          <div className="inputDiv">
            <label htmlFor="unameinp">username</label>
            <input type="text" className="inputField" id="unameinp" />
          </div>

          <div className="inputDiv">
            <label htmlFor="upassinp">password</label>
            <input type="password" className="inputField" id="upassinp" />
          </div>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <a href="#a" className="submitBtn" onClick={createConfcodeRequest}>SUBMIT</a>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <a className="backBtn" href="/">HOME</a>
        </div>
      </div>

      <div id="confCodeInpWrapper" className="signupdiv" style={{ display: "none" }}>
        <h1>Confirmation email sent!</h1>
        <label htmlFor="confCode">Confirmation Code</label>
        <input type="text" className="inputField" id="confCode" />
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <a href="a" className="submitBtn" onClick={sendConfCode}>SUBMIT</a>
        </div>
      </div>

      <br /><br />
      <div style={{ textAlign: "center", color: "red" }}>
        <h1>ALL DATA IS UNENCRYPTED DURING THE ALPHA STAGE</h1>
        <p>including your passwords</p>
      </div>
    </div>
  );
}

export default React.memo(JoinPage);