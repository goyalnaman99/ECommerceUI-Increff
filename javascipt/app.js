// function getUser() {
//   const userId = JSON.parse(window.localStorage.getItem("user"));
//   $.getJSON("/resources/login.json", function (users) {
//     return users.filter((users) => userId === users.id);
//   });
// }

//redirect to login page if user is not logged in
function checkLoggedIn() {
  const userId = JSON.parse(window.localStorage.getItem("user"));
  $.getJSON("/resources/login.json", function (users) {
    const user = users.filter((users) => userId === users.id);
    // console.log(user);
    if (!user.length) {
      window.location.href = "/HTML/login.html";
      return;
    }
    $("#navUser").text("Hi, " + user[0].firstname);
  });
}

//redirecting to login page on click of logout
$("#logout").click(function () {
  window.localStorage.removeItem("user");
  window.location.href = "/HTML/login.html";
});

//showing current date-time in footer
function setDateTime() {
  var today = new Date().toLocaleString("en-IN");
  $("#datetime").text(today);
}

// Automatically update the date time in the footer every second
setInterval(setDateTime, 1000);

//setting Cart-User Map
function setCartMap(cartItems) {
  let cartMap = JSON.parse(localStorage.getItem("cartMap"));
  // console.log(cartMap);
  const userId = JSON.parse(window.localStorage.getItem("user"));

  //adding to cart map if it already exists
  if (cartMap != null) {
    const index = cartMap.findIndex((map) => map.userId === userId);
    if (index >= 0) {
      cartMap[index].cartItems = cartItems;
    } else {
      cartMap.push({
        userId: userId,
        cartItems,
      });
    }
  } else {
    cartMap = [];
    cartMap.push({
      userId: userId,
      cartItems,
    });
  }
  localStorage.setItem("cartMap", JSON.stringify(cartMap));
}

//getting Cart Items
function getCartItems() {
  const cartMap = JSON.parse(localStorage.getItem("cartMap"));
  // console.log(cartMap);
  const userId = JSON.parse(window.localStorage.getItem("user"));
  if (cartMap != null) {
    const index = cartMap.findIndex((item) => item.userId === userId);
    if (index >= 0) {
      return cartMap[index].cartItems;
    } else return [];
  } else return [];
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
  console.log(cartItems);
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

setCartBadge(getCartItems());
