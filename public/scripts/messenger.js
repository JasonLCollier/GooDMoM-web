// initialize Firebase
initFirebaseAuth();

// Load currently existing chat messages and listen to new ones.
loadMessages();

// Load patient data
loadPatientData();

// Shortcuts to DOM Elements.
var signOutElement = document.getElementById('signOut');
var messageListElement = document.getElementById('messages');
var messageFormElement = document.getElementById('message-form');
var messageInputElement = document.getElementById('messageInput');
var nameElement = document.getElementById('patientName');
var detailsRBElement = document.getElementById('detailsRB');
var historyRBElement = document.getElementById('historyRB');
var dashboardRBElement = document.getElementById('dashboardRB');

//Sign out click listener
signOutElement.addEventListener('click', signOut);

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
    console.log("User signed in");
  } else { // User is signed out
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
  return firebase.auth().currentUser.displayName;
}

function getPatientId() {
  var id = localStorage.getItem("patientId");
  return id;
}

// Triggered when the send new message form is submitted.
function onMessageFormSubmit() {
  // Check that the user entered a message and is signed in.
  if (messageInputElement.value && userSignedIn()) {
    saveMessage(messageInputElement.value).then(function () {
      // Clear message text field
      resetMaterialTextfield(messageInputElement);
    });
  }
}

// Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
  element.value = '';
}

// Saves a new message on the Realtime Database.
function saveMessage(messageText) {
  var displayName = getUserName();
  // Add a new message entry to the Firebase database.
  return firebase.database().ref('patients/' + getPatientId() + '/messages').push({
    name: displayName,
    text: messageText
  }).catch(function (error) {
    console.error('Error writing new message to Firebase Database', error);
  });
}

// Loads chat messages history and listens for upcoming ones.
function loadMessages() {
  // Create the reference to load the messages and listen for new ones.
  var messagesRef = firebase.database().ref('patients/' + getPatientId() + '/messages');

  // Make sure to remove all previous listeners.
  messagesRef.off();

  // Load previous messages and start listening for new ones.
  var setMessage = function (data) {
    var message = data.val();
    displayMessage(data.key, message.name, message.text);
  };
  messagesRef.on('child_added', setMessage);
  messagesRef.on('child_changed', setMessage);

}

// Template for messages.
var MESSAGE_TEMPLATE =
  '<div class="message-container">' +
  '<div class="spacing"></div>' +
  '<div class="message"></div>' +
  '<div class="name"></div>' +
  '</div>';

// Displays a Message in the UI.
function displayMessage(id, name, text) {
  var div = document.getElementById(id);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', id);
    messageListElement.appendChild(div);
  }
  div.querySelector('.name').textContent = name;

  var messageElement = div.querySelector('.message');
  if (text) { // If the message has text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  }

  // Show the card fading-in and scroll to view the new message.
  setTimeout(function () {
    div.classList.add('visible')
  }, 1);
  messageListElement.scrollTop = messageListElement.scrollHeight;
  messageInputElement.focus();
}

function loadPatientData() {
  var patientsRef = firebase.database().ref('patients/' + getPatientId() + '/userData');
  patientsRef.on("value", function (snapshot) {
      var userData = snapshot.val();
      var name = userData.name;
      nameElement.textContent = name;
  });
}

// Radio button to open details
function openDetails() {
  if (detailsRBElement.checked == true) {
      console.log("Details checked");
  } else {

  }
}

// Radio button to open history
function openHistory() {
  if (historyRBElement.checked == true) {
    console.log("History checked");
  } else {

  }
}

// Radio button to open dashboard
function openDashboard() {
  if (dashboardRBElement.checked == true) {
    console.log("Dashboard checked");
  } else {

  }
}