//redirect to login page if user is not logged in
function checkLoggedIn() {
  if (window.localStorage.getItem("user") == undefined) {
    window.location.href = "/HTML/login.html";
  }
}

//redirecting to login page on click of logout
$("#logout").click(function () {
  window.localStorage.removeItem("user");
  window.location.href = "/HTML/login.html";
});

//showing current date-time in footer
function setDateTime() {
  var today = new Date().toLocaleString("en-IN");
  $("#datetime").text(today);
}

// Automatically update the date time in the footer every second
setInterval(setDateTime, 1000);


