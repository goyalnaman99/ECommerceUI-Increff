//Initialization of total price
let totalPrice = 0;

//getting product from json
$.getJSON("/resources/inventory.json", function (products) {
  const dummy = $("#firstCartItem");
  let cartItems = getCartItems();

  if (cartItems.length == 0) {
    $("#emptyCart").removeClass("d-none");
    $("#cartPrice").addClass("d-none");
    $("#cartContainer").addClass("d-none");
  } else {
    cartItems.forEach((item) => {
      const product = products.filter((product) => item.id === product.id)[0];
      if (product == undefined) {
        console.log("prod undefined");
        return;
      }
      if (item.qty > 0) {
        const cartItem = dummy.clone();
        cartItem.removeClass("d-none");
        cartItem.attr("id", item.id);
        cartItem.find("img").attr("src", product.imageUrl);
        cartItem.find("#product-brand").append(
          $("<a/>", {
            href: "/HTML/details.html?id=" + product.id,
            text: product.brand,
          })
        );
        cartItem.find("#product-name").text(product.name);
        cartItem
          .find("#product-price")
          .text("Rs. " + product.mrp.toLocaleString());
        cartItem.find("#minus-btn").attr("id", "minus-btn" + product.id);
        cartItem.find("#plus-btn").attr("id", "plus-btn" + product.id);
        cartItem
          .find("#qty_input")
          .attr("id", "qty_input" + product.id)
          .text(item.qty);
        cartItem.find("#delete").attr("id", "delete" + product.id);

        //appending to container
        $("#cartContainer").append(cartItem);

        //quantity increment/decrement
        $("#plus-btn" + product.id).click(function () {
          $("#qty_input" + product.id).html(
            parseInt($("#qty_input" + product.id).text()) + 1
          );
          //adding to cart
          const qty = Number($("#qty_input" + product.id).text());
          addToCart(product.id, qty);
          location.reload();
        });
        $("#minus-btn" + product.id).click(function () {
          $("#qty_input" + product.id).html(
            parseInt($("#qty_input" + product.id).text()) - 1
          );
          if (Number($("#qty_input" + product.id).text()) <= 0) {
            $("#qty_input" + product.id).text(0);
          }
          //adding to cart
          const qty = Number($("#qty_input" + product.id).text());
          addToCart(product.id, qty);
          if (qty >= 1) location.reload();
        });
        //calculation of total price
        totalPrice += (product.mrp || 0) * Number(item.qty);

        $("#delete" + product.id).click(function () {
          $("#confirm-modal").modal("show");
          $("#remove").click(function () {
            deletefromCart(product.id);
            location.reload();
          });
          // location.reload();
        });
      }
    });
  }
  //downloading order csv onclick of place order button
  $("#placeOrder").click(function () {
    downloadOrderCSV(products);
  });

  //showing no of items in cart
  $("#totalItems").text(cartItems.length || 0);

  //showing total price
  $("#totalMRP").text("Rs. " + totalPrice.toLocaleString());

  //clearing cart onclick of clear cart icon
  $("#clearCart").click(function () {
    cartItems = [];
    setCartMap(cartItems);
    location.reload();
  });
});

function downloadOrderCSV(products) {
  let cartItems = getCartItems();
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user[0].firstname;
  let rows = [];
  cartItems.forEach((item) => {
    const product = products.filter((product) => item.id === product.id)[0];
    rows.push({
      Id: product.id,
      Name: product.name,
      Brand: product.brand,
      MRP: product.mrp,
      Quantity: item.qty,
      TotalPrice: product.mrp * item.qty,
    });
  });

  //sorting according to product id
  rows.sort((a, b) => (a.Id > b.Id ? 1 : b.Id > a.Id ? -1 : 0));

  //unparsing to csv
  const csv = Papa.unparse(rows);

  // Creating a Blob for having a csv file format and passing the data with type
  const blob = new Blob([csv], { type: "text/csv" });

  // Creating an object for downloading url
  const url = window.URL.createObjectURL(blob);

  // Creating an anchor(a) tag of HTML
  const a = document.createElement("a");

  // Passing the blob downloading url
  a.setAttribute("href", url);

  //getting datetime of order
  var today = new Date().toLocaleString("en-IN");

  // Setting the anchor tag attribute for downloading and passing the download file name
  a.setAttribute("download", userName + " " + today + ".csv");

  // Performing a download with click
  a.click();

  cartItems = [];
  setCartMap(cartItems);
  location.reload();
}
//init
checkLoggedIn();
