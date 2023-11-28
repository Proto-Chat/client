import { ws } from "./socket";

/**
 * Get the user's ID from their session.
 * @param sid The session ID.
 * @returns The user ID.
 */
export function getUidFromSid(sid: string): string {
  return atob(sid.split("?")[1]);
}

/**
 * Attempt to open a DM with another user.
 * @param uid The user to request DM to.
 */
export function requestDM(uid: string): void {
  ws.send(JSON.stringify({
    sid: localStorage.getItem('sessionid'),
    code: 3,
    op: 0,
    uid: uid,
  }));
}

/**
 * Produces a completely random color.
 * @returns A color.
 */
export function randomColor(): string {
  return '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).slice(1);
}

/** @type {number} */
export const loadingAnimInterval = setInterval(() => {
  if (!document.getElementById('loadingdiv')) {
    clearInterval(loadingAnimInterval);
    return;
  }

  const loading = document.getElementById('loadingdiv');
  if (loading == null) return;

  const element = loading.firstElementChild;
  if (element == null || !(element instanceof HTMLElement)) return;
  element.style.color = randomColor();
}, 1000);