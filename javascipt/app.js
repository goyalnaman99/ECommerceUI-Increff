//redirect to login page if user is not logged in
function checkLoggedIn() {
  if (window.localStorage.getItem("user") == undefined) {
    window.location.href = "/HTML/login.html";
  }
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
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user[0].id;

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
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user[0].id;
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
    if (confirm("Do you want to remove product from cart?") == true) {
      deletefromCart(productId);
    } else {
      qty = 1;
    }
    location.reload();
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
  if (cartItems.length > 0) {
    $("#itemBadge").text(cartItems.length);
  } else {
    $("#itemBadge").text("");
  }
}
setCartBadge(getCartItems());
