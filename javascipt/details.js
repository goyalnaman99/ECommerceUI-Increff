// getting url and id
const url_str = window.location.href;
const url = new URL(url_str);

const search_params = url.searchParams;

const product_id = search_params.get("id");

//getting product from json
$.getJSON("/resources/inventory.json", function (products) {
  const product = products.find((product) => product.id === product_id);

  $("#product-image").find("img").attr("src", product.imageUrl);
  $("#product-brand").text(product.brand);
  $("#product-name").text(product.name);
  $("#product-price").text("Rs. " + product.mrp.toLocaleString());
  $("#product-description").text(product.description);
  $("#minus-btn").attr("id", "minus-btn" + product.id);
  $("#plus-btn").attr("id", "plus-btn" + product.id);
  $("#qty_input")
    .attr("id", "qty_input" + product.id)
    .val(getProductQuantity(product.id));
  $("#add-cart").attr("id", "add-cart" + product.id);

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

//init
checkLoggedIn();
