// import React, { useContext } from 'react';

export const APIS = 'localhost:1234';
export const API = 'http://localhost:1234';

function createWSPath() {
  const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
  var echoSocketUrl = socketProtocol + `//${APIS}`;
  echoSocketUrl += '/websocket';
  return echoSocketUrl;
}

export let ws = new WebSocket(createWSPath());

export function createWS() {
  ws = new WebSocket(createWSPath());
  return ws;
}

// export const socket = Object.freeze({
//   ws,
//   catch(code: number | null, op: number | null, type: number | null, handler: (data: any) => void) {
//     const then = (message: MessageEvent) => {
//       const { code: _code, op: _op, type: _type, data } = JSON.parse(message.data);
//       if ((code ?? _code) !== _code || (op ?? _op) !== _op || (type ?? _type) !== _type) return;
//       handler({ code: _code, op: _op, data });
//     }

//     ws.addEventListener('message', then);
//     return () => ws.removeEventListener('message', then);
//   },
//   send(code: number, op: number | null, type: number | null, data?: any) {
//     console.log("Send to Server:", { code, op, type, data });
//     ws.send(JSON.stringify({ code, op, type, data }));
//   }
// });

// const Socket = React.createContext(socket);

// window.addEventListener('load', () => {
//   ws.addEventListener('error', err => {
//     console.log(`WebSocket Error: ${err}`)
//     alert('Uh oh!\nAn error occured!');
//     window.location.href = '/';
//   });

//   ws.addEventListener('close', () => {
//     console.log(`WebSocket Closed!`);
//   });

//   ws.addEventListener('open', () => {
//     console.log(`WebSocket Opened!`);
//   })

//   const timer = setInterval(() => {
//     ws.send(JSON.stringify({ code: 10 }));
//   }, 30000);

//   ws.addEventListener('message', message => {
//     console.log("Receive from Server:", JSON.parse(message.data));
//   })

//   return () => clearInterval(timer);
// });

// interface SocketerProps {
//   children: React.ReactNode
// }

// export function Socketer(props: SocketerProps) {
//   const { children } = props;
//   return <Socket.Provider value={socket}>{children}</Socket.Provider>;
// }

// export function useSocket() {
//   return useContext(Socket);
// }

// export function useSocketMessage(code: number | null, op: number | null, type: number | null, handler: (data: any) => void) {
//   const socket = useSocket();
  
//   React.useEffect(() => {
//     return socket.catch(code, op, type, handler);
//   }, [code, op, type, handler, socket]);
// }