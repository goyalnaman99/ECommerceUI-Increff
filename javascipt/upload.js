$("#read-csv-btn").on("click", () => {
  Papa.parse(document.getElementById("upload-csv").files[0], {
    download: true,
    header: false,
    complete: function (results) {
      populateTable(results.data);
    },
  });
});

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
  console.log(data);
  const row = $("tbody").find("tr").first();
  const clone = row.clone().addClass("table-row").removeClass("d-none");
  if (data.length) {
    data.map((element) => clone.append(`<td>` + element + `</td>`));
    $("tbody").append(clone);
  }
}
