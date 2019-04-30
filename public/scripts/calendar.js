// initialize Firebase
initFirebaseAuth();

// initialise calendar
initCalendar();

// Initialise variables
var signOutElement = document.getElementById('signOut');

var eventList = new Array();

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
    // load event data
    loadEventData();
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

function getUserId() {
  return firebase.auth().currentUser.uid;
}

function loadEventData() {

  // Create the reference to load
  var linkedPatientsRef = firebase.database().ref('doctors/' + getUserId() + '/linkedPatients');

  // Load previous data and start listening for new data.
  var loadPatientEvents = function (data) {
    var patient = data.val();
    var patientId = patient.patientId;

    // Create the reference to load the patient
    var patientRef = firebase.database().ref('patients/' + patientId + '/events');

    // Load previous data and start listening for new data.
    var getData = function (snapshot) {
      var event = snapshot.val();
      var title = event.title;
      var eventType = event.eventType;
      var startDate = event.startDateTime;
      var endDate = event.endDateTime;
      var location = event.location;
      var description = event.description;
      eventList.push([title, eventType, startDate, endDate, location, description]);
    };
    patientRef.on('child_added', getData);
    patientRef.on('child_changed', getData);
  }
  linkedPatientsRef.on('child_added', loadPatientEvents);
  linkedPatientsRef.on('child_changed', loadPatientEvents);
}

function initCalendar() {
  var delayInMilliseconds = 3000;

  var events = new Array();

  setTimeout(function () {
    // your code to be executed after x seconds
    for (i = 0; i < eventList.length; i++) {
      var startDate = new Date(eventList[i][2]);
      events[i] = {
        title: eventList[i][0],
        start: startDate,
      };
    }
    renderCalendar(events);
  }, delayInMilliseconds);
}

function renderCalendar(fbEvents) {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: ['interaction', 'dayGrid'],
    //defaultDate: '2019-04-12',
    selectable: true,
    eventLimit: true, // allow "more" link when too many events
    events: fbEvents,
    eventColor: '#9C27B0'
  });

  calendar.render();
}