const curWeatherPopup = new WeatherPopup();

/**
 * 
 * @returns True if new event box currently exists, False if new event box does not currently exist
 */
const checkNewEvent = async () => {
  const box = document.querySelector(".RDlrG");

  if (!box) {
    return false;
  }

  if (box.getAttribute("data-allow-wheel-scroll") === "false") {
    return false;
  } else {
    return true;
  }
}

/**
 * Given a latitude and longitude, this function updates the existing curWeatherPopup with the new weather data for that location
 * @param {number} lat The latitude of the current location
 * @param {number} lon The longitude of the current location
 */
const updatePopup = async (lat, lon) => {
  const dialogPopup = document.querySelector(".RDlrG");
  dialogPopup.style.overflowX = "visible";
  dialogPopup.style.overflowY = "visible";
  dialogPopup.style.position = "relative";
  dialogPopup.appendChild(curWeatherPopup.weatherPopup);

  const titleElement = document.querySelector(".mvRfff");
  const dateElement = document.querySelector(".ky6s2b");
  const locationBox = document.querySelector('[aria-label="Location"]');
  //console.log(lat.toString() + " " + lon.toString())
  const observerOptions = {
    attributes: true,
  };

  const observerDate = new MutationObserver(async (mutationList, observer) => {
    const date = new Date(mutationList[mutationList.length - 1].target.textContent.split(", ")[1]);

    curWeatherPopup.updateDateWeather(date);
  });
  observerDate.observe(dateElement, observerOptions);

  const observerLoc = new MutationObserver(async (mutationList, observer) => {
    console.log(mutationList[mutationList.length - 1]);
    let address = mutationList[mutationList.length - 1].target.value.split(", ");
    while (address.length > 4) {
      address.shift();
    }

    let coord = await printCoords(address.join(", "));
    if (coord) {
      console.log("HIHIIHI");
      let [currentLat, currentLong] = coord;
      curWeatherPopup.updateLocWeather(currentLat, currentLong);
    }
  });
  observerLoc.observe(locationBox, observerOptions);

  const date = new Date(dateElement.textContent.split(", ")[1]);

  curWeatherPopup.updateWeather(lat, lon, date)
  titleElement.appendChild(curWeatherPopup.weatherButton);
};
