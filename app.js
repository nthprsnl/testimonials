const db = firebase.database();
var username = "", room = "", chat, pid;

const auth = firebase.auth();

function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)]
}

function usernameInput() {
    username = prompt("username:")
    if (username == "") {alert('username cannot be empty!'); usernameInput();} else {return username}
}
auth.signInAnonymously().catch((error) => {
    var errcode = error.code;
    var errmsg = error.msg;

    console.log(errcode, errmsg, error);
    alert('whoops! something has gone wrong')
})

colors = ["red", "fuchsia", "lime", "yellow", "blue", "aqua"]

auth.onAuthStateChanged((user) => {
    console.log(user)
    if (user) {
        if (localStorage.getItem('CHTUSR') == undefined) {localStorage.setItem('CHTUSR', usernameInput())}
        username = localStorage.getItem('CHTUSR')
        pid = user.uid
        console.log('user logged in!')
        db.ref("users/" + pid).set({
            "name": username,
            "id": pid,
            "color": randomFromArray(colors)
        })
    }
})

function createRoom() {
    if (username == "") {alert('set a username!'); return username = usernameInput()}
    room = document.getElementById('roominput').value;
    if (room == "") {alert('room name cannot be empty!'); return}
    db.ref("rooms/" + room).once("value", snapshot => {
        if(snapshot.exists()) {
            alert('room already exists!') ;
            return true;
        }

        db.ref("rooms/" + room).set({
            pid, // this sets owner
        });
        console.log("Created room ".concat(room))

    });
};

function joinRoom() {
    if (username == "" | typeof username == undefined) {alert('set a username!'); return username = usernameInput()}
    room = document.getElementById('roominput').value;
    if (room == "") {alert('room name cannot be empty!'); return}
    db.ref("rooms/" + room).once("value", snapshot => {
        if(snapshot.exists()) {
            chat = db.ref("rooms/" + room + "/messages/")
        document.getElementById("display-messages").innerHTML = `
            <li class='system'>[SYSTEM]: Welcome to ${room}!</li>
            <li class="system">[SYSTEM]: Please be nice and treat others how you want to be treated</li>
            <li class="system">[SYSTEM]: Join on 'main' for the main chatroom!</li>
            <li class="system">[SYSTEM]: Everything here is unmoderated, so be careful!</li>
        `
        
            console.log("Joined room ".concat(room))
            chat.on("child_added", function (snapshot) {
                const messages = snapshot.val();
                const message = `<li><abbr title="${messages.pid}" style="color: ${messages.color};">[${messages.username}]</abbr>: ${messages.message}</li>`;
                // append the message on the page
                document.getElementById("display-messages").innerHTML += message;
            });
            return chat;
        }

        alert('room does not exist!');
    });
    
};

function sendMessage() {

    var message, messageinput, timestamp;
    timestamp = Date.now();
    messageinput =  document.getElementById("messageinput");
    message = messageinput.value;
    
    document
    .getElementById("display-messages")
    .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

    db.ref("rooms/" + room).once("value", snapshot => {
        if(snapshot.exists()) {
            db.ref("users/" + pid).once("value", snapshot => {
                db.ref("rooms/" + room + "/messages/" + timestamp).set({
                    username,
                    message,
                    pid,
                    "color": snapshot.val().color
                })
            })
            messageinput.value = ""
            return;
        }

        alert('room does not exist!');
    });
}
// nthprsnl, 2023