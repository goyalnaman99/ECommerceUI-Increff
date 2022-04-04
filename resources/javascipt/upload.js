let errorData = false;

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();

  $("#read-csv-btn").on("click", () => {
    checkLoggedIn();
    Papa.parse(document.getElementById("upload-csv").files[0], {
      download: true,
      header: true,
      transformHeader: function (h) {
        return h.trim().toLowerCase();
      },
      skipEmptyLines: "greedy",
      complete: function (results) {
        console.log(results.data);
        validateData(results.data);
      },
    });
  });

  $("#upload-csv").on("change", function (e) {
    //get the file name
    var fileName = e.target.files[0].name;
    //replace the "Choose a file" label
    $(this).next(".custom-file-label").html(fileName);
  });
});

function validateData(data) {
  checkLoggedIn();
  if (!data.length) {
    $.notify("The file you have uploaded is empty", "error", {
      clickToHide: true,
      autoHide: false,
      arrowShow: true,
      arrowSize: 5,
    });
    return;
  }

  //getting product from json
  $.getJSON("/resources/json/inventory.json", function (products) {
    for (let i = 0; i < data.length; i++) {
      let prod = findProduct(products, data[i].id);
      console.log(prod);
      if (prod.length) {
        if (data[i]?.quantity == "") {
          errorData = true;
          data[i].errors = "Quantity is a required field.";
        } else {
          if (data[i].quantity <= 0) {
            errorData = true;
            data[i].errors = "Quantity should be more than zero";
          }
          if (console.log(isNaN(data[i].quantity))) {
            errorData = true;
            data[i].errors = "Quantity should be a number more than zero";
          }
        }
      } else {
        errorData = true;
        data[i].errors = "Product with ID specified doesn't exist";
      }
    }
    if (errorData == true) {
      $("#download-errors").removeClass("d-none");
      $("#table-container").addClass("d-none");
      $.notify("There were errors in uploading CSV", "error", {
        clickToHide: true,
        autoHide: false,
        arrowShow: true,
        arrowSize: 5,
      });
      $("#download-errors a").click(function () {
        downloadErrors(data);
      });
    } else {
      $.notify("CSV Uploaded Successfully", "success", {
        clickToHide: true,
        autoHide: true,
        autoHideDelay: 5000,
        arrowShow: true,
        arrowSize: 5,
      });
      populateTable(data, products);
    }
  });
}

function findProduct(products, productId) {
  return products.filter((products) => productId === products.id);
}

function downloadErrors(data) {
  console.log(data);
  //unparsing to csv
  const csv = Papa.unparse(data);

  // Creating a Blob for having a csv file format and passing the data with type
  const blob = new Blob([csv], { type: "text/csv" });

  // Creating an object for downloading url
  const url = window.URL.createObjectURL(blob);

  // Creating an anchor(a) tag of HTML
  const a = document.createElement("a");

  // Passing the blob downloading url
  a.setAttribute("href", url);

  //getting datetime of order
  var today = new Date().toLocaleString("en-IN");

  // Setting the anchor tag attribute for downloading and passing the download file name
  a.setAttribute("download", today + " errors.csv");

  // Performing a download with click
  a.click();
}

function populateTable(data, products) {
  $(".table-row").remove();
  $("thead").empty();

  let i = 0;
  generateTableHead(data);
  data.map((data, index) => {
    generateTableRows(data, findProduct(products, data.id));
    i++;
  });
  $("#table-container").removeClass("d-none");
}

function generateTableHead(data) {
  $("thead").append(
    `<th>` +
      "Image" +
      `</th>` +
      `<th>` +
      "Name" +
      `</th>` +
      `<th>` +
      "Brand" +
      `</th>` +
      `<th>` +
      "MRP" +
      `</th>` +
      `<th>` +
      "Quantity" +
      `</th>` +
      `<th>` +
      "Total Price" +
      `</th>`
  );
}

function generateTableRows(data, product) {
  console.log(data);
  console.log(product);
  let clone = $("#upload-order-row").clone();
  clone.removeClass("d-none");
  clone.removeAttr("id");
  clone.attr("id", product[0].id);
  clone.find("img").attr("src", product[0].imageUrl);
  clone.find("img").click(function () {
    window.location.href = "/HTML/details.html?id=" + product[0].id;
  });
  clone.find("#quantity").text(data.quantity);
  clone.find("#brand").text(product[0].brand);
  clone.find("#mrp").text("Rs. " + product[0].mrp.toLocaleString());
  clone
    .find("#total-price")
    .text("Rs. " + (data.quantity * product[0].mrp).toLocaleString());
  clone.find("#name").text(product[0].name);
  $("tbody").append(clone);
}

//init
checkLoggedIn();
