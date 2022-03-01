$("form").on("submit", function (event) {
  event.preventDefault();
  const email = $("input[id=email]").val();
  const password = $("input[id=password]").val();
  $.getJSON("/resources/login.json", function (users) {
    const user = users.filter(users => email === users.email && password === users.password);
    console.log(user);
    if(user.length)
    {
      $("#errormessage").addClass("d-none");
      console.log("logged in");
    }
    else
    {
      $("#errormessage").removeClass("d-none");
      console.log("error in username or pass");
    }
  });
});
