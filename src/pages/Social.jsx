import React from 'react';
import { createWS } from '../utils/socket';
import { changeCol, createPendingResponseBar, divs, getAddFriendInp, getFriendRequestResponse, initializeSocialLayout, recieveNewFriendRequest, switchDiv } from '../utils/socialsPage';
import { getPFP } from '../utils/profile';
import { showNotif } from '../utils/messages';

import "../styles/socials.css";
import "../styles/profile.css";
import "../styles/index.css";
import "../styles/gif.css";

function SocialPage() {
  React.useEffect(() => {
    const ws = createWS();

    ws.addEventListener('open', () => {
      if (localStorage.getItem('sessionid') && localStorage.getItem('sessionid') != "undefined") {
        ws.send(JSON.stringify({ code: 4, op: 0, sid: localStorage.getItem('sessionid') }));
      } else {
        window.location.href = '/';
      }
    });

    setInterval(() => { ws.send(JSON.stringify({ code: 10 })); }, 30000);
    divs.friends = document.getElementById('friends');
    divs.connect = document.getElementById('connect');
    divs.accept = document.getElementById('accept');
    switchDiv('friends');

    ws.addEventListener('error', (err) => {
      alert('Uh oh!\nAn error occured!');
      console.error(err);
      window.location.href = '/';
    });

    ws.addEventListener('message', (message) => {
      const response = JSON.parse(message.data);
      if (response == "401") return alert('401 UNAUTHORIZED');

      switch (response.code) {
        case 0: window.location.href = '/';
          break;

        case 3:
          window.location.href = `/?dmid=${response.data.other_id}`;
          break;

        case 4:
          const FRops = [2, 3, 4];
          if (response.op == 0) {
            getPFP();
            initializeSocialLayout(ws, response);
          }
          else if (response.op == 1) recieveNewFriendRequest(ws, response);
          else if (FRops.includes(response.op)) getFriendRequestResponse(ws, response);
          else if (response.op == 5) createPendingResponseBar({ username: response.data.username, uid: response.data.uid });
          else console.log(`UNKNOWN RESPONSE ${response.op}`);
          break;

        case 5:
          showNotif(response.data.author.username, response.data.content)
          break;

        case 10: break;

        case 404:
          changeCol('red');
          break;

        default: console.log(typeof response.code, `Unknown code: ${response.code}`);
      }
    });
  }, []);

  return (
    <div>
      <div id="dms" className="sidenav">
        <a className="pageSwitchLink unselectable" href="/">HOME</a>
        <a className="pageSwitchLink unselectable" href="social" aria-disabled="true">SOCIALS</a>
      </div>
      <div className="main">
        <div className="toolbar">
          <a href="-" onClick={() => switchDiv('friends')}>Friends</a>
          <a href="-" onClick={() => switchDiv('connect')}>Add Friend</a>
        </div>
        <div id="friends">
          <div id="loadinggif" style={{textAlign: "center"}}>
            <img src="https://www.wpfaster.org/wp-content/uploads/2013/06/loading-gif.gif" width="100px" alt="" />
          </div>
        </div>

        <div id="connect">
          <input className="addfriendinp" onKeyDown={e => getAddFriendInp(e)} />
        </div>

        <div id="accept"></div>
      </div>
      <div className="userprofile"></div>
    </div>
  );
}

export default React.memo(SocialPage);