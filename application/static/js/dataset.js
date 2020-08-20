
// TODO: REFACTOR: Change function names

export function getDataSet(downloadFile=true) {
  // Get the dataset the users requested

  let dataSetName = document.querySelector("#dataSetName").value;
  let dataSetFormat = document.querySelector("#dataSetFormat").value;
  let dataSetRows = document.querySelector("#rowsNum").value;

  let dataSetNameFields = Array.from(document.querySelectorAll(".field-name"));
  let dataSetDataTypeFields = Array.from(
    document.querySelectorAll(".data-type")
  );

  let dataSetFieldsValues = dataSetNameFields.map((item, index) => {
    const item2 = dataSetDataTypeFields[index];

    return {
      fieldName: item.value,
      dataType: item2.value,
    };
  });

  return {
    name: dataSetName == "" ? "mock_data" : dataSetName,
    data_format: dataSetFormat,
    rows: dataSetRows == null ? 50 : dataSetRows,
    field_values: dataSetFieldsValues,
    download_file: downloadFile,
  };
}

export function sendDataSet() {
  // Sends dataset to api

  let dataSet = JSON.stringify(getDataSet());

  fetch(window.origin + "/api/createdata", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: dataSet,
  })
    .then((response) => {
      let filename = response.headers
        .get("Content-Disposition")
        .split("filename=")[1];
      return Promise.all([response.text(), filename]);
    })
    .then((data) => {
      downloadFile(data[0], data[1], "application/json");
    });
}



function downloadFile(data, fileName, type="text/plain") {
  // Create an invisible A element
  const a = document.createElement("a");
  a.style.display = "none";
  document.body.appendChild(a);

  // Set the HREF to a Blob representation of the data to be downloaded
  a.href = window.URL.createObjectURL(new Blob([data], { type }));

  // Use download attribute to set set desired file name
  a.setAttribute("download", fileName);

  // Trigger the download by simulating click
  a.click();

  // Cleanup
  window.URL.revokeObjectURL(a.href);
  document.body.removeChild(a);
}