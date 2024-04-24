const articlesStatsEndpoint = "../../api/stats/publish/articles";
const commentsStatsEndpoint = "../../api/stats/publish/comments";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function generateDays() {
  const DAYS = [];
  for (let i = 1; i <= 31; i++) {
    const day = i.toString().padStart(2, "0");
    DAYS.push(day);
  }
  return DAYS;
}

const DAYS = generateDays();

async function issueGetArticlesStatsRequest() {
  return issueGetStatsRequest(articlesStatsEndpoint);
}

async function issueGetCommentsStatsRequest() {
  return issueGetStatsRequest(commentsStatsEndpoint);
}

async function issueGetStatsRequest(endpoint) {
  const data = fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((r) => r.json());
  return data;
}

function parseDailyData(data) {
  const cumulativeData = {};
  for (let i = 1; i <= 31; i++) {
    const month = i.toString().padStart(2, "0");
    cumulativeData[month] = 0;
  }

  for (const key in data) {
    const day = key.split("-")[2];
    if (cumulativeData[day]) {
      cumulativeData[day] += data[key];
    } else {
      cumulativeData[day] = data[key];
    }
  }

  return cumulativeData;
}

function parseMonthlyData(data) {
  const cumulativeData = {};
  for (let i = 1; i <= 12; i++) {
    const month = i.toString().padStart(2, "0");
    cumulativeData[month] = 0;
  }

  for (const key in data) {
    const month = key.split("-")[1];
    if (cumulativeData[month]) {
      cumulativeData[month] += data[key];
    } else {
      cumulativeData[month] = data[key];
    }
  }

  return cumulativeData;
}

function sortCumulativeData(cumulativeData) {
  const sortedData = Object.entries(cumulativeData)
    .sort((a, b) => {
      const monthA = parseInt(a[0]);
      const monthB = parseInt(b[0]);
      return monthA - monthB;
    })
    .map((entry) => entry[1]);

  return sortedData;
}

function getCumulativeValuesByDayOfWeek(data) {
  const cumulativeData = {};

  for (const key in data) {
    const date = new Date(key);
    const dayOfWeek = DAYS_OF_WEEK[date.getDay()];

    if (cumulativeData[dayOfWeek]) {
      cumulativeData[dayOfWeek] += data[key];
    } else {
      cumulativeData[dayOfWeek] = data[key];
    }
  }

  return cumulativeData;
}

function displayData(dataType, dataResolution, labels, data) {
  displayChart(
    labels,
    [{ label: dataType, data: data }],
    "chartPlaceholder",
    `${dataType} Publication Trends by ${dataResolution}`
  );
}

function displayChart(x, y, chartId, title) {
  if (window.myCharts === undefined) {
    window.myCharts = {};
  }

  if (window.myCharts[chartId] != undefined) {
    window.myCharts[chartId].destroy();
  }

  const datasets = [];

  y.forEach((element) => {
    datasets.push({
      label: element.label,
      data: element.data,
      borderWidth: 1,
    });
  });

  var ctx = document.getElementById(chartId).getContext("2d");
  window.myCharts[chartId] = new Chart(ctx, {
    type: "radar",
    data: {
      labels: x,
      datasets: datasets,
    },
    options: {
      scale: {
        min: 0,
      },
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 24,
          },
        },
      },
    },
  });
}

function getAndDisplayData(dataType, dataResolution) {
  dataResolution = dataResolution ?? "month";
  dataType = dataType ?? "articles";

  if (dataType.toLowerCase() === "articles") {
    issueGetArticlesStatsRequest().then((data) => {
      let dataSet = [];
      let labels = MONTHS;
      if (dataResolution === "day") {
        dataSet = sortCumulativeData(parseDailyData(data.daily));
        labels = DAYS;
      } else if (dataResolution === "day-of-week") {
        dataSet = sortCumulativeData(getCumulativeValuesByDayOfWeek(data.daily));
        labels = DAYS_OF_WEEK;
      } else {
        dataSet = sortCumulativeData(parseMonthlyData(data.monthly));
      }
      displayData("Articles", dataResolution, labels, dataSet);
    });
  } else if (dataType.toLowerCase() === "comments") {
    issueGetCommentsStatsRequest().then((data) => {
      let dataSet = [];
      let labels = MONTHS;
      if (dataResolution === "day") {
        dataSet = sortCumulativeData(parseDailyData(data.daily));
        labels = DAYS;
      } else if (dataResolution === "day-of-week") {
        dataSet = sortCumulativeData(getCumulativeValuesByDayOfWeek(data.daily));
        labels = DAYS_OF_WEEK;
      } else {
        dataSet = sortCumulativeData(parseMonthlyData(data.monthly));
      }
      displayData("Comments", dataResolution, labels, dataSet);
    });
  } else {
    console.error("Invalid data type");
  }
}

const dataType = getParams()["data"];
const dataResolution = getParams()["resolution"];
getAndDisplayData(dataType, dataResolution);
