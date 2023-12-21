fetch("/api/db")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    const urls = [];
    let count = 0;
    for (let endpoint in data) {
      count += data[endpoint].length;
      urls.push(`<a href="/api/${endpoint}">/${endpoint}</a><sup>${data[endpoint].length}x</sup>`);
    }
    urls.push(`<a href="../api/db">/db</a><sup>${count}x</sup>`);
    const resources = document.getElementById("resources");
    if (resources) {
      resources.innerHTML = urls.join("<br>");
    }
  });

const swaggerElement = document.querySelector("#swaggerEditor");
const pathToSchema = `${window.location.origin}${window.location.pathname}schema/openapi_rest_demo.json`;
if (swaggerElement) {
  swaggerElement.href = `https://editor.swagger.io/?url=${pathToSchema.replace("index.html", "")}`;
}

fetch("/api/config/features")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    const tableDiv = document.getElementById("featureTable");
    tableDiv.innerHTML = "";
    const table = document.createElement("table");

    for (const feature of Object.keys(data.config)) {
      const row = document.createElement("tr");

      const labelCell = document.createElement("td");
      const labelText = document.createTextNode(feature);
      labelCell.appendChild(labelText);
      row.appendChild(labelCell);

      const checkboxCell = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = data.config[feature];
      checkbox.id = `checkbox-${feature}`;
      checkbox.addEventListener("change", function () {
        handleCheckboxChange(feature, checkbox.checked);
      });

      checkboxCell.appendChild(checkbox);
      row.appendChild(checkboxCell);

      table.appendChild(row);
    }
    tableDiv.appendChild(table);
  });

function handleCheckboxChange(feature, isChecked) {
  console.log(`Feature ${feature} was ${isChecked ? "checked" : "unchecked"}`);
  const payload = {};
  payload[feature] = isChecked;
  fetch("/api/config/features", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((response) => {
    console.log(`Response for feature ${feature}: ${response.status}`);
    return response.json();
  });
}
