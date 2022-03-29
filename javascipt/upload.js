let errorData = false;

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();

  $("#read-csv-btn").on("click", () => {
    Papa.parse(document.getElementById("upload-csv").files[0], {
      download: true,
      header: false,
      complete: function (results) {
        validateData(results.data);
      },
    });
  });
});

function validateData(data) {
  if (!data.length || data.length == 1) {
    $.notify("The file you have uploaded is empty", "error", {
      clickToHide: true,
      autoHide: false,
      arrowShow: true,
      arrowSize: 5,
    });
    return;
  }

  //getting product from json
  $.getJSON("/resources/inventory.json", function (products) {
    let i = 0;
    data.map((data, index) => {
      if (i == 0) {
        if (
          data[0] !== "Id" ||
          data[1] !== "Name" ||
          data[2] !== "Brand" ||
          data[3] !== "MRP" ||
          data[4] !== "Quantity" ||
          data[5] !== "TotalPrice"
        ) {
          errorData = true;
          data[7] = "Error in Headers. Please follow the Sample";
        }
      } else {
        data.forEach((cell) => {
          if (!cell.trim().length) {
            data[7] = "No field can be empty. All fields are requried";
            errorData = true;
          }
        });
        if (data[3] <= 0) {
          data[7] = "MRP should be a positive number";
          errorData = true;
        }
        if (data[4] <= 0) {
          data[7] = "Quantity should be a positive number";
          errorData = true;
        }
      }
      i++;
    });
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
      populateTable(data);
    }
  });
}

function downloadErrors(data) {
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

function populateTable(data) {
  if (!data.length) {
    console.log("The File you have uploaded is empty");
    return;
  }

  $(".table-row").remove();
  $("thead").empty();

  let i = 0;
  data.map((data, index) => {
    if (i == 0) {
      generateTableHead(data);
    } else {
      generateTableRows(data);
    }
    i++;
  });
  $("#table-container").removeClass("d-none");
}

function generateTableHead(data) {
  data.forEach((element) => {
    $("thead").append(`<th>` + element + `</th>`);
  });
}

function generateTableRows(data) {
  // console.log(data);
  const row = $("tbody").find("tr").first();
  const clone = row.clone().addClass("table-row").removeClass("d-none");
  if (data.length) {
    data.map((element) => clone.append(`<td>` + element + `</td>`));
    $("tbody").append(clone);
  }
}

//init
checkLoggedIn();
