// initialize Firebase
initFirebaseAuth();

// Load patient data
loadPatientData();

// Shortcuts to DOM Elements.
var signOutElement = document.getElementById('signOut');
var nameElement = document.getElementById('patientName');
var messengerRBElement = document.getElementById('messengerRB');
var detailsRBElement = document.getElementById('detailsRB');
var historyRBElement = document.getElementById('historyRB');
var dashboardRBElement = document.getElementById('dashboardRB');

var fullNameElement = document.getElementById('name');
var idElement = document.getElementById('id');
var phoneElement = document.getElementById('phone');
var emailElement = document.getElementById('email');
var addressElement = document.getElementById('address');
var heightElement = document.getElementById('height');
var dueDateElement = document.getElementById('dueDate');
var glucRangeElement = document.getElementById('glucoseRange');
var weightRangeElement = document.getElementById('weightRange');
var glucMinElement = doument.getElementById('glucMin');
var glucMaxElement = doument.getElementById('glucMax');
var weightMinElement = doument.getElementById('weightMin');
var weightMaxElement = doument.getElementById('weightMax');

//Sign out click listener
signOutElement.addEventListener('click', signOut);

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

function loadPatientData() {
  var patientsRef = firebase.database().ref('patients/' + getPatientId() + '/userData');
  patientsRef.on("value", function (snapshot) {
    var userData = snapshot.val();
    var name = userData.name;
    var id = userData.id;
    var phone = userData.phone;
    var email = userData.email;
    var address = userData.address;
    var height = userData.height;
    var dueDate = userData.dueDate;
    var glucMin = userData.glucMin;
    var glucMax = userData.glucMax;
    var weightMin = userData.weightMin;
    var weightMax = userData.weightMax;
    nameElement.textContent = name;
    fullNameElement.textContent = name;
    idElement.textContent = id;
    phoneElement.textContent = phone;
    emailElement.textContent = email;
    addressElement.textContent = address;
    heightElement.textContent = height + " cm";
    dueDateElement.textContent = new Date(dueDate);
    glucMinElement.value = glucMin;
    glucMaxElement.value = glucMax;
    weightMinElement.value = weightMin;
    weightMaxElement.value = weightMax;
  });
}

// Radio button to messenger
function openMessenger() {
  if (messengerRBElement.checked == true) {
    localStorage.setItem("patientId", getPatientId());
    window.open("../messenger.html", "_self");
  } else {

  }
}

// Radio button to open history
function openHistory() {
  if (historyRBElement.checked == true) {
    localStorage.setItem("patientId", getPatientId());
    window.open("../history.html", "_self");
  } else {

  }
}

// Radio button to open dashboard
function openDashboard() {
  if (dashboardRBElement.checked == true) {
    localStorage.setItem("patientId", getPatientId());
    window.open("../dashboard.html", "_self");
  } else {

  }
}

function saveInput() {
  // Add a new data entry to the Firebase database.
  return firebase.database().ref('patients/' + getPatientId() + '/userData/ranges').set({
    glucMin: "3.5",
    glucMax: "5",
    weightMin: "50",
    weightMax: "55"
  }).catch(function (error) {
    console.error('Error writing new message to Firebase Database', error);
  });
}