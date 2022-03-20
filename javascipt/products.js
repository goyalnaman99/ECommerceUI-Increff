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
      .text(getProductQuantity(product.id));
    $(".card-group").append(item);

    //Routing to Details
    $("#" + product.id)
      .find("img")
      .click(function () {
        window.location.href = "/HTML/details.html?id=" + product.id;
      });

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
  $("#noOfResults").text("Showing " + noOfResults + " results");

  //populating Filters
  populateFilters(products);
});

function populateFilters(products) {
  const brands = [...new Set(products.map((item) => item.brand))];
  const categories = [...new Set(products.map((item) => item.category))];
  const dummyBrand = $("#brand-filter-dummy");
  brands.forEach((brand) => {
    const formVal = dummyBrand.clone();
    formVal.find("label").text(brand);
    $("#brand-filter-section").append(formVal);
  });
  dummyBrand.addClass("d-none");
  const dummyCategory = $("#category-filter-dummy");
  categories.forEach((category) => {
    const formVal = dummyCategory.clone();
    formVal.find("label").text(category);
    $("#category-filter-section").append(formVal);
  });
  dummyCategory.addClass("d-none");
}
//init
checkLoggedIn();
