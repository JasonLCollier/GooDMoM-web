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
var dobElement = document.getElementById('dob');
var heightElement = document.getElementById('height');
var weightElement = document.getElementById('weight');
var bmiElement = document.getElementById('bmi');
var diabetesElement = document.getElementById('diabetes');
var dueDateElement = document.getElementById('dueDate');
var glucMinElement = document.getElementById('glucMin');
var glucMaxElement = document.getElementById('glucMax');
var weightMinElement = document.getElementById('weightMin');
var weightMaxElement = document.getElementById('weightMax');
var actGoalElement = document.getElementById('actGoal');
var carbsGoalElement = document.getElementById('carbsGoal');
var medicationElement = document.getElementById('medication');
var commentElement = document.getElementById('comment');
var snackbar = document.getElementById("snackbar");

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
    var weight = userData.prePregWeight;
    var bmi = weight / ((height / 100) * (height / 100));
    var diabetes = userData.diabetesType;
    var dueDate = userData.dueDate;
    nameElement.textContent = name;
    fullNameElement.textContent = name;
    idElement.textContent = id;
    phoneElement.textContent = phone;
    emailElement.textContent = email;
    addressElement.textContent = address;
    dobElement.textContent = new Date(id.substring(0,2), id.substring(2,4) - 1, id.substring(4,6));
    heightElement.textContent = height + " cm";
    weightElement.textContent = weight + " Kg"
    bmiElement.textContent = bmi + " Kg/m2"
    diabetesElement.textContent = diabetes;
    dueDateElement.textContent = new Date(dueDate);
  });

  var rangesRef = patientsRef.child('ranges');
  rangesRef.on("value", function (snapshot) {
    var ranges = snapshot.val();
    var glucMin = ranges.glucMin;
    var glucMax = ranges.glucMax;
    var weightMin = ranges.weightMin;
    var weightMax = ranges.weightMax;
    var actGoal = ranges.actGoal;
    var carbsGoal = ranges.carbsGoal;
    var medication = ranges.medication;
    var comment = ranges.comment;

    glucMinElement.value = glucMin;
    glucMaxElement.value = glucMax;
    weightMinElement.value = weightMin;
    weightMaxElement.value = weightMax;
    actGoalElement.value = actGoal;
    carbsGoalElement.value = carbsGoal;
    medicationElement.value = medication;
    commentElement.value = comment;
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
  // Add the "show" class to DIV
  snackbar.className = "show";
  setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
  // Add a new data entry to the Firebase database.
  return firebase.database().ref('patients/' + getPatientId() + '/userData/ranges').set({
    glucMin: glucMinElement.value,
    glucMax: glucMaxElement.value,
    weightMin: weightMinElement.value,
    weightMax: weightMaxElement.value,
    actGoal: actGoalElement.value,
    carbsGoal: carbsGoalElement.value,
    medication: medicationElement.value,
    comment: commentElement.value
  }).catch(function (error) {
    console.error('Error writing new message to Firebase Database', error);
  });
}