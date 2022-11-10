const oldWeatherPopup = new WeatherPopup();

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