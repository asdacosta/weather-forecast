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

const displayLocationDetails = function (data) {
  getNodes.header.textContent = data.name;

  const setContinentAndCountry = (function () {
    const continentName = data.tz_id.split("/");
    getNodes.continent.textContent = continentName[0];
    getNodes.country.textContent = data.country;
  })();

  const setRegion = (function () {
    if (data.region !== "") {
      getNodes.region.textContent = data.region;
    } else {
      getNodes.region.textContent = "Unrecognized 🤷";
    }
  })();

  const setDateAndTimeFormats = (function () {
    const dateAndTime = data.localtime.split(" ");
    const date = new Date(dateAndTime[0]);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    getNodes.date.textContent = formattedDate;
    getNodes.time.textContent = dateAndTime[1];
  })();
};

const displayForecast = function (data) {
  const setInitialForecasts = (function () {
    getNodes.temp.textContent = `${data.temp_c}°C`;
    getNodes.windSpeed.textContent = `${data.wind_kph} kph`;
    getNodes.windDirection.textContent = `${data.wind_degree} (${data.wind_dir})`;
    getNodes.humidity.textContent = `${data.humidity}%`;
  })();

  const setRadiation = (function () {
    switch (true) {
      case data.uv >= 0 && data.uv <= 2:
        getNodes.radiation.textContent = "Low";
        break;
      case data.uv >= 3 && data.uv <= 5:
        getNodes.radiation.textContent = "Moderate";
        break;
      case data.uv >= 6 && data.uv <= 7:
        getNodes.radiation.textContent = "High";
        break;
      case data.uv >= 8 && data.uv <= 10:
        getNodes.radiation.textContent = " Very High";
        break;
      case data.uv >= 11:
        getNodes.radiation.textContent = "Extreme";
        break;
      default:
        getNodes.radiation.textContent = "Unknown Radiation";
        break;
    }
  })();

  const setDayStatus = (function () {
    data.is_day === 1
      ? (getNodes.dayStatus.textContent = "Day")
      : (getNodes.dayStatus.textContent = "Night");
  })();
};

const toggleUnits = function (data) {
  let toggleTemp = false;
  let toggleWindSpeed = false;

  const toggleTempUnit = (function () {
    getNodes.tempButton.addEventListener("click", () => {
      if (toggleTemp) {
        getNodes.temp.textContent = `${data.temp_c}°C`;
        toggleTemp = false;
      } else {
        getNodes.temp.textContent = `${data.temp_f}°F`;
        toggleTemp = true;
      }
    });
  })();

  const toggleWindSpeedUnit = (function () {
    getNodes.windSpeedButton.addEventListener("click", () => {
      if (toggleWindSpeed) {
        getNodes.windSpeed.textContent = `${data.wind_kph} kph`;
        toggleWindSpeed = false;
      } else {
        getNodes.windSpeed.textContent = `${data.wind_mph} mph`;
        toggleWindSpeed = true;
      }
    });
  })();
};

const searchLocation = (function () {
  getNodes.searchButton.addEventListener("click", () => {
    const location = getNodes.searchInput.value.trim();

    if (location !== "") {
      const extractFromWeatherData = (async function () {
        const weatherData = await getData(location);
        const locationData = weatherData.location;
        const reportData = weatherData.current;

        displayLocationDetails(locationData);
        displayForecast(reportData);
        toggleUnits(reportData);
      })();
    } else {
      console.log("Enter som!");
    }
  });
})();
