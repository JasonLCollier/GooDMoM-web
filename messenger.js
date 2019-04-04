window.alert("Messenger!");

var text = document.getElementById("text");
var button = document.getElementById("button");

function buttonClick() {
    window.alert("Clicked!");
    var firebaseRef = firebase.database().ref();
    firebaseRef.child("Test").set("value");
}