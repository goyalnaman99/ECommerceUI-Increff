if (localStorage.getItem("user") != undefined) {
  console.log("in if");
  window.location.href = "/";
} else {
  $("form").on("submit", function (event) {
    event.preventDefault();
    const email = $("input[id=email]").val();
    const password = $("input[id=password]").val();

    $.getJSON("/resources/login.json", function (users) {
      console.log("in else");
      const user = users.filter(
        (users) => email === users.email && password === users.password
      );
      console.log(user);
      if (user.length) {
        $("#errormessage").addClass("d-none");
        console.log("logged in");
        window.localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "/";
      } else {
        $("#errormessage").removeClass("d-none");
        console.log("error in username or pass");
      }
    });
  });
}
