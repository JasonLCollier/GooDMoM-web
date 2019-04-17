// initialize Firebase
initFirebaseAuth();

// load patient data
loadPatientData();

// Shortcuts to DOM Elements.
var signOutElement = document.getElementById('signOut');
var nameElement = document.getElementById('patientName');

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
        console.log(getPatientId() + " profile");
    } else { // User is signed out
        window.open('../index.html', "_self");
    }
}

function signOut() {
    window.open('../index.html', "_self");
    firebase.auth().signOut();
}

function getUserId() {
    return firebase.auth().currentUser.uid;
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

// Messenger button to open messenger
// Pass patient id as local variable