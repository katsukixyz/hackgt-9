existsOld = false;

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
  dialogPopup.appendChild(curWeatherPopup.weatherPopup);

  const titleElement = document.querySelector(".wv9rPe");
  const dateElement = document.querySelector(".DN1TJ");
  
  const date = new Date(dateElement.textContent.split(", ")[1].split("⋅")[0]);

  curWeatherPopup.updateWeather(lat, lon, date)
  titleElement.appendChild(curWeatherPopup.weatherButton);
};

const listenForOldEvent = async () => {
  if ((await checkOldEvent()) && !existsOld) {
    const locat = document.querySelectorAll(".DN1TJ")[1];

    let address = locat.textContent.split(", ");
    while (address.length > 4) {
      address.shift();
    }
    let [lat, long] = await getCurrentLocation.then((data) => data);
    if (address.length !== 0) {
      let coord = await printCoords(address.join(", "));
      if (coord) {
        [lat, long] = coord;
      }
    }

    updatePopupOld(lat, long);

    existsOld = true;
  } else {
    if (!(await checkOldEvent())) {
      existsOld = false;
    } 
  }
  setTimeout(listenForOldEvent, 250);
};

listenForOldEvent();
