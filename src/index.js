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
  const overlay = document.querySelector("body > div:first-child");
  // For searchLocation()
  const searchInput = document.querySelector("input");
  const searchButton = document.querySelector(".search-sec button");
  // For displayLocationDetails()
  const continent = document.querySelector(".continent span");
  const country = document.querySelector(".country span");
  const region = document.querySelector(".region span");
  const date = document.querySelector(".date span");
  const time = document.querySelector(".time span");
  // For displayForeCast()
  const temp = document.querySelector(".temperature span:last-child");
  const tempButton = document.querySelector(".buttons-sec button:nth-child(2)");
  const windSpeed = document.querySelector(".wind-speed span:last-child");
  const windSpeedButton = document.querySelector(".buttons-sec button:nth-child(3)");
  const windDirection = document.querySelector(".wind-direction span:last-child");
  const humidity = document.querySelector(".humidity span:last-child");
  const radiation = document.querySelector(".uv span:last-child");
  const dayStatus = document.querySelector(".daylight-status span:last-child");
  // For setBackgroundImgs()
  const displaySection = document.querySelector(".main-sec");
  // For clearSection(), defaultSection()
  const locationContainer = document.querySelector(".location-details");
  const forecastContainer = document.querySelector(".weather-forecast");
  const visibleChildren = [header, locationContainer, forecastContainer];
  const hiddenHeader = document.querySelector("h2");
  // For displayLoading()
  const bouncingBall = document.querySelector(".load");
  // For setFutureDates()
  const nextDayDate = document.querySelector(".next-date legend");
  const thirdDayDate = document.querySelector(".third-date legend");
  const fourthDayDate = document.querySelector(".fourth-date legend");
  const fifthDayDate = document.querySelector(".fifth-date legend");
  const sixthDayDate = document.querySelector(".sixth-date legend");
  const lastDayDate = document.querySelector(".last-date legend");
  const futureDates = [
    nextDayDate,
    thirdDayDate,
    fourthDayDate,
    fifthDayDate,
    sixthDayDate,
    lastDayDate,
  ];
  // For swapIconForSunnyForecasts()
  const futureIcons = document.querySelectorAll(".first-sec div div");
  // For setFutureTempsC() setFutureTempsF
  const nextDayTemp = document.querySelector(".next-date span");
  const thirdDayTemp = document.querySelector(".third-date span");
  const fourthDayTemp = document.querySelector(".fourth-date span");
  const fifthDayTemp = document.querySelector(".fifth-date span");
  const sixthDayTemp = document.querySelector(".sixth-date span");
  const lastDayTemp = document.querySelector(".last-date span");
  const futureTemps = [
    nextDayTemp,
    thirdDayTemp,
    fourthDayTemp,
    fifthDayTemp,
    sixthDayTemp,
    lastDayTemp,
  ];
  // For updateFutureRainForecast()
  const futureDivs = document.querySelectorAll(".first-sec fieldset");
  // For displayRainForecast()
  const rainDate = document.querySelector(".last-sec legend");
  const clouds = document.querySelector(".clouds");
  const chanceOfRain = document.querySelector(".chance");
  const precipitation = document.querySelector(".prec");
  const rainForecastNodes = [clouds, chanceOfRain, precipitation];
  // For slideshow()
  const slideButton = document.querySelector(".buttons-sec button:first-child");

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
    futureDates,
    futureTemps,
    rainDate,
    rainForecastNodes,
    futureDivs,
    slideButton,
    futureIcons,
    overlay,
  };
})();

const getData = async function (location) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=06393eb913004a98bfe70936230812&q=${location}&days=7`,
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
    const dateAndTime = data.localtime;
    const date = new Date(dateAndTime);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    const dayOfWeek = date.toLocaleDateString("en-US", {
      weekday: "long",
    });

    getNodes.date.textContent = `${formattedDate} | ${dayOfWeek}`;
    getNodes.time.textContent = formattedTime;
  })();
};

const displayForecast = function (data) {
  const setInitialForecasts = (function () {
    getNodes.temp.innerHTML = `${data.temp_c}<em>°C</em>`;
    getNodes.windSpeed.innerHTML = `${data.wind_kph} <em>kp/h</em>`;
    getNodes.windDirection.innerHTML = `${data.wind_degree} <em>(${data.wind_dir})</em>`;
    getNodes.humidity.innerHTML = `${data.humidity}<em>%</em>`;
  })();

  const setRadiation = (function () {
    switch (true) {
      case data.uv >= 0 && data.uv <= 2:
        getNodes.radiation.innerHTML = `Low <em>(${data.uv}/11)</em>`;
        break;
      case data.uv >= 3 && data.uv <= 5:
        getNodes.radiation.innerHTML = `Moderate <em>(${data.uv}/11)</em>`;
        break;
      case data.uv >= 6 && data.uv <= 7:
        getNodes.radiation.innerHTML = `High <em>(${data.uv}/11)</em>`;
        break;
      case data.uv >= 8 && data.uv <= 10:
        getNodes.radiation.innerHTML = `Very High <em>(${data.uv}/11)</em>`;
        break;
      case data.uv >= 11:
        getNodes.radiation.innerHTML = `Extreme <em>(${data.uv}/11)</em>`;
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
      getNodes.hiddenHeader.style.display = "none";
    });
  };

  return { clearSection, defaultSection };
})();

const displayRainForecast = function (num, data) {
  getNodes.rainForecastNodes.forEach((node, index) => {
    switch (index) {
      case 0:
        node.textContent = data[num].day.condition.text;
        break;
      case 1:
        node.innerHTML = `${data[num].day.daily_chance_of_rain}<em>%<em>`;
        break;
      case 2:
        node.innerHTML = `${data[num].day.totalprecip_in} <em>in<em>`;
        break;
    }
  });
};

const forecastFuture = (function () {
  const setFutureDates = function (data) {
    function formatAndDisplayDate(num, dateLabel) {
      const newDate = new Date(data[num].date);
      const dayOfWeek = newDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      dateLabel.textContent = `⚫ ${dayOfWeek}`;
    }

    getNodes.futureDates.forEach((date, index) => {
      switch (index) {
        case 0:
          formatAndDisplayDate(1, date);
          break;
        case 1:
          formatAndDisplayDate(2, date);
          break;
        case 2:
          formatAndDisplayDate(3, date);
          break;
        case 3:
          formatAndDisplayDate(4, date);
          break;
        case 4:
          formatAndDisplayDate(5, date);
          break;
        case 5:
          formatAndDisplayDate(6, date);
          break;
      }
    });
  };

  const setFutureTempsC = function (data) {
    function displayTemp(num, tempLabel) {
      tempLabel.innerHTML = `${data[num].day.mintemp_c}°C ⤵<br> ${data[num].day.maxtemp_c}°C`;
    }

    getNodes.futureTemps.forEach((temp, index) => {
      switch (index) {
        case 0:
          displayTemp(1, temp);
          break;
        case 1:
          displayTemp(2, temp);
          break;
        case 2:
          displayTemp(3, temp);
          break;
        case 3:
          displayTemp(4, temp);
          break;
        case 4:
          displayTemp(5, temp);
          break;
        case 5:
          displayTemp(6, temp);
          break;
      }
    });
  };

  const setFutureTempsF = function (data) {
    function displayTemp(num, tempLabel) {
      tempLabel.innerHTML = `${data[num].day.mintemp_f}°F ⤵<br> ${data[num].day.maxtemp_f}°F`;
    }

    getNodes.futureTemps.forEach((temp, index) => {
      switch (index) {
        case 0:
          displayTemp(1, temp);
          break;
        case 1:
          displayTemp(2, temp);
          break;
        case 2:
          displayTemp(3, temp);
          break;
        case 3:
          displayTemp(4, temp);
          break;
        case 4:
          displayTemp(5, temp);
          break;
        case 5:
          displayTemp(6, temp);
          break;
      }
    });
  };

  const updateFutureRainForecast = function (data) {
    function formatAndDisplayDate(number) {
      const newDate = new Date(data[number].date);
      const dayOfWeek = newDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      getNodes.rainDate.textContent = dayOfWeek;
    }

    function displayOnHover(num, container) {
      container.addEventListener("mouseover", () => {
        formatAndDisplayDate(num + 1);
        displayRainForecast(num + 1, data);
      });
      container.addEventListener("mouseout", () => {
        getNodes.rainDate.textContent = "Today";
        displayRainForecast(0, data);
      });
    }

    getNodes.futureDivs.forEach((div, index) => {
      switch (index) {
        case 0:
          displayOnHover(index, div);
          break;
        case 1:
          displayOnHover(index, div);
          break;
        case 2:
          displayOnHover(index, div);
          break;
        case 3:
          displayOnHover(index, div);
          break;
        case 4:
          displayOnHover(index, div);
          break;
        case 5:
          displayOnHover(index, div);
          break;
      }
    });
  };

  const swapIconForSunnyForecasts = function (data) {
    getNodes.futureIcons.forEach((svg) => {
      svg.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-hail</title><path d="M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M10,18A2,2 0 0,1 12,20A2,2 0 0,1 10,22A2,2 0 0,1 8,20A2,2 0 0,1 10,18M14.5,16A1.5,1.5 0 0,1 16,17.5A1.5,1.5 0 0,1 14.5,19A1.5,1.5 0 0,1 13,17.5A1.5,1.5 0 0,1 14.5,16M10.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,15A1.5,1.5 0 0,1 9,13.5A1.5,1.5 0 0,1 10.5,12Z" /></svg>';
    });
    getNodes.futureIcons.forEach((icon, index) => {
      if (data[index + 1].day.condition.text === "Partly cloudy") {
        icon.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-partly-cloudy</title><path d="M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z" /></svg>';
      }
      if (data[index + 1].day.condition.text === "Sunny") {
        icon.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-sunny</title><path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z" /></svg>';
      }
      if (
        data[index + 1].day.condition.text === "Cloudy" ||
        data[index + 1].day.condition.text === "Overcast" ||
        data[index + 1].day.condition.text === "Fog" ||
        data[index + 1].day.condition.text === "Clear" ||
        data[index + 1].day.condition.text === "Mist"
      ) {
        icon.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-fog</title><path d="M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z" /></svg>';
      }
      if (data[index + 1].day.condition.text.includes("snow")) {
        icon.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-snowy-heavy</title><path d="M4,16.36C3.86,15.82 4.18,15.25 4.73,15.11L7,14.5L5.33,12.86C4.93,12.46 4.93,11.81 5.33,11.4C5.73,11 6.4,11 6.79,11.4L8.45,13.05L9.04,10.8C9.18,10.24 9.75,9.92 10.29,10.07C10.85,10.21 11.17,10.78 11,11.33L10.42,13.58L12.67,13C13.22,12.83 13.79,13.15 13.93,13.71C14.08,14.25 13.76,14.82 13.2,14.96L10.95,15.55L12.6,17.21C13,17.6 13,18.27 12.6,18.67C12.2,19.07 11.54,19.07 11.15,18.67L9.5,17L8.89,19.27C8.75,19.83 8.18,20.14 7.64,20C7.08,19.86 6.77,19.29 6.91,18.74L7.5,16.5L5.26,17.09C4.71,17.23 4.14,16.92 4,16.36M1,10A5,5 0 0,1 6,5C7,2.65 9.3,1 12,1C15.43,1 18.24,3.66 18.5,7.03L19,7A4,4 0 0,1 23,11A4,4 0 0,1 19,15A1,1 0 0,1 18,14A1,1 0 0,1 19,13A2,2 0 0,0 21,11A2,2 0 0,0 19,9H17V8A5,5 0 0,0 12,3C9.5,3 7.45,4.82 7.06,7.19C6.73,7.07 6.37,7 6,7A3,3 0 0,0 3,10C3,10.85 3.35,11.61 3.91,12.16C4.27,12.55 4.26,13.16 3.88,13.54C3.5,13.93 2.85,13.93 2.47,13.54C1.56,12.63 1,11.38 1,10M14.03,20.43C14.13,20.82 14.5,21.04 14.91,20.94L16.5,20.5L16.06,22.09C15.96,22.5 16.18,22.87 16.57,22.97C16.95,23.08 17.35,22.85 17.45,22.46L17.86,20.89L19.03,22.05C19.3,22.33 19.77,22.33 20.05,22.05C20.33,21.77 20.33,21.3 20.05,21.03L18.89,19.86L20.46,19.45C20.85,19.35 21.08,18.95 20.97,18.57C20.87,18.18 20.5,17.96 20.09,18.06L18.5,18.5L18.94,16.91C19.04,16.5 18.82,16.13 18.43,16.03C18.05,15.92 17.65,16.15 17.55,16.54L17.14,18.11L15.97,16.95C15.7,16.67 15.23,16.67 14.95,16.95C14.67,17.24 14.67,17.7 14.95,17.97L16.11,19.14L14.54,19.55C14.15,19.65 13.92,20.05 14.03,20.43Z" /></svg>';
      }
      if (
        data[index + 1].day.condition.text === "Blizzard" ||
        data[index + 1].day.condition.text.includes("Thundery")
      ) {
        icon.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-tornado</title><path d="M21,5H3A1,1 0 0,1 2,4A1,1 0 0,1 3,3H21A1,1 0 0,1 22,4A1,1 0 0,1 21,5M20,8A1,1 0 0,0 19,7H5A1,1 0 0,0 4,8A1,1 0 0,0 5,9H19A1,1 0 0,0 20,8M21,12A1,1 0 0,0 20,11H10A1,1 0 0,0 9,12A1,1 0 0,0 10,13H20A1,1 0 0,0 21,12M16,16A1,1 0 0,0 15,15H9A1,1 0 0,0 8,16A1,1 0 0,0 9,17H15A1,1 0 0,0 16,16M13,20A1,1 0 0,0 12,19H10A1,1 0 0,0 9,20A1,1 0 0,0 10,21H12A1,1 0 0,0 13,20Z" /></svg>';
      }
    });
  };

  return {
    setFutureDates,
    setFutureTempsC,
    setFutureTempsF,
    updateFutureRainForecast,
    swapIconForSunnyForecasts,
  };
})();

const toggleUnits = function (data, futureData) {
  let toggleTemp = false;
  let toggleWindSpeed = false;

  const toggleTempUnit = (function () {
    getNodes.tempButton.textContent = "°F"; // Set to default at pageload
    getNodes.tempButton.addEventListener("click", () => {
      if (toggleTemp) {
        getNodes.tempButton.textContent = "°F";
        getNodes.temp.innerHTML = `${data.temp_c}<em>°C</em>`;
        forecastFuture.setFutureTempsC(futureData);
        toggleTemp = false;
      } else {
        getNodes.tempButton.textContent = "°C";
        getNodes.temp.innerHTML = `${data.temp_f}<em>°F</em>`;
        forecastFuture.setFutureTempsF(futureData);
        toggleTemp = true;
      }
    });
  })();

  const toggleWindSpeedUnit = (function () {
    getNodes.windSpeedButton.textContent = "mp/h"; // Set to default at pageload
    getNodes.windSpeedButton.addEventListener("click", () => {
      if (toggleWindSpeed) {
        getNodes.windSpeedButton.textContent = "mp/h";
        getNodes.windSpeed.innerHTML = `${data.wind_kph} <em>kp/h</em>`;
        toggleWindSpeed = false;
      } else {
        getNodes.windSpeedButton.textContent = "kp/h";
        getNodes.windSpeed.innerHTML = `${data.wind_mph} <em>mp/h</em>`;
        toggleWindSpeed = true;
      }
    });
  })();
};

let isLooping = false;
let previousLoop = null;
const slideshow = function (data) {
  function formatAndDisplayDate(number) {
    const newDate = new Date(data[number].date);
    const dayOfWeek = newDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    getNodes.rainDate.textContent = dayOfWeek;
  }

  const loopDivs = async function () {
    // Wait for previous loop to complete
    if (isLooping) return;
    isLooping = true;

    try {
      let index = 0;
      for (const div of getNodes.futureDivs) {
        div.classList.add("scale-up");
        if (div.classList.contains("scale-up")) {
          formatAndDisplayDate(index + 1);
          displayRainForecast(index + 1, data);
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        div.classList.remove("scale-up");
        index += 1;
      }
    } catch (error) {
      console.log(error);
    } finally {
      getNodes.rainDate.textContent = "Today";
      displayRainForecast(0, data);
      isLooping = false;
    }
  };

  const waitToFinishLoopOnclick = (async function () {
    // Remove previous loop event and update with current
    getNodes.slideButton.removeEventListener("click", previousLoop);
    previousLoop = loopDivs;
    getNodes.slideButton.addEventListener("click", loopDivs);

    getNodes.slideButton.addEventListener("click", async () => {
      const haltInteraction = (function () {
        getNodes.searchInput.style.backgroundColor = "rgb(190, 190, 190)";
        getNodes.searchButton.style.color = "grey";
        getNodes.searchInput.style.pointerEvents = "none";
        getNodes.searchButton.style.pointerEvents = "none";
      })();
      await new Promise((resolve) => setTimeout(resolve, 12000));

      const defaultInteraction = (function () {
        getNodes.searchInput.style.pointerEvents = "auto";
        getNodes.searchInput.style.backgroundColor = "white";
        getNodes.searchInput.addEventListener("mouseover", () => {
          getNodes.searchInput.style.backgroundColor = "rgb(197, 223, 223)";
        });
        getNodes.searchInput.addEventListener("mouseout", () => {
          getNodes.searchInput.style.backgroundColor = "white";
        });

        getNodes.searchButton.style.pointerEvents = "auto";
        getNodes.searchButton.style.color = "white";
        getNodes.searchButton.addEventListener("mouseover", () => {
          getNodes.searchButton.style.backgroundColor = "rgb(0, 88, 88)";
        });
        getNodes.searchButton.addEventListener("mouseout", () => {
          getNodes.searchButton.style.backgroundColor = "white";
        });
      })();
    });
  })();
};

function runSearch(locationName) {
  if (locationName !== "") {
    load.showLoading();
    const extractDataAndExecute = (async function () {
      try {
        const weatherData = await getData(locationName);
        // console.log(weatherData);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        load.removeLoading();
        getNodes.overlay.style.zIndex = "auto";
        const locationData = weatherData.location;
        const reportData = weatherData.current;
        const futureData = weatherData.forecast.forecastday;

        toggleSec.defaultSection();
        displayLocationDetails(locationData);
        displayForecast(reportData);
        toggleUnits(reportData, futureData);
        setBackgroundImgs(locationData, reportData);
        displayRainForecast(0, futureData);
        forecastFuture.setFutureDates(futureData);
        forecastFuture.setFutureTempsC(futureData);
        forecastFuture.updateFutureRainForecast(futureData);
        forecastFuture.swapIconForSunnyForecasts(futureData);
        slideshow(futureData);
      } catch (error) {
        console.log(error);
        toggleSec.clearSection();
        getNodes.overlay.style.zIndex = "3";
        getNodes.hiddenHeader.textContent = "Invalid location :(";
        getNodes.displaySection.style.backgroundImage =
          "linear-gradient(to right, rgba(55, 55, 109, 0.4), rgba(52, 109, 52, 0.4), rgba(133, 100, 58, 0.4))";
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

const load = (function () {
  const showLoading = function () {
    toggleSec.clearSection();
    getNodes.displaySection.style.backgroundImage =
      "linear-gradient(to right, rgba(55, 55, 109, 0.4), rgba(52, 109, 52, 0.4), rgba(133, 100, 58, 0.4))";
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

const setDefaultLocationAtPageLoad = (function () {
  runSearch("Ottawa");
})();
