import React from 'react';
import { createWS, ws } from '../utils/socket';
import { getPFP, updateField } from '../utils/profile';
import { showLogin } from '../utils/login';
import { initializeLayout, setupDM } from '../utils/initialize';
import { displayFriendsList, setupGroupDM } from '../utils/groupDM';
import { closeDM, messageRecieved, showNotif } from '../utils/messages';

import "../styles/index.css";
import "../styles/gif.css";
import "../styles/profile.css";

function connectSocket() {
  const ws = createWS();
  
  ws.addEventListener('open', () => {
    console.log("websocket connection established!");
    if (localStorage.getItem('sessionid') && localStorage.getItem('sessionid') != "undefined") {
      ws.send(JSON.stringify({ code: 1, op: 0, sid: localStorage.getItem('sessionid') }));
      getPFP();
    } else {
      showLogin();
    }
  });

  ws.addEventListener('message', (message) => {
    const response = JSON.parse(message.data);

    switch (response.code) {
      case 0:
        if (response.op == 403) {
          localStorage.clear();
          window.location.reload();
          return;
        }
        else if (response.op == 404) {
          const el = document.getElementsByClassName('uinp')[0];
          el.style.borderColor = 'red';
          el.style.borderStyle = 'solid';
        }
        else if (response.op == 401) {
          const el = document.getElementsByClassName('uinp')[1];
          el.style.borderColor = 'red';
          el.style.borderStyle = 'solid';
        }
        else {
          localStorage.setItem('sessionid', response.sessionid);
          window.location.reload();
        }
        break;

      case 1: {
        initializeLayout(response, sessionStorage.getItem('waitforDM'));
      }
        break;

      case 2: localStorage.removeItem('sessionid');
        window.location.reload();
        break;

      case 3:
        if (response.op == 0) {
          if (response.data.isGroupDM) {
            setupGroupDM(response);
          } else {
            if (sessionStorage.getItem('waitforDM')) {
              document.getElementById('loadingdiv').style.display = 'none';
              document.getElementById('maincontent').style.display = 'block';
              sessionStorage.removeItem('waitforDM')
            }
            setupDM(response);
          }
        }
        else if (response.op == 1) closeDM(response);
        else if (response.op == 2) console.log(response);
        break;

      case 4: if ([1, 2, 3, 4].includes(response.op)) return showNotif("friendrequest", `recieved social interaction!`);
      else if (response.op == 6) updateField(response);
      else if (response.op == 7) window.location.reload();
      else if (response.op == 8) displayFriendsList(response);
        break;

      case 5: messageRecieved(response);
        break;

      case 10: break;

      default: console.log("UNKNOWN RESPONSE ", response);
    }
  });

  ws.addEventListener('close', (ev) => {
    console.log(ev);
    console.log(`WEBSOCKET CLOSED WITH CODE ${ev.code}`);

    const bar = document.getElementById('reconnectingbar');
    bar.style.display = 'block';

    // try reconnecting
    setTimeout(() => {
      connectSocket();
    }, 1000);
  });
}

function HomePage() {
  React.useEffect(() => {
    localStorage.removeItem('currentChatID');
    connectSocket();
  }, [])

  return (
    <div>
      <span id="bodyWrapper">
        <div id="loadingdiv">
          <h1>L O A D I N G . . .</h1>
        </div>
        <div id="maincontent" style={{ display: "none" }}>
          <div id="reconnectingbar" className="reconnectingbar">R E C O N N E C T I N G . . .</div>
          <div id="dms" className="sidenav">
          </div>
          <div className="main">
            <div id="chatMain" style={{ display: "none" }}>
              <div id="messages"></div>
            </div>
          </div>
          <div className="userprofile">

          </div>
        </div>
      </span>
      <span id="errWrapper">
        <h1>This site is not yet available on screens smaller than 500px!</h1>
        <h2>In the meantime, feel free to check out my other stuff at <br /> <a href="https://www.itamarorenn.com/projects">www.itamarorenn.com</a></h2>
      </span>
    </div>
  );
}

export default React.memo(HomePage);