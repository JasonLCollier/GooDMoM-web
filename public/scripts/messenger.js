initFirebaseAuth();

// Shortcuts to DOM Elements.
var signOutElement = document.getElementById('signOut');
var messageListElement = document.getElementById('messages');
var messageFormElement = document.getElementById('message-form');
var messageInputElement = document.getElementById('message');

//Sign out click listener
signOutElement.addEventListener('click', signOut)

// Saves message on form submit.
messageFormElement.addEventListener('submit', onMessageFormSubmit);

// Initiate firebase auth.
function initFirebaseAuth() {
    // Listen to auth state changes.
    firebase.auth().onAuthStateChanged(authStateObserver);
  }

  // Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
    if (user) { // User is signed in
        var displayName = getUserName();
    }
    else { // User is signed out
        window.open('../index.html', "_self");
    }
}

function signOut() {
    window.open('../index.html', "_self");
    firebase.auth().signOut();
}

// Returns true if a user is signed-in.
function userSignedIn() {
    return !!firebase.auth().currentUser;
  }
      

function getUserName() {
    return "Dr. " + firebase.auth().currentUser.displayName;
  }

  function getUserId() {
    //return firebase.auth().currentUser.uid;
    return "EJ8ILGCXhthq8Oy556ZGTyzH5Wl1";
  }

  // Triggered when the send new message form is submitted.
function onMessageFormSubmit() {
    // Check that the user entered a message and is signed in.
    if (messageInputElement.value && userSignedIn()) {
      saveMessage(messageInputElement.value);
    }
  }

// Saves a new message on the Realtime Database.
function saveMessage(messageText) {
    var displayName = getUserName();
    // Add a new message entry to the Firebase database.
    return firebase.database().ref(getUserId() + '/messages').push({
        name: displayName,
        text: messageText,
    }).catch(function (error) {
        console.error('Error writing new message to Firebase Database', error);
    });
}
  