import { ws } from "./socket";

export const getUidFromSid = (sid) => atob(sid.split("?")[1], 'base64');

export function requestDM(uid) {
  ws.send(JSON.stringify({ sid: localStorage.getItem('sessionid'), code: 3, op: 0, uid: uid }));
}

export const loadingAnimInterval = setInterval(() => {
  if (!document.getElementById('loadingdiv')) {
    clearInterval(loadingAnimInterval);
    return;
  }
  const element = document.getElementById('loadingdiv').firstElementChild;
  element.style.color = '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
}, 1000);