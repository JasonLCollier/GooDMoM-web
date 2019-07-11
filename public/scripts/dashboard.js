// Shortcuts to DOM Elements.
var signOutElement = document.getElementById('signOut');
var nameElement = document.getElementById('patientName');
var messengerRBElement = document.getElementById('messengerRB');
var detailsRBElement = document.getElementById('detailsRB');
var historyRBElement = document.getElementById('historyRB');
var dashboardRBElement = document.getElementById('dashboardRB');
var periodElement = document.querySelector('#period');
var monthElement = document.querySelector('#months');
var dayElement = document.querySelector('#daysOfMonth');

var avgGlucElement = document.getElementById('avgGluc');
var maxGlucElement = document.getElementById('maxGluc');
var minGlucElement = document.getElementById('minGluc');
var totCarbsElement = document.getElementById('totCarbs');
var maxCarbsElement = document.getElementById('maxCarbs');
var minCarbsElement = document.getElementById('minCarbs');
var totActTimeElement = document.getElementById('totActTime');
var maxActTimeElement = document.getElementById('maxActTime');
var minActTimeElement = document.getElementById('minActTime');
var avgWeightElement = document.getElementById('avgWeight');
var maxWeightElement = document.getElementById('maxWeight');
var minWeightElement = document.getElementById('minWeight');
var avgSystolicElement = document.getElementById('avgSystolic');
var maxSystolicElement = document.getElementById('maxSystolic');
var minSystolicElement = document.getElementById('minSystolic');

// Initialise variables
var curDate = new Date();
var curYear = curDate.getFullYear();
var curMonth = curDate.getMonth();
var curDay = curDate.getDate();

var gdDataList = new Array();
var startDate = new Date(curYear, curMonth, 1, 0, 0, 0, 0);
var endDate = new Date(curYear, curMonth + 1, 1, 0, 0, 0, 0);

// initialize Firebase
initFirebaseAuth();

// Get chart filters
initialiseFilters();

// Load patient data
loadPatientData();

// Load charts library
loadChartsLibrary()

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

  // Load patient name
  var setName = function (data) {
    var userData = data.val();
    var name = userData.name;
    nameElement.textContent = name;
  };
  patientRef.child("userData").on("value", setName);

  // Load previous data and start listening for new data.
  var setData = function (data) {
    var gdData = data.val();
    var time = gdData.dateTime;
    var glucoseTime = gdData.glucoseTime;
    var location = gdData.location;
    var glucose = gdData.glucose;
    var carbs = gdData.carbs;
    var exercise = gdData.activityTime;
    var weight = gdData.weight;
    var bp = gdData.bloodPressure;
    var medication = gdData.medication;
    var symptoms = gdData.symptoms;
    gdDataList.push([new Date(time), glucose, carbs, exercise, weight, bp, medication, symptoms, glucoseTime, location]);
  };
  patientRef.child("gdData").on('child_added', setData);
  patientRef.child("gdData").on('child_changed', setData);
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

function loadChartsLibrary() {
  // Load the Visualization API and the corechart package.
  google.charts.load('current', {
    'packages': ['corechart']
  });

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(waitForData);
}

function waitForData() {
  var delayInMilliseconds = 2000;

  setTimeout(function () {
    // your code to be executed after x seconds
    drawGlucoseChart();
    drawCarbsChart();
    drawExerciseChart();
    drawWeightChart();
    drawBpChart();
  }, delayInMilliseconds);
}

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawGlucoseChart() {

  var dataArray = prepareGlucoseArray();

  // Create the data table.
  var data = google.visualization.arrayToDataTable(dataArray);

  // Set chart options
  var options = {
    title: 'Glucose Levels',
    curveType: 'function',
    legend: {
      position: 'none'
    },
    colors: ['#9C27B0', '#7B1FA2', '#E1BEE7'],
    crosshair: {
      trigger: 'both'
    },
    pointSize: 5,
    vAxis: {
      title: 'mmol/L'
    }
  };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.LineChart(document.getElementById('glucose-chart'));
  chart.draw(data, options);
}

function prepareGlucoseArray() {

  var dataArray = new Array();

  var min = Number.MAX_VALUE;
  var max = 0;
  var tot = 0;

  for (let i = 0; i < gdDataList.length; i++) {
    var xVal = gdDataList[i][0];
    var yVal = gdDataList[i][1];
    if ((yVal != 0) && (xVal > startDate) && (xVal < endDate)) // Exclude if zero or not within given period
    {
      dataArray.push([xVal, yVal]); // update data array
      if (yVal > max) // find max
        max = yVal;
      if (yVal < min) // find min
        min = yVal;
      tot += yVal; // get total
    }
  }

  var avg = tot / dataArray.length;

  // Update display
  avgGlucElement.textContent = avg.toFixed(1) + " mmol/L";
  maxGlucElement.textContent = max.toFixed(1) + " mmol/L";
  minGlucElement.textContent = min.toFixed(1) + " mmol/L";

  // Sort by date
  dataArray.sort(function (a, b) {
    // Subtract dates to get a value that is either negative, positive, or zero.
    return a[0] - b[0];
  });

  // Add column headings
  dataArray.unshift(['time', 'glucose']);

  return dataArray;
}

// Carbs Chart
function drawCarbsChart() {

  var dataArray = prepareCarbsArray();

  // Create the data table.
  var data = google.visualization.arrayToDataTable(dataArray);

  // Set chart options
  var options = {
    title: 'Carbs',
    curveType: 'function',
    legend: {
      position: 'none'
    },
    colors: ['#9C27B0', '#7B1FA2', '#E1BEE7'],
    crosshair: {
      trigger: 'both'
    },
    pointSize: 5,
    vAxis: {
      title: 'grams',
      viewWindow: {
        min: 0
      }
    }
  };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.LineChart(document.getElementById('carbs-chart'));
  chart.draw(data, options);
}

function prepareCarbsArray() {

  var dataArray = new Array();

  var min = Number.MAX_VALUE;
  var max = 0;
  var tot = 0;

  for (let i = 0; i < gdDataList.length; i++) {
    var xVal = gdDataList[i][0];
    var yVal = gdDataList[i][2];
    if ((yVal != 0) && (xVal > startDate) && (xVal < endDate)) // Exclude if zero or not within given period
    {
      dataArray.push([xVal, yVal]); // update data array
      if (yVal > max) // find max
        max = yVal;
      if (yVal < min) // find min
        min = yVal;
      tot += yVal; // get total
    }
  }

  // Update display
  totCarbsElement.textContent = tot.toFixed(1) + " carbs";
  maxCarbsElement.textContent = max.toFixed(1) + " carbs";
  minCarbsElement.textContent = min.toFixed(1) + " carbs";

  // Sort by date
  dataArray.sort(function (a, b) {
    // Subtract dates to get a value that is either negative, positive, or zero.
    return a[0] - b[0];
  });

  // Add column headings
  dataArray.unshift(['time', 'carbs']);

  return dataArray;
}

// Exercise Chart
function drawExerciseChart() {

  var dataArray = prepareExerciseArray();

  // Create the data table.
  var data = google.visualization.arrayToDataTable(dataArray);

  // Set chart options
  var options = {
    title: 'Activity Time',
    curveType: 'function',
    legend: {
      position: 'none'
    },
    colors: ['#9C27B0', '#7B1FA2', '#E1BEE7'],
    crosshair: {
      trigger: 'both'
    },
    pointSize: 5,
    vAxis: {
      title: 'Hours',
      viewWindow: {
        min: 0
      }
    }
  };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.LineChart(document.getElementById('exercise-chart'));
  chart.draw(data, options);
}

function prepareExerciseArray() {

  var dataArray = new Array();

  var min = Number.MAX_VALUE;
  var max = 0;
  var tot = 0;

  for (let i = 0; i < gdDataList.length; i++) {
    var xVal = gdDataList[i][0];
    var yVal = gdDataList[i][3];
    if ((yVal != 0) && (xVal > startDate) && (xVal < endDate)) // Exclude if zero or not within given period
    {
      dataArray.push([xVal, yVal]); // update data array
      if (yVal > max) // find max
        max = yVal;
      if (yVal < min) // find min
        min = yVal;
      tot += yVal; // get total
    }
  }

  // Update display
  totActTimeElement.textContent = tot.toFixed(2) + " hrs";
  maxActTimeElement.textContent = max.toFixed(2) + " hrs";
  minActTimeElement.textContent = min.toFixed(2) + " hrs";

  // Sort by date
  dataArray.sort(function (a, b) {
    // Subtract dates to get a value that is either negative, positive, or zero.
    return a[0] - b[0];
  });

  // Add column headings
  dataArray.unshift(['time', 'activity time']);

  return dataArray;
}

// Weight Chart
function drawWeightChart() {

  var dataArray = prepareWeightArray();

  // Create the data table.
  var data = google.visualization.arrayToDataTable(dataArray);

  // Set chart options
  var options = {
    title: 'Weight',
    curveType: 'function',
    legend: {
      position: 'none'
    },
    colors: ['#9C27B0', '#7B1FA2', '#E1BEE7'],
    crosshair: {
      trigger: 'both'
    },
    pointSize: 5,
    vAxis: {
      title: 'Kg'
    }
  };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.LineChart(document.getElementById('weight-chart'));
  chart.draw(data, options);
}

function prepareWeightArray() {

  var dataArray = new Array();

  var min = Number.MAX_VALUE;
  var max = 0;
  var tot = 0;

  for (let i = 0; i < gdDataList.length; i++) {
    var xVal = gdDataList[i][0];
    var yVal = gdDataList[i][4];
    if ((yVal != 0) && (xVal > startDate) && (xVal < endDate)) // Exclude if zero or not within given period
    {
      dataArray.push([xVal, yVal]); // update data array
      if (yVal > max) // find max
        max = yVal;
      if (yVal < min) // find min
        min = yVal;
      tot += yVal; // get total
    }
  }

  var avg = tot / dataArray.length;

  // Update display
  avgWeightElement.textContent = avg.toFixed(1) + " Kg";
  maxWeightElement.textContent = max.toFixed(1) + " Kg";
  minWeightElement.textContent = min.toFixed(1) + " Kg";

  // Sort by date
  dataArray.sort(function (a, b) {
    // Subtract dates to get a value that is either negative, positive, or zero.
    return a[0] - b[0];
  });

  // Add column headings
  dataArray.unshift(['time', 'weight']);

  return dataArray;
}

// Blood Pressure Chart
function drawBpChart() {

  var dataArray = prepareBpArray();

  // Create the data table.
  var data = google.visualization.arrayToDataTable(dataArray);

  // Set chart options
  var options = {
    title: 'Systolic Blood Pressure',
    curveType: 'function',
    legend: {
      position: 'none'
    },
    colors: ['#9C27B0', '#7B1FA2', '#E1BEE7'],
    crosshair: {
      trigger: 'both'
    },
    pointSize: 5,
    vAxis: {
      title: 'mmHg'
    }
  };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.LineChart(document.getElementById('bp-chart'));
  chart.draw(data, options);
}

function prepareBpArray() {

  var dataArray = new Array();

  var min = Number.MAX_VALUE;
  var max = 0;
  var tot = 0;

  for (let i = 0; i < gdDataList.length; i++) {
    var xVal = gdDataList[i][0];
    var yVal = gdDataList[i][5];
    var isEmpty = yVal === "0/0";
    if ((!isEmpty) && (xVal > startDate) && (xVal < endDate)) // Exclude if empty or not within given period
    {
      var BP = yVal.split("/");
      yVal = parseInt(BP[0]);
      dataArray.push([xVal, yVal]); // update data array
      if (yVal > max) // find max
        max = yVal;
      if (yVal < min) // find min
        min = yVal;
      tot += yVal; // get total
    }
  }

  var avg = tot / dataArray.length;

  // Update display
  avgSystolicElement.textContent = avg.toFixed(1) + " mmHg";
  maxSystolicElement.textContent = max.toFixed(1) + " mmHg";
  minSystolicElement.textContent = min.toFixed(1) + " mmHg";

  // Sort by date
  dataArray.sort(function (a, b) {
    // Subtract dates to get a value that is either negative, positive, or zero.
    return a[0] - b[0];
  });

  // Add column headings
  dataArray.unshift(['time', 'BP']);

  return dataArray;
}

function initialiseFilters() {
  periodElement.selectedIndex = 1;
  monthElement.selectedIndex = curMonth;
  dayElement.selectedIndex = curDay;

  monthElement.style.display = "inline-block";
  dayElement.style.display = "none";
}

function updateFilters() {
  if (periodElement.selectedIndex == 0) {
    monthElement.style.display = "inline-block";
    dayElement.style.display = "inline-block";
    var month = monthElement.selectedIndex;
    var day = dayElement.selectedIndex + 1;
    startDate = new Date(curYear, month, day, 0, 0, 0, 0);
    endDate = new Date(curYear, month, day + 1, 0, 0, 0, 0);
  }
  if (periodElement.selectedIndex == 1) {
    monthElement.style.display = "inline-block";
    dayElement.style.display = "none";
    var month = monthElement.selectedIndex;
    startDate = new Date(curYear, month, 1, 0, 0, 0, 0);
    endDate = new Date(curYear, month + 1, 1, 0, 0, 0, 0);
  }
  if (periodElement.selectedIndex == 2) {
    monthElement.style.display = "none";
    dayElement.style.display = "none";
    firebase.database().ref('patients/' + getPatientId() + '/userData').once('value').then(function(snapshot) {
      var dueDate = new Date(snapshot.val().dueDate);
      startDate = new Date(dueDate.setDate(dueDate.getDate() - 280));
      endDate = new Date();
    });
  }
}

function refreshCharts() {
  drawGlucoseChart();
  drawCarbsChart();
  drawExerciseChart();
  drawWeightChart();
  drawBpChart();
}