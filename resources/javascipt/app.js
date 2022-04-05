$(document).ready(function () {
  // Initializing the cart badge in the ui.
  setCartBadge(getCartItems());

  // Automatically update the date time in the footer every second
  setInterval(setDateTime, 1000);

  $('[data-tooltip="tooltip"]').tooltip();
});

//redirect to login page if user is not logged in
function checkLoggedIn() {
  const userId = getUserId();
  $.getJSON("/resources/json/login.json", function (users) {
    const user = users.filter((users) => userId === users.id);
    if (!user.length) {
      logout();
    }
    $("#navUser").text("Hi, " + user[0].firstname);
  });
}

//redirecting to login page on click of logout
$("#logout").click(function () {
  logout();
});

function logout() {
  window.localStorage.removeItem("user");
  window.location.href = "/HTML/login.html";
}

//showing current date-time in footer
function setDateTime() {
  var today = new Date().toLocaleString("en-IN");
  $("#datetime").text(today);
}

//setting Cart-User Map
function setCartMap(cartItems) {
  const cartMap = getCartMap();

  const userId = getUserId();

  cartMap[userId] = cartItems;
  localStorage.setItem("cartMap", JSON.stringify(cartMap));
}

// returning the cart map or an empty map if localstorage is empty
function getCartMap() {
  try {
    return JSON.parse(localStorage.getItem("cartMap")) || {};
  } catch (err) {
    return {};
  }
}

// returning the user id
function getUserId() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (err) {
    return null;
  }
}

//getting Cart Items
function getCartItems() {
  try {
    const cartMap = getCartMap();
    const userId = getUserId();
    return cartMap.hasOwnProperty(userId) ? cartMap[userId] : [];
  } catch (err) {
    return [];
  }
}

// getting product quantity
function getProductQuantity(productId) {
  const cartItems = getCartItems();
  if (cartItems != null) {
    const index = cartItems.findIndex((cartItem) => cartItem.id === productId);
    if (index >= 0) {
      return cartItems[index].qty;
    } else return 0;
  } else return 0;
}

// Deleting product from Cart
function deletefromCart(productId) {
  const cartItems = getCartItems();
  if (cartItems != null) {
    const index = cartItems.findIndex((cartItem) => cartItem.id === productId);
    if (index >= 0) {
      cartItems.splice(index, 1);
    }
    setCartBadge(cartItems);
    setCartMap(cartItems);
  }
}

// Adding to Cart
function addToCart(productId, qty) {
  //extra check for quantity
  if (qty < 1) {
    $("#confirm-modal").modal("show");
    $("#remove").click(function () {
      deletefromCart(productId);
      location.reload();
      return;
    });
    qty = 1;
    $("#confirm-modal").on("hide.bs.modal", function (e) {
      location.reload();
    });
    return;
  }

  const cartItems = getCartItems();

  //adding to cart item if product exists in cart
  if (cartItems.length) {
    const index = cartItems.findIndex((cartItem) => cartItem.id === productId);
    if (index >= 0) {
      cartItems[index].qty = qty;
    } else {
      cartItems.push({
        id: productId,
        qty,
      });
    }
  } else {
    cartItems.push({
      id: productId,
      qty,
    });
  }
  setCartBadge(cartItems);
  setCartMap(cartItems);
  $("qty_input" + productId).val(qty);
}

//setting badge info
function setCartBadge(cartItems) {
  var qty = 0;
  if (cartItems.length > 0) {
    cartItems.map((item) => {
      qty += item.qty;
    });
    $("#itemBadge").text(qty);
  } else {
    $("#itemBadge").text("");
  }
  return qty;
}
