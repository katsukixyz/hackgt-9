const oldWeatherPopup = new WeatherPopup();

/**
 * 
 * @returns True if old event box currently exists, False if old event box does not currently exist
 */
const checkOldEvent = async () => {
  const box = document.querySelector(".RDlrG");

  if (!box) {
    return false;
  }

  if (box.getAttribute("data-allow-wheel-scroll") === "true") {
    return false;
  } else {
    return true;
  }
}

/**
 * Given a latitude and longitude, this function updates the existing oldWeatherPopup with the new weather data for that location
 * @param {number} lat The latitude of the current location
 * @param {number} lon The longitude of the current location
 */
const updatePopupOld = async (lat, lon) => {
  const dialogPopup = document.querySelector(".RDlrG");
  dialogPopup.style.overflowX = "visible";
  dialogPopup.style.overflowY = "visible";
  dialogPopup.style.position = "relative";
  dialogPopup.appendChild(oldWeatherPopup.weatherPopup);

  const titleElement = document.querySelector(".wv9rPe");
  const dateElement = document.querySelector(".DN1TJ");

  const date = new Date(dateElement.textContent.split(", ")[1].split("⋅")[0]);

  oldWeatherPopup.updateWeather(lat, lon, date)
  titleElement.appendChild(oldWeatherPopup.weatherButton);
};