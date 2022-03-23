let noOfResults = 0;
let brandFilterList = [];
let categoryFilterList = [];

$(document).ready(function () {
  $.getJSON("resources/inventory.json", function (products) {
    let filteredProducts = products;

    //initially populating grid
    populateGrid(filteredProducts, 0);

    //populating Filters
    populateFilters(products);

    //adding brands to list on check and removing on uncheck
    $('#brand-filter-dummy input[type="checkbox"]').change(function () {
      console.log(this);
      if (this.checked) {
        brandFilterList.push($(this).attr("id"));
      } else if (!this.checked) {
        var index = brandFilterList.indexOf($(this).attr("id"));
        if (index !== -1) {
          brandFilterList.splice(index, 1);
        }
      }
      console.log(brandFilterList);

      if (brandFilterList.length || categoryFilterList.length) {
        if (!categoryFilterList.length) {
          filteredProducts = products.filter((product) =>
            brandFilterList.includes(product.brand)
          );
        } else if (!brandFilterList.length) {
          filteredProducts = products.filter((product) =>
            categoryFilterList.includes(product.category)
          );
        } else {
          filteredProducts = products.filter(
            (product) =>
              categoryFilterList.includes(product.category) &&
              brandFilterList.includes(product.brand)
          );
        }
      } else filteredProducts = products;
      console.log(filteredProducts);
      $(".card-group").children("*").not("#firstProduct").remove();
      populateGrid(filteredProducts, 0);
    });

    //adding category to list on check and removing on uncheck
    $('#category-filter-dummy input[type="checkbox"]').change(function () {
      console.log(this);
      if (this.checked) {
        categoryFilterList.push($(this).attr("id"));
      } else if (!this.checked) {
        var index = categoryFilterList.indexOf($(this).attr("id"));
        if (index !== -1) {
          categoryFilterList.splice(index, 1);
        }
      }
      console.log(categoryFilterList);

      if (categoryFilterList.length || brandFilterList.length) {
        if (!brandFilterList.length) {
          filteredProducts = products.filter((product) =>
            categoryFilterList.includes(product.category)
          );
        } else if (!categoryFilterList.length) {
          filteredProducts = products.filter((product) =>
            brandFilterList.includes(product.brand)
          );
        } else {
          filteredProducts = products.filter(
            (product) =>
              categoryFilterList.includes(product.category) &&
              brandFilterList.includes(product.brand)
          );
        }
      } else filteredProducts = products;
      console.log(filteredProducts);
      $(".card-group").children("*").not("#firstProduct").remove();
      populateGrid(filteredProducts, 0);
    });

    //sorting low to high
    $("#price-asc").click(function () {
      console.log("clic");
      filteredProducts.sort((a, b) => (a.mrp > b.mrp ? 1 : -1));
      $(".card-group").children("*").not("#firstProduct").remove();
      populateGrid(filteredProducts, 0);
    });

    //sorting high to low
    $("#price-desc").click(function () {
      console.log("clic");
      filteredProducts.sort((a, b) => (a.mrp < b.mrp ? 1 : -1));
      $(".card-group").children("*").not("#firstProduct").remove();
      populateGrid(filteredProducts, 0);
    });
  });
});

//func to populate grid
function populateGrid(filteredProducts, noOfResults) {
  const dummy = $("#firstProduct");
  filteredProducts.forEach((product) => {
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
}

//func to populate filters
function populateFilters(products) {
  const brands = [...new Set(products.map((item) => item.brand))];
  const categories = [...new Set(products.map((item) => item.category))];
  const dummyBrand = $("#brand-filter-dummy");
  brands.forEach((brand) => {
    const formVal = dummyBrand.clone();
    formVal.find("input").attr("id", brand);
    formVal.find("label").attr("for", brand).text(brand);
    $("#brand-filter-section").append(formVal);
  });
  dummyBrand.addClass("d-none");
  const dummyCategory = $("#category-filter-dummy");
  categories.forEach((category) => {
    const formVal = dummyCategory.clone();
    formVal.find("input").attr("id", category);
    formVal.find("label").attr("for", category).text(category);
    $("#category-filter-section").append(formVal);
  });
  dummyCategory.addClass("d-none");
}

//init
checkLoggedIn();
