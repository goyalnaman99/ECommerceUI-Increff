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
  $("#product-price").text("Rs. " + product.mrp);
  $("#product-size").text("Size : " + product.size);
  $("#product-description").text(product.description);
});

//init
checkLoggedIn();
