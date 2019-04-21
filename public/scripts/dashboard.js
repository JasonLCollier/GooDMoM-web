// initialize Firebase
initFirebaseAuth();

// Load patient data
loadPatientData();

// Shortcuts to DOM Elements.
var glucoseList = new Array();
var signOutElement = document.getElementById('signOut');
var nameElement = document.getElementById('patientName');
var messengerRBElement = document.getElementById('messengerRB');
var detailsRBElement = document.getElementById('detailsRB');
var historyRBElement = document.getElementById('historyRB');
var dashboardRBElement = document.getElementById('dashboardRB');

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
  // Create the reference to load the patient
  var patientRef = firebase.database().ref('patients/' + getPatientId());

  // Make sure to remove all previous listeners.
  patientRef.off();

  // Load previous data and start listening for new data.
  var setData = function (data) {
    var gdData = data.val();
    var glucose = gdData.glucose;
    glucoseList.push(glucose);
  };
  patientRef.child("gdData").on('child_added', setData);
  patientRef.child("gdData").on('child_changed', setData);
  

// Load patient name
var setName = function (data) {
  var userData = data.val();
  var name = userData.name;
  nameElement.textContent = name;
};

  patientRef.child("userData").on("value", setName);
}

// Radio button to open messenger
function openMessenger() {
  if (messengerRBElement.checked == true) {
    localStorage.setItem("patientId", getPatientId());
    window.open("../messenger.html", "_self");
  } else {

  }
}

// Radio button to open details
function openDetails() {
  if (detailsRBElement.checked == true) {
    localStorage.setItem("patientId", getPatientId());
    window.open("../details.html", "_self");
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

// Load the Visualization API and the corechart package.
google.charts.load('current', {
  'packages': ['corechart']
});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {

  // Create the data table.
  var data = google.visualization.arrayToDataTable([
    ['Day', 'Glucose'],
    ['5',  5.5],
    ['10',  5.1],
    ['15',  4.9],
    ['20',  6.3],
    ['25',  7.0],
    ['30',  5.0]
  ]);

  // Set chart options
  var options = {
    title: 'Glucose',
    curveType: 'function',
    legend: { position: 'bottom' }
  };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.LineChart(document.getElementById('chart-div'));
  chart.draw(data, options);
}