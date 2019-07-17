// initialize Firebase
initFirebaseAuth();

// initialise calendar
initCalendar();

// Shortcuts to DOM Elements.
var signOutElement = document.getElementById('signOut');
var addEventElement = document.getElementById('addEvent');
var eventTitleElement = document.getElementById('eventTitle');
var dateElement = document.getElementById('date');
var startTimeElement = document.getElementById('startTime');
var endTimeElement = document.getElementById('endTime');
var locationElement = document.getElementById('location');
var patientSelectElement = document.getElementById('patientSelect');

// Initialise variables
var eventList = new Array();
var patientList = new Array();
addEventElement.style.display = "none";
var calendar = null;

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
    // load data
    loadEventData();
    loadPatientData();
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
    // Create the reference to load the patient
    var patient = data.val();
    var patientId = patient.patientId;
    var patientRef = firebase.database().ref('patients/' + patientId);

    // variable to hold patient's name
    var patientName = "Patient";

    // Load patient name
    var setName = function (data) {
      var userData = data.val();
      patientName = userData.name;
    };
    patientRef.child('userData').on("value", setName);

    // Load previous event data and start listening for new data.
    var getData = function (snapshot) {
      var event = snapshot.val();
      var title = event.title;
      var eventType = event.eventType;
      var startDate = event.startDateTime;
      var endDate = event.endDateTime;
      var location = event.location;
      var description = event.description;
      eventList.push([title, eventType, startDate, endDate, location, description, patientName]);
    };
    patientRef.child('events').on('child_added', getData);
    patientRef.child('events').on('child_changed', getData);
  }
  linkedPatientsRef.on('child_added', loadPatientEvents);
  linkedPatientsRef.on('child_changed', loadPatientEvents);
}

function loadPatientData() {
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
          // patient list with name and id
          patientList.push([data.key, name]);
          var option = document.createElement("option");
          option.text = name;
          patientSelectElement.add(option);
        }
      });
    });
  });
}

function initCalendar() {
  var delayInMilliseconds = 3000;
  setTimeout(function () {
    // your code to be executed after x seconds
    renderCalendar(populateEvents());
  }, delayInMilliseconds);
}

function populateEvents() {
  var events = new Array();
  var count = 0;
  for (i = 0; i < eventList.length; i++) {
    if (eventList[i][1] == 0) {
      var startDate = new Date(eventList[i][2]);
      var endDate = new Date(eventList[i][3]);
      events[count] = {
        title: eventList[i][0] + " (" + eventList[i][6] + ")",
        start: startDate,
        end: endDate,
      };
      count++;
    }
  }
  return events;
}

function renderCalendar(fbEvents) {
  var calendarEl = document.getElementById('calendar');

  calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: ['interaction', 'dayGrid'],
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'addEventButton'
    },
    selectable: true,
    eventLimit: true, // allow "more" link when too many events
    events: fbEvents,
    eventColor: '#9C27B0',
    firstDay: 1,
    eventClick: function (info) {
      alert('Event: ' + info.event.title + '\nTime: ' + info.event.start);
    },
    eventMouseEnter: function (info) {
      document.body.style.cursor = "pointer";
    },
    eventMouseLeave: function (info) {
      document.body.style.cursor = "default";
    },
    /*eventRender: function(info) {
    var tooltip = new Tooltip(info.el, {
      title: info.event.extendedProps.description,
      placement: 'top',
      trigger: 'hover',
      container: 'body'
    });
  }*/
    customButtons: {
      addEventButton: {
        text: 'Add new event',
        click: function () {
          addEventElement.style.display = "block";
        }
      }
    },
  });

  calendar.render();
}

function saveInput() {
  // Add the "show" class to DIV
  snackbar.className = "show";
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
  // Get patient ID
  var patientIdForList = patientList[patientSelectElement.selectedIndex][0];
  // Get date
  var startDate = new Date(dateElement.value + " " + startTimeElement.value);
  var startDateMillis = startDate.valueOf();
  var endDate = new Date(dateElement.value + " " + endTimeElement.value);
  var endDateMillis = endDate.valueOf();
  // Add a new data entry to the Firebase database.
  firebase.database().ref('patients/' + patientIdForList + '/events').push({
    description: "",
    endDateTime: endDateMillis,
    eventType: 0,
    location: locationElement.value,
    startDateTime: startDateMillis,
    title: eventTitleElement.value
  }).catch(function (error) {
    console.error('Error writing new message to Firebase Database', error);
  });
  // Hide dialog
  addEventElement.style.display = "none";
  // Reload calendar
  calendar.destroy();
  initCalendar();
}

function cancelInput() {
  addEventElement.style.display = "none";
}