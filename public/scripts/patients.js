// initialize Firebase
initFirebaseAuth();

// List all users
loadPatients();

// Shortcuts to DOM Elements.
var signOutElement = document.getElementById('signOut');

//Sign out click listener
signOutElement.addEventListener('click', signOut)

// Initiate firebase auth.
function initFirebaseAuth() {
    // Listen to auth state changes.
    firebase.auth().onAuthStateChanged(authStateObserver);
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
    if (user) { // User is signed in
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

function loadPatients() {
    var patientsRef = firebase.database().ref('patients');
    patientsRef.orderByValue().on("value", function (snapshot) {
        snapshot.forEach(function (data) {
            var hpNumber = data.child('userData').hpNumber;
            if (hpNumber == getUserId())
                console.log(data.key);
        });
    });
}