exists = false;
eventType = null;

const curWeatherPopup = new WeatherPopup();

/**
 * 
 * @returns Array with two values, if box exists output[0] is true and output[1] is the type of event (old or new). If box does not exist,
 * then output[0] is false and output[1] is null.
 */
const checkNewEvent = async () => {
  const box = document.querySelector(".RDlrG");
  
  if (!box) {
    return [false, null];
  }

  if (box.getAttribute("data-allow-wheel-scroll") === "false") {
    return [true, "old"];
  } else {
    return [true, "new"];
  }
}

const updatePopup = async (lat, lon, eType) => {
  const dialogPopup = document.querySelector(".RDlrG");
  dialogPopup.style.overflowX = "visible";
  dialogPopup.style.overflowY = "visible";
  dialogPopup.style.position = "relative";
  dialogPopup.appendChild(curWeatherPopup.weatherPopup);



  if (eType === "new") {
    let titleElement = document.querySelector(".mvRfff");
    let dateElement = document.querySelector(".ky6s2b");
    let locationBox = document.querySelector('[aria-label="Location"]');
  } else {
    
  }

  const observerOptions = {
    attributes: true,
  };

  const observerDate = new MutationObserver(async (mutationList, observer) => {
    const date = new Date(mutationList[mutationList.length-1].target.textContent.split(", ")[1]);

    curWeatherPopup.updateDateWeather(date);
  });
  observerDate.observe(dateElement, observerOptions);

  const observerLoc = new MutationObserver(async (mutationList, observer) => {
    console.log(mutationList[mutationList.length-1]);
    let address = mutationList[mutationList.length-1].target.value.split(", ");
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

const listenForEvent = async () => {
  if ((await checkNewEvent())[0] && !exists) {
    const [currentLat, currentLong] = await getCurrentLocation.then((data) => data);

    updatePopup(currentLat, currentLong);

    exists = true;
  } else {
    if ((await checkNewEvent())[0] === false) {
      exists = false;
    }
  }
  setTimeout(listenForEvent, 250);
};

listenForEvent();
