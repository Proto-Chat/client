const newMsg = "https://github.com/ION606/chatJS/raw/main/client/assets/audio/notifications/msg.mp3";
const friendRequest = "https://github.com/ION606/chatJS/raw/main/client/assets/audio/notifications/friend-request.mp3";

type NotificationType = "msg" | "friendrequest";

export function playNotification(type: NotificationType) {
	let notificationSound: HTMLAudioElement;

	switch (type) {
		case "msg":
			notificationSound = new Audio(newMsg);
			notificationSound.play();
		break;

		case "friendrequest":
			notificationSound = new Audio(friendRequest);
			notificationSound.play();
		break;

		default: 
	}
}