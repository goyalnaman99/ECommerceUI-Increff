$("form").on("submit", function (event) {
  event.preventDefault();
  const email = $("input[id=email]").val();
  const password = $("input[id=password]").val();
  console.log(email);
  console.log(password);
});
