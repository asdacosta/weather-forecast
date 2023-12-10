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
  const continent = document.querySelector(".continent span");
  const country = document.querySelector(".country span");
  const region = document.querySelector(".region span");
  const date = document.querySelector(".date span");
  const time = document.querySelector(".time span");
  // For forecast...
  const temp = document.querySelector(".temperature span");
  const tempButton = document.querySelector(".temperature button");
  const windSpeed = document.querySelector(".wind-speed span");
  const windSpeedButton = document.querySelector(".wind-speed button");
  const windDirection = document.querySelector(".wind-direction span");
  const humidity = document.querySelector(".humidity span");
  const radiation = document.querySelector(".uv span");
  const dayStatus = document.querySelector(".daylight-status span");

  return {
    header,
    searchInput,
    searchButton,
    continent,
    country,
    region,
    date,
    time,
    temp,
    tempButton,
    windSpeed,
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
    const location = getNodes.searchInput.value.trim();

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
          getNodes.continent.textContent = continentName[0];
          getNodes.country.textContent = dataLocation.country;
          getNodes.region.textContent = dataLocation.region;

          const dateAndTime = dataLocation.localtime.split(" ");
          getNodes.date.textContent = dateAndTime[0];
          getNodes.time.textContent = dateAndTime[1];
        })();

        const displayForecast = (function () {
          getNodes.temp.textContent = `${dataReport.temp_c}°C`;
          getNodes.windSpeed.textContent = `${dataReport.wind_kph} kph`;
          getNodes.windDirection.textContent = `${dataReport.wind_degree} (${dataReport.wind_dir})`;
          getNodes.humidity.textContent = `${dataReport.humidity}%`;

          switch (true) {
            case dataReport.uv >= 0 && dataReport.uv <= 2:
              getNodes.radiation.textContent = "Low";
              break;
            case dataReport.uv >= 3 && dataReport.uv <= 5:
              getNodes.radiation.textContent = "Moderate";
              break;
            case dataReport.uv >= 6 && dataReport.uv <= 7:
              getNodes.radiation.textContent = "High";
              break;
            case dataReport.uv >= 8 && dataReport.uv <= 10:
              getNodes.radiation.textContent = " Very High";
              break;
            case dataReport.uv >= 11:
              getNodes.radiation.textContent = "Extreme";
              break;
            default:
              getNodes.radiation.textContent = "Unknown Radiation";
              break;
          }

          dataReport.is_day === 1
            ? (getNodes.dayStatus.textContent = "Day")
            : (getNodes.dayStatus.textContent = "Night");
        })();

        const toggleUnits = (function () {
          let toggleTemp = false;
          let toggleWindSpeed = false;

          getNodes.tempButton.addEventListener("click", () => {
            if (toggleTemp) {
              getNodes.temp.textContent = `${dataReport.temp_c}°C`;
              toggleTemp = false;
            } else {
              getNodes.temp.textContent = `${dataReport.temp_f}°F`;
              toggleTemp = true;
            }
          });

          getNodes.windSpeedButton.addEventListener("click", () => {
            if (toggleWindSpeed) {
              getNodes.windSpeed.textContent = `${dataReport.wind_kph} kph`;
              toggleWindSpeed = false;
            } else {
              getNodes.windSpeed.textContent = `${dataReport.wind_mph} mph`;
              toggleWindSpeed = true;
            }
          });
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
