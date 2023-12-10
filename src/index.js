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
  // For search..
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
})();

const getData = (async function (location) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=06393eb913004a98bfe70936230812&q=${location}`,
    { mode: "cors" },
  );

  const weatherData = await response.json();
  const objectLocation = weatherData.location;
  const objectReport = weatherData.current;
})();

// const getObjectFromWeatherData = (async function () {
//   const object = await getData("London");
//   const objectLocation = object.location;
//   const objectReport = object.current;
// })();
