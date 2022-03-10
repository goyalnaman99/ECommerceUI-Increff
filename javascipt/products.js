//populating the product grid
$.getJSON("resources/inventory.json", function (products) {
  const dummy = $("#firstProduct");

  products.forEach((product) => {
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
    item.find("#product-price").text("Rs. " + product.mrp);
    item.find("#product-size").text("Size : " + product.size);
    item.find("#minus-btn").attr("id", "minus-btn" + product.id);
    item.find("#plus-btn").attr("id", "plus-btn" + product.id);
    item.find("#qty_input").attr("id", "qty_input" + product.id);
    item.find("#add-cart").attr("id", "add-cart" + product.id);
    $(".card-deck").append(item);

    //Routing to Details
    $("#" + product.id)
      .find("img")
      .click(function () {
        window.location.href = "/HTML/details.html?id=" + product.id;
      });

    //quantity increment/decrement
    $("#plus-btn" + product.id).click(function () {
      console.log("plus clicked");
      $("#qty_input" + product.id).val(
        parseInt($("#qty_input" + product.id).val()) + 1
      );
    });
    $("#minus-btn" + product.id).click(function () {
      $("#qty_input" + product.id).val(
        parseInt($("#qty_input" + product.id).val()) - 1
      );
      if ($("#qty_input" + product.id).val() == 0) {
        $("#qty_input" + product.id).val(1);
      }
    });
  });
});

//init
checkLoggedIn();
