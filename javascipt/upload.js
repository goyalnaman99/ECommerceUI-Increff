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
          if (!cell.length) {
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
      console.log("errors present");
      return;
    } else populateTable(data);
  });
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
