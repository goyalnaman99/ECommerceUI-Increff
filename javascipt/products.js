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

//populating the product grid
$.getJSON('resources/inventory.json', function (products) 
{
  const dummy = $('#firstProduct');

  products.forEach(product => {
    const item = dummy.clone();
    item.removeClass('d-none');
    item.find('img').attr('src', product.imageUrl);
    item.find('#product-brand').text(product.brand);
    item.find('#product-name').text(product.name);
    item.find('#product-price').text("Rs. " + product.mrp);
    item.find('#product-size').text("Size : " + product.size);
    $('.card-deck').append(item);
  });
})

//init
setDateTime();
if(window.localStorage.getItem("user") == undefined)
{
  window.location.href = "/HTML/login.html";
}

