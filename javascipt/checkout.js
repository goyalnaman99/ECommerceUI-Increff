//getting product from json
$.getJSON("/resources/inventory.json", function (products) {
  const dummy = $("#firstCartItem");
  let cartItems = getCartItems();
  console.log(cartItems);
  if (cartItems.length == 0) {
    $("#emptyCart").removeClass("d-none");
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
        cartItem.find("#product-price").text("Rs. " + product.mrp);
        cartItem.find("#product-size").text("Size : " + product.size);
        cartItem
          .find("#product-quantity")
          .text("Qty : " + getProductQuantity(product.id));
        $("#cartContainer").append(cartItem);
      }
    });
  }
});

//init
checkLoggedIn();
