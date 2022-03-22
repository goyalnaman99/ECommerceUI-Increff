// getting url and id
const url_str = window.location.href;
const url = new URL(url_str);

const search_params = url.searchParams;

const product_id = search_params.get("id");

$(document).ready(function () {
  //getting product from json
  $.getJSON("/resources/inventory.json", function (products) {
    const product = products.find((product) => product.id === product_id);

    if (!product) {
      $("#product-details-container").addClass("d-none");
      $("nav").addClass("d-none");
      $("footer").addClass("d-none");
      $("#product-not-found").removeClass("d-none");
    }

    $("#product-image").find("img").attr("src", product.imageUrl);
    $("#product-brand").text(product.brand);
    $("#product-name").text(product.name);
    $("#product-price").text("Rs. " + product.mrp.toLocaleString());
    $("#product-description").text(product.description);
    $("#minus-btn").attr("id", "minus-btn" + product.id);
    $("#plus-btn").attr("id", "plus-btn" + product.id);
    $("#qty_input")
      .attr("id", "qty_input" + product.id)
      .text(getProductQuantity(product.id));
    $("#add-cart").attr("id", "add-cart" + product.id);

    //quantity increment/decrement
    $("#plus-btn" + product.id).click(function () {
      $("#qty_input" + product.id).html(
        parseInt($("#qty_input" + product.id).text()) + 1
      );
      //adding to cart
      const qty = Number($("#qty_input" + product.id).text());
      addToCart(product.id, qty);
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
    });
  });
});

//init
checkLoggedIn();
