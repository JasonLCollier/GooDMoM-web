// initialize Firebase
initFirebaseAuth();

// Shortcuts to DOM Elements.
var signOutElement = document.getElementById('signOut');

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