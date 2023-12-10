import "./reset.css";
import "./style.css";

const importAllAssets = (function () {
  function importAll(r) {
    return r.keys().map(r);
  }
  const assets = importAll(require.context("./assets", false, /\.(png|jpe?g|svg)$/));
})();

const getNodes = (function () {
  const header = document.querySelector("h1");
  // For searchLocation()
  const searchInput = document.querySelector("input");
  const searchButton = document.querySelector("body > div:nth-child(2) > button");
  // For location..
  const continent = document.querySelector(".continent");
  const country = document.querySelector(".country");
  const region = document.querySelector(".region");
  const date = document.querySelector(".date");
  const time = document.querySelector(".time");
  // For forecast...
  const tempContainer = document.querySelector(".temperature");
  const tempSpan = document.querySelector(".temperature span");
  const tempButton = document.querySelector(".temperature button");
  const windSpeedContainer = document.querySelector(".wind-speed");
  const windSpeedSpan = document.querySelector(".wind-speed span");
  const windSpeedButton = document.querySelector(".wind-speed button");
  const windDirection = document.querySelector(".wind-direction");
  const humidity = document.querySelector(".humidity");
  const radiation = document.querySelector(".uv");
  const dayStatus = document.querySelector(".daylight-status");

  return {
    header,
    searchInput,
    searchButton,
    continent,
    country,
    region,
    date,
    time,
    tempContainer,
    tempSpan,
    tempButton,
    windSpeedContainer,
    windSpeedSpan,
    windSpeedButton,
    windDirection,
    humidity,
    radiation,
    dayStatus,
  };
})();

const getData = async function (location) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=06393eb913004a98bfe70936230812&q=${location}`,
    { mode: "cors" },
  );
  const weatherData = await response.json();

  return weatherData;
};

const searchLocation = (function () {
  let dataLocation = null;
  let dataReport = null;

  getNodes.searchButton.addEventListener("click", () => {
    const location = getNodes.searchInput.value;

    if (location !== "") {
      const extractFromWeatherData = (async function () {
        const locationData = await getData(location);
        const objectLocation = locationData.location;
        const objectReport = locationData.current;

        dataLocation = objectLocation;
        dataReport = objectReport;
        console.log(locationData);
        console.log(dataReport);

        const displayLocationDetails = (function () {
          getNodes.header.textContent = dataLocation.name;

          const continentName = dataLocation.tz_id.split("/");
          getNodes.continent.textContent = `Continent: ${continentName[0]}`;
          getNodes.country.textContent = `Country: ${dataLocation.country}`;
          getNodes.region.textContent = `Region: ${dataLocation.region}`;

          const dateAndTime = dataLocation.localtime.split(" ");
          getNodes.date.textContent = `Date: ${dateAndTime[0]}`;
          getNodes.time.textContent = `Time: ${dateAndTime[1]}`;
        })();

        const displayForecast = (function () {
          getNodes.tempSpan.textContent = `Temperature: ${dataReport.temp_c}°`;
          getNodes.windSpeedSpan.textContent = `Wind Speed: ${dataReport.wind_kph} kph`;
          getNodes.windDirection.textContent = `Wind Direction: ${dataReport.wind_degree} ${dataReport.wind_dir}`;
          getNodes.humidity.textContent = `Humidity: ${dataReport.humidity}`;
          getNodes.radiation.textContent = `Ultraviolet Radiation: ${dataReport.uv}`;
          getNodes.dayStatus.textContent = `Daylight Status: ${dataReport.is_day}`;
        })();
      })();
    } else {
      console.log("Enter som!");
    }
  });

  if (dataLocation !== null && dataReport !== null) {
    return { dataLocation, dataReport };
  }
})();
