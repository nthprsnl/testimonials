/* eslint-disable no-alert */
/* global firebase */

const db = firebase.database();
let username = '';
let roomname = '';
let chat;
let userId;
let currentChatSnapshot;
const colors = ['red', 'fuchsia', 'lime', 'yellow', 'blue', 'aqua'];

const auth = firebase.auth();

const usernameInput = () => {
	username = prompt('username:');

	if (username === '') {
		alert('username cannot be empty!');
		username = usernameInput();
	}

	return username;
};

auth.signInAnonymously().then(({ user }) => {
	console.log(user);
	if (user) {
		if (!localStorage.getItem('chatUsername')) localStorage.setItem('chatUsername', usernameInput());
		username = localStorage.getItem('chatUsername');
		userId = user.uid;
		console.log('user logged in!');
		db.ref(`users/${userId}`).set({
			name: username,
			id: userId,
			color: colors[Math.floor(Math.random() * colors.length)]
		});
	}
}).catch((error) => {
	const errcode = error.code;
	const errmsg = error.msg;

	console.log(errcode, errmsg, error);
	alert('whoops! something has gone wrong. look in devtools for more info!');
});

const getFromDb = path => new Promise(res => { db.ref(path).once('value', snapshot => res(snapshot)); });

// eslint-disable-next-line no-unused-vars
const createRoom = async () => {
	if (username === '') {
		alert('set a username!');
		return username = usernameInput();
	}

	roomname = document.getElementById('roominput').value;
	if (roomname === '') return alert('room name cannot be empty!');
	const room = await getFromDb(`rooms/${roomname}`);

	if (room.exists()) return alert('room already exists!');

	// Sets room owner
	db.ref(`rooms/${roomname}`).set({ userId });
	console.log('Created room '.concat(room));
};

// eslint-disable-next-line no-unused-vars
const joinRoom = async () => {
	if (currentChatSnapshot) currentChatSnapshot.off();

	if (username === '') {
		alert('set a username!');
		return username = usernameInput();
	}

	roomname = document.getElementById('roominput').value;
	if (roomname === '') return alert('room name cannot be empty!');

	const room = await getFromDb(`rooms/${roomname}`);
	if (!room.exists()) alert('room does not exist!');

	chat = db.ref(`rooms/${roomname}/messages/`);
	document.getElementById('display-messages').innerHTML = `
    <li class='system'>[SYSTEM]: Welcome to ${roomname}!</li>
    <li class="system">[SYSTEM]: Please be nice and treat others how you want to be treated</li>
    <li class="system">[SYSTEM]: Join on 'main' for the main chatroom!</li>
    <li class="system">[SYSTEM]: Everything here is unmoderated, so be careful!</li>
  `;

	console.log(`Joined room ${roomname}`);

	chat.on('child_added', messageSnapshot => {
		const message = messageSnapshot.val();
		const messageHtml = `<li><abbr title="${message.userId}" style="color: ${message.color};">[${message.username}]</abbr>: ${message.message}</li>`;
		document.getElementById('display-messages').innerHTML += messageHtml;

		document
			.getElementById('display-messages')
			.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
	});

	currentChatSnapshot = chat;
};

/* eslint-disable no-unused-vars */
const sendMessage = async () => {
	const messageinput = document.getElementById('messageinput');
	const message = messageinput.value;

	const room = await getFromDb(`rooms/${roomname}`);
	if (!room.exists()) return alert('room does not exist!');
	const user = await getFromDb(`users/${userId}`);

	db.ref(`rooms/${roomname}/messages/${Date.now()}`).set({
		username,
		message,
		userId,
		color: user.val().color
	});

	messageinput.value = '';
};

// nthprsnl, 2023
// celestial, 2023
