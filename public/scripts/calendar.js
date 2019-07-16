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
    patientRef.child("userData").on("value", setName);

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

function initCalendar() {
  var delayInMilliseconds = 3000;

  var events = new Array();

  setTimeout(function () {
    // your code to be executed after x seconds
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
    renderCalendar(events);
  }, delayInMilliseconds);
}

function renderCalendar(fbEvents) {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
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
          var dateStr = prompt('Enter date in YYYY-MM-DD format');
          var date = new Date(dateStr);

          if (date.isValid()) {
            // Add to firebase
            // refresh calendar
          } else {
            alert('Invalid Date');
          }
        }
      }
    },
  });

  calendar.render();
}