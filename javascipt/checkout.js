//Initialization of total price
let totalPrice = 0;
let cartItems = getCartItems();
$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
  //getting product from json
  $.getJSON("/resources/inventory.json", function (products) {
    const dummy = $("#firstCartItem");

    if (cartItems.length == 0) {
      $("#emptyCart").removeClass("d-none");
      $("#cartPrice").addClass("d-none");
      $("#cartHeader").addClass("d-none");
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

          $("#delete" + product.id).click(function () {
            deleteProduct(products, product.id);
          });

          //quantity increment/decrement
          $("#plus-btn" + product.id).click(function () {
            $("#qty_input" + product.id).html(
              parseInt($("#qty_input" + product.id).text()) + 1
            );

            //adding to cart
            const qty = Number($("#qty_input" + product.id).text());
            addToCart(product.id, qty);

            //updating total items
            setTotalItems();

            //updating price section
            calcTotalPrice(products, getCartItems());
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

            //updating total items
            setTotalItems();

            //updating price section
            calcTotalPrice(products, getCartItems());
          });

          //calculation of total price
          totalPrice += (product.mrp || 0) * Number(item.qty);
        }
      });
    }
    //downloading order csv onclick of place order button
    $("#placeOrder").click(function () {
      downloadOrderCSV(products);
    });

    //updating total items
    setTotalItems();

    //showing total price
    $("#totalMRP").text("Rs. " + totalPrice.toLocaleString());
  });

  //clearing cart onclick of clear cart icon
  $("#clearCart").click(function () {
    console.log("clicked");
    $("#clear-cart-modal").modal("show");
    $("#remove-cart").click(function () {
      cartItems = [];
      setCartMap(cartItems);
      setCartBadge(cartItems);
      $("#emptyCart").removeClass("d-none");
      $("#cartPrice").addClass("d-none");
      $("#cartContainer").addClass("d-none");
      $("#cartHeader").addClass("d-none");
      $("#clear-cart-modal").modal("hide");
    });
  });
});

function deleteProduct(products, productId) {
  console.log("in deleteprod");
  console.log(productId);
  $("#confirm-modal").modal("show");
  $("#remove").click(function () {
    deletefromCart(productId);

    if (!getCartItems().length) {
      $("#emptyCart").removeClass("d-none");
      $("#cartPrice").addClass("d-none");
      $("#cartContainer").addClass("d-none");
    }

    //updating total items
    setTotalItems();

    //updating total price
    calcTotalPrice(products, getCartItems());

    // Removing the deleted product from the view
    $("#cartContainer")
      .find("#" + productId)
      .remove();

    $("#confirm-modal").modal("hide");
  });
}

function setTotalItems() {
  //showing no of items in cart
  $("#totalItems").text(setCartBadge(getCartItems()));
}
function calcTotalPrice(products, cartItems) {
  console.log("in calc total price");
  totalPrice = 0;
  cartItems.map((item) => {
    const product = products.find((prod) => prod.id === item.id);
    totalPrice += (product.mrp || 0) * Number(item.qty);
  });
  console.log(totalPrice);
  //showing total price
  $("#totalMRP").text("Rs. " + totalPrice.toLocaleString());
}

function downloadOrderCSV(products) {
  let cartItems = getCartItems();
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
  a.setAttribute("download", today + ".csv");

  // Performing a download with click
  a.click();

  cartItems = [];
  setCartMap(cartItems);

  $("#emptyCart").removeClass("d-none");
  $("#cartPrice").addClass("d-none");
  $("#cartContainer").addClass("d-none");
  $("#cartHeader").addClass("d-none");

  $("#order-placed-modal").modal("show");
}

//init
checkLoggedIn();
