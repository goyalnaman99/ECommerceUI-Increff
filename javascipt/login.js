$(document).ready(function () {
  if (localStorage.getItem("user") != undefined) {
    window.location.href = "/";
  } else {
    $("form").on("submit", function (event) {
      event.preventDefault();
      const email = $("input[id=email]").val();
      const password = $("input[id=password]").val();

      $.getJSON("/resources/login.json", function (users) {
        const user = users.filter(
          (users) => email === users.email && password === users.password
        );
        if (user.length) {
          $("#errormessage").addClass("d-none");
          window.localStorage.setItem("user", JSON.stringify(user[0].id));
          window.location.href = "/";
        } else {
          $("#errormessage").removeClass("d-none");
        }
      });
    });
  }
});
