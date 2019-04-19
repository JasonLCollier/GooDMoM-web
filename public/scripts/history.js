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
        nameElement.textContent = name;
    });
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
  function openDashboard() {
    if (dashboardRBElement.checked == true) {
        localStorage.setItem("patientId", getPatientId());
        window.open("../dashboard.html", "_self");
    } else {
  
    }
  }