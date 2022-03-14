let noOfResults = 0;
//populating the product grid
$.getJSON("resources/inventory.json", function (products) {
  const dummy = $("#firstProduct");
  products.forEach((product) => {
    noOfResults++;
    const item = dummy.clone();
    item.removeClass("d-none");
    item.attr("id", product.id);
    item.find("img").attr("src", product.imageUrl);
    item.find("#product-brand").append(
      $("<a/>", {
        href: "/HTML/details.html?id=" + product.id,
        text: product.brand,
      })
    );
    item.find("#product-name").text(product.name);
    item.find("#product-price").text("Rs. " + product.mrp.toLocaleString());
    item.find("#minus-btn").attr("id", "minus-btn" + product.id);
    item.find("#plus-btn").attr("id", "plus-btn" + product.id);
    item
      .find("#qty_input")
      .attr("id", "qty_input" + product.id)
      .val(getProductQuantity(product.id));
    $(".card-group").append(item);

    //Routing to Details
    $("#" + product.id)
      .find("img")
      .click(function () {
        window.location.href = "/HTML/details.html?id=" + product.id;
      });

    //quantity increment/decrement
    $("#plus-btn" + product.id).click(function () {
      // console.log("plus clicked");
      $("#qty_input" + product.id).val(
        parseInt($("#qty_input" + product.id).val()) + 1
      );
      //adding to cart
      const qty = Number($("#qty_input" + product.id).val());
      addToCart(product.id, qty);
    });
    $("#minus-btn" + product.id).click(function () {
      $("#qty_input" + product.id).val(
        parseInt($("#qty_input" + product.id).val()) - 1
      );
      if ($("#qty_input" + product.id).val() <= 0) {
        $("#qty_input" + product.id).val(0);
      }
      //adding to cart
      const qty = Number($("#qty_input" + product.id).val());
      addToCart(product.id, qty);
    });
  });
  $("#noOfResults").text("Showing " + noOfResults + " results");
});

//init
checkLoggedIn();
