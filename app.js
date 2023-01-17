const db = firebase.database();
var username = "", room = "", chat, pid;

const auth = firebase.auth();

auth.signInAnonymously().catch((error) => {
    var errcode = error.code;
    var errmsg = error.msg;

    console.log(errcode, errmsg, error);
    alert('whoops! something has gone wrong')
})

auth.onAuthStateChanged((user) => {
    console.log(user)
    if (user) {
        username = prompt("username:")
        if (username == "") {alert('username cannot be empty!'); return}
        pid = user.uid
        console.log('user logged in!')
        db.ref("users/" + pid).set({
            "name": username,
            "id": pid
        })
    }
})

function createRoom() {
    if (username == "") {alert('set a username!'); return}
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
    if (username == "" | typeof username == undefined) {alert('set a username!'); return}
    room = document.getElementById('roominput').value;
    if (room == "") {alert('room name cannot be empty!'); return}
    db.ref("rooms/" + room).once("value", snapshot => {
        if(snapshot.exists()) {
            chat = db.ref("rooms/" + room + "/messages/")
            console.log("Joined room ".concat(room))

            chat.on("child_added", function (snapshot) {
                const messages = snapshot.val();
                const message = `<li><span>${messages.username}: </span>${messages.message}</li>`;
                // append the message on the page
                document.getElementById("display-messages").innerHTML += message;
            });
            return chat;
        }

        alert('room does not exist!');
    });
};

function sendMessage() {

    var message, timestamp;
    timestamp = Date.now();
    message =  document.getElementById("messageinput").value;

    document
    .getElementById("display-messages")
    .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

    db.ref("rooms/" + room).once("value", snapshot => {
        if(snapshot.exists()) {
            db.ref("rooms/" + room + "/messages/" + timestamp).set({
                username,
                message
            })
            return chat;
        }

        alert('room does not exist!');
    });
    message = "";
}
// nthprsnl, 2023