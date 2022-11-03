edited = false;
exists = false;
currentLat = 0;
currentLong = 0;

exists = false;
weatherPopupVisible = false;
weatherPopup = null;

const curWeatherPopup = new WeatherPopup();

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

const updatePopup = async (lat, lon) => {
  const dialogPopup = document.querySelector(".RDlrG");
  dialogPopup.style.overflowX = "visible";
  dialogPopup.style.overflowY = "visible";
  dialogPopup.style.position = "relative";
  dialogPopup.appendChild(curWeatherPopup.weatherPopup);

  const titleElement = document.querySelector(".mvRfff");
  const dateElement = document.querySelector(".ky6s2b");
  const observerOptions = {
    attributes: true,
  };

  // const observer = new MutationObserver(async (mutationList, observer) => {
  //   if (weatherPopup.firstChild) {
  //     weatherPopup.removeChild(weatherPopup.firstChild);
  //   }
  //   let next = await updateWeather();
  //   if (next) {
  //     weatherPopup.appendChild(await updateWeather());
  //   }
  // });
  // observer.observe(dateElement, observerOptions);

  curWeatherPopup.updateWeather(lat, lon)
  titleElement.appendChild(curWeatherPopup.weatherButton);
};

const listenForEvent = async () => {
  if ((await checkNewEvent()) && !exists) {
    const [currentLat, currentLong] = await getCurrentLocation.then((data) => data);

    updatePopup(currentLat, currentLong);

    exists = true;
  } else {
    if (!(await checkNewEvent())) {
      weatherPopupVisible = false;
      exists = false;
    } else if (await checkNewEvent()){
      const textBox = document.querySelector('[aria-label="Location"]');

      if (edited && textBox.ariaExpanded === "false" && textBox.value) {
        
        await new Promise(r => setTimeout(r, 200));

        let address = textBox.value.split(", ");
        while (address.length > 4) {
          address.shift();
        }

        console.log(address.join(", "));

        let coord = await printCoords(address.join(", "));
        if (coord) {
          let [currentLat, currentLong] = coord;
          curWeatherPopup.updateWeather(currentLat, currentLong);
        }
        edited = false;
      }
      edited = textBox.ariaExpanded === "true";
    }
  }

  setTimeout(listenForEvent, 250);
};

listenForEvent();
