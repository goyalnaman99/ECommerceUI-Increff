//Initialization of total price
let totalPrice = 0;

//getting product from json
$.getJSON("/resources/inventory.json", function (products) {
  const dummy = $("#firstCartItem");
  let cartItems = getCartItems();

  if (cartItems.length == 0) {
    $("#emptyCart").removeClass("d-none");
    $("#cartPrice").addClass("d-none");
  } else {
    cartItems.forEach((item) => {
      const product = products.filter((product) => item.id === product.id)[0];
      console.log(product);
      console.log(product.id);
      if (getProductQuantity(item.id) > 0) {
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
        cartItem.find("#product-size").text("Size : " + product.size);
        cartItem
          .find("#product-quantity")
          .text("Qty : " + getProductQuantity(product.id));
        cartItem.find("#delete").attr("id", "delete" + product.id);

        //appending to container
        $("#cartContainer").append(cartItem);

        //calculation of total price
        totalPrice +=
          (product.mrp || 0) * Number(getProductQuantity(product.id));

        $("#delete" + product.id).click(function () {
          deletefromCart(product.id);
          location.reload();
        });
      }
    });
  }
  $("#totalItems").text(cartItems.length || 0);
  $("#totalMRP").text("Rs. " + totalPrice.toLocaleString());
});

//init
checkLoggedIn();
