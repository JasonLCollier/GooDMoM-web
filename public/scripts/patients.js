// initialize Firebase
initFirebaseAuth();

// Shortcuts to DOM Elements.
var signOutElement = document.getElementById('signOut');
var patientListElement = document.getElementById('patients');

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
        // List all users
        loadPatients();
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
    // Read all patients
    var patientsRef = firebase.database().ref('patients');
    patientsRef.on("value", function (snapshot) {
        // For each patient
        snapshot.forEach(function (data) {
            // Read the patients user data
            var ref = patientsRef.child(data.key + "/userData")
            ref.once("value", function (snap) {
                var userData = snap.val();
                var hpNumber = userData.hpNumber;
                var name = userData.name;
                // Display the patient if the patient is linked to signed in doctor
                if (hpNumber == getUserId()) {
                    displayPatient(data.key, name);
                }
            });
        });
    });
}

var PATIENT_TEMPLATE =
    '<div class="patient-container">' +
    '<img class="dp" src="images/user.png" alt="Display Picture" height="96dp" width="96dp"></img>' +
    '<div class="name"></div>' +
    '</div>';

function displayPatient(id, name) {
    var div = document.getElementById(id);
    // If an element for that message does not exists yet we create it.
    if (!div) {
        var container = document.createElement('div');
        container.innerHTML = PATIENT_TEMPLATE;
        div = container.firstChild;
        div.setAttribute('id', id);
        patientListElement.appendChild(div);
    }
    div.querySelector('.name').textContent = name;

    // Set on click listener for patient
    div.addEventListener('click', function(){
        patientClick(id);
    });
}

function addPatient() {
    firebase.database().ref('doctors/' + getUserId() + '/linkedPatients').push({
        patientId: ""
    });
}

function patientClick(id) {
    window.open('../patientData.html', "_self");
}