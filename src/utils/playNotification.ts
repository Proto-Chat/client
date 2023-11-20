const newMsg = "https://github.com/ION606/chatJS/raw/main/client/assets/audio/notifications/msg.mp3";
const friendRequest = "https://github.com/ION606/chatJS/raw/main/client/assets/audio/notifications/friend-request.mp3";

type NotificationType = "msg" | "friendrequest";

/**
 * Play a notification sound.
 * @param type The type of notification.
 */
export function playNotification(type: NotificationType): void {
	let file;

	switch (type) {
		case "msg": file = newMsg; break;
		case "friendrequest": file = friendRequest; break;
		default: file = ""; break;
	}

	const audio = new Audio(file);
	audio.play();
}