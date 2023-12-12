// import { resolve } from "path";
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
  const searchButton = document.querySelector(".search-sec > button");
  // For displayLocationDetails()
  const continent = document.querySelector(".continent span");
  const country = document.querySelector(".country span");
  const region = document.querySelector(".region span");
  const date = document.querySelector(".date span");
  const time = document.querySelector(".time span");
  // For displayForeCast()
  const temp = document.querySelector(".temperature span:last-child");
  const tempButton = document.querySelector(".heading > div > button:first-child");
  const windSpeed = document.querySelector(".wind-speed span:last-child");
  const windSpeedButton = document.querySelector(".heading > div > button:last-child");
  const windDirection = document.querySelector(".wind-direction span:last-child");
  const humidity = document.querySelector(".humidity span:last-child");
  const radiation = document.querySelector(".uv span:last-child");
  const dayStatus = document.querySelector(".daylight-status span:last-child");
  // For setBackgroundImgs()
  const displaySection = document.querySelector(".main-sec");
  // For clearSection(), defaultSection()
  const headingContainer = document.querySelector(".heading");
  const locationContainer = document.querySelector(".location-details");
  const forecastContainer = document.querySelector(".weather-forecast");
  const visibleChildren = [headingContainer, locationContainer, forecastContainer];
  const hiddenHeader = document.querySelector("h2");
  // For displayLoading()
  const bouncingBall = document.querySelector(".load");

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
    displaySection,
    visibleChildren,
    hiddenHeader,
    bouncingBall,
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
    getNodes.windSpeed.textContent = `${data.wind_kph} kp/h`;
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
        getNodes.tempButton.textContent = "Fahrenheit";
        getNodes.temp.textContent = `${data.temp_c}°C`;
        toggleTemp = false;
      } else {
        getNodes.tempButton.textContent = "Celsius";
        getNodes.temp.textContent = `${data.temp_f}°F`;
        toggleTemp = true;
      }
    });
  })();

  const toggleWindSpeedUnit = (function () {
    getNodes.windSpeedButton.addEventListener("click", () => {
      if (toggleWindSpeed) {
        getNodes.windSpeedButton.textContent = "mp/h";
        getNodes.windSpeed.textContent = `${data.wind_kph} kp/h`;
        toggleWindSpeed = false;
      } else {
        getNodes.windSpeedButton.textContent = "kp/h";
        getNodes.windSpeed.textContent = `${data.wind_mph} mp/h`;
        toggleWindSpeed = true;
      }
    });
  })();
};

const setBackgroundImgs = function (location, report) {
  const dateAndTime = location.localtime.split(" ");
  const [hourStr, minStr] = dateAndTime[1].split(":");
  const hour = parseInt(hourStr, 10);
  const min = parseInt(minStr, 10);

  const earlyMorning = (function () {
    if (hour >= 5 && min >= 0 && hour <= 8 && min <= 59) {
      getNodes.displaySection.style.background =
        'url("./assets/morning.jpg") center center/cover';
    }
  })();
  const hotNoon = (function () {
    if (hour >= 9 && min >= 0 && hour <= 16 && min <= 59 && report.temp_c > 20) {
      getNodes.displaySection.style.background =
        'url("./assets/noon-sun.jpg") center center/cover';
    }
  })();
  const coldNoon = (function () {
    if (hour >= 9 && min >= 0 && hour <= 16 && min <= 59 && report.temp_c <= 20) {
      getNodes.displaySection.style.background =
        'url("./assets/cold.png") center center/cover';
    }
  })();
  const evening = (function () {
    if (hour >= 17 && min >= 0 && hour <= 20 && min <= 59) {
      getNodes.displaySection.style.background =
        'url("./assets/night.jpg") center center/cover';
    }
  })();
  const night = (function () {
    if (hour >= 21 && min >= 0 && hour <= 23 && min <= 59) {
      getNodes.displaySection.style.background =
        'url("./assets/evening.jpg") center center/cover';
    }
  })();
  const midnight = (function () {
    if (hour >= 0 && min >= 0 && hour <= 4 && min <= 59) {
      getNodes.displaySection.style.background =
        'url("./assets/midnight.jpg") center center/cover';
    }
  })();
};

const toggleSec = (function () {
  const clearSection = function () {
    getNodes.visibleChildren.forEach((child) => {
      child.style.display = "none";
    });
  };
  const defaultSection = function () {
    getNodes.visibleChildren.forEach((child) => {
      if (child.className === "heading") {
        child.style.display = "flex";
      } else {
        child.style.display = "block";
      }
      getNodes.hiddenHeader.textContent = "";
    });
  };

  return { clearSection, defaultSection };
})();

function runSearch(locationName) {
  if (locationName !== "") {
    load.showLoading();
    const extractDataAndExecute = (async function () {
      try {
        const weatherData = await getData(locationName);
        console.log(weatherData);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        load.removeLoading();
        const locationData = weatherData.location;
        const reportData = weatherData.current;

        toggleSec.defaultSection();
        displayLocationDetails(locationData);
        displayForecast(reportData);
        toggleUnits(reportData);
        setBackgroundImgs(locationData, reportData);
      } catch (error) {
        console.log(error);
        toggleSec.clearSection();
        getNodes.hiddenHeader.textContent = "Invalid spot :(";
        getNodes.displaySection.style.backgroundImage =
          "linear-gradient(to right, rgba(55, 55, 109, 0.7), rgba(52, 109, 52, 0.7), rgba(133, 100, 58, 0.7))";
      }
    })();
  } else {
    console.log("Enter som!");
  }
}

const forecast = (function () {
  getNodes.searchButton.addEventListener("click", () => {
    const locationValue = getNodes.searchInput.value.trim();
    runSearch(locationValue);
  });

  getNodes.searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const locationValue = getNodes.searchInput.value.trim();
      runSearch(locationValue);
    }
  });
})();

const giveFeedbackAtPageLoad = (function () {
  toggleSec.clearSection();
  getNodes.hiddenHeader.textContent = "Search any spot globally!";
})();

const load = (function () {
  const showLoading = function () {
    toggleSec.clearSection();
    getNodes.displaySection.style.backgroundImage =
      "linear-gradient(to right, rgba(55, 55, 109, 0.7), rgba(52, 109, 52, 0.7), rgba(133, 100, 58, 0.7))";
    getNodes.hiddenHeader.style.display = "none";
    getNodes.bouncingBall.style.display = "block";
  };

  const removeLoading = function () {
    toggleSec.defaultSection();
    getNodes.hiddenHeader.style.display = "block";
    getNodes.bouncingBall.style.display = "none";
  };

  return { showLoading, removeLoading };
})();
