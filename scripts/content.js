edited = false;
exists = false;
currentLat = 0;
currentLong = 0;

exists = false;
weatherPopupVisible = false;
weatherPopup = null;

const updateWeather = async () => {
  const dateElements = document.querySelectorAll(".ky6s2b");

  const date = new Date(dateElements[0].textContent.split(", ")[1]);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const weekData = await printWeather(currentLat, currentLong);

  if (!weekData) {
    return;
  }

  const dayData =
    weekData[
      `${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`
    ];

  const dayW = document.createElement("div");

  const formatDate = `2022-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;
  const dayFetchUrl =
    "https://api.sunrise-sunset.org/json?lat=" +
    currentLat +
    "&lng=" +
    currentLong +
    "&date=" +
    formatDate;

  const sunsetRes = await fetch(dayFetchUrl);
  const sunsetData = await sunsetRes.json();

  if (dayData != undefined) {
    dayData.forEach((hour) => {
      hour.push(isDay(sunsetData, hour[0] + ":00"));
    });

    dayData.forEach((hour) => {
      const [hIndex, hTemp, hPrecip, hCloud, hIsDay] = hour;

      const hourW = document.createElement("div");
      hourW.style.display = "flex";
      hourW.style.flexDirection = "row";
      hourW.style.alignItems = "center";
      hourW.style.justifyContent = "space-between";

      const parsedH = parseInt(hIndex);
      const am = parsedH < 12;

      const time = document.createElement("p");
      time.textContent = `${
        am
          ? parsedH === 0
            ? "12"
            : parsedH
          : parsedH === 12
          ? parsedH
          : parsedH - 12
      } ${am ? "AM" : "PM"}`;
      time.style.width = "42px";
      time.style.textAlign = "right";

      const icon = document.createElement("div");
      icon.style.display = "flex";
      icon.style.flexDirection = "column";
      icon.style.justifyContent = "center";
      icon.style.alignItems = "center";
      icon.style.height = "40px";

      const roundedPrecip = Math.floor(Math.round(hPrecip) / 10) * 10;

      const iconImage = document.createElement("img");
      //hCloud, hIsDay
      
      /*
      if (hIsDay) {
        iconImage.src = chrome.runtime.getURL("images/sunny.png");
      } else {
        iconImage.src = chrome.runtime.getURL("images/night.png");
      }*/

      iconImage.src = findIcon(roundedPrecip, hIsDay, hCloud);
      
      iconImage.style.height = "25px";
      iconImage.style.border = "none";
      iconImage.style.padding = 0;
      iconImage.style.margin = 0;
      icon.appendChild(iconImage);

      if (roundedPrecip > 0) {
        const iconPercent = document.createElement("p");
        iconPercent.style.fontSize = "12px";
        iconPercent.style.border = "none";
        iconPercent.style.padding = 0;
        iconPercent.style.margin = 0;
        iconPercent.textContent = `${roundedPrecip}%`;
        icon.appendChild(iconPercent);
      }

      const temp = document.createElement("p");
      temp.textContent = `${hTemp}°`;

      hourW.appendChild(time);
      hourW.appendChild(icon);
      hourW.appendChild(temp);

      dayW.appendChild(hourW);
    });
  }

  return dayW;
};

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

const updatePopup = async () => {
  const dialogPopup = document.querySelector(".RDlrG");
  dialogPopup.style.overflowX = "visible";
  dialogPopup.style.overflowY = "visible";
  dialogPopup.style.position = "relative";

  const titleElement = document.querySelector(".mvRfff");
  const dateElement = document.querySelector(".ky6s2b");
  const observerOptions = {
    attributes: true,
  };

  const observer = new MutationObserver(async (mutationList, observer) => {
    if (weatherPopup.firstChild) {
      weatherPopup.removeChild(weatherPopup.firstChild);
    }
    let next = await updateWeather();
    if (next) {
      weatherPopup.appendChild(await updateWeather());
    }
  });
  observer.observe(dateElement, observerOptions);

  //weatherPopup styling
  weatherPopup = document.createElement("div");
  weatherPopup.style.position = "absolute";
  weatherPopup.style.padding = "20px";
  weatherPopup.style.height = "250px";
  weatherPopup.style.width = "180px";
  weatherPopup.style.zIndex = "20";
  weatherPopup.style.backgroundColor = "white";
  weatherPopup.style.boxShadow =
    "0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%), 0px 11px 15px -7px rgb(0 0 0 / 20%)";
  weatherPopup.style.left = "-220px";
  weatherPopup.style.display = "flex";
  weatherPopup.style.flexDirection = "column";
  weatherPopup.style.overflow = "auto";
  weatherPopup.style.borderRadius = "8px";
  weatherPopup.classList.add("weatherPopup");

  //initial leftRight styling
  let element = document.querySelector(".RDlrG");
  let bodyRect = document.body.getBoundingClientRect();
  let elemRect = element.getBoundingClientRect();
  let offset = elemRect.left - bodyRect.left;

  if (offset <= 270) {
    weatherPopup.style.removeProperty("left");
    weatherPopup.style.right = "-220px";
  } else {
    weatherPopup.style.removeProperty("right");
    weatherPopup.style.left = "-220px";
  }

  weatherPopup.style.pointerEvents = "visible";

  const dayW = await updateWeather();

  if (dayW) {
    weatherPopup.appendChild(dayW);
  }

  //Weather button styling
  const weatherButton = document.createElement("img");
  weatherButton.src = chrome.runtime.getURL("images/button.png");

  weatherButton.style.position = "absolute";
  weatherButton.style.height = "22px";
  weatherButton.style.width = "22px";
  weatherButton.style.background = "rgba(255, 122, 89, 0)";
  weatherButton.style.zIndex = "20";
  weatherButton.style.borderStyle = "none";
  weatherButton.style.top = "100px";
  weatherButton.style.left = "16px";
  weatherButton.style.padding = "8px";
  weatherButton.style.borderRadius = "6px";
  weatherButton.addEventListener("mouseover", () => {
    weatherButton.style.background = "#F7F6F6";
    weatherButton.style.cursor = "pointer";
  });
  weatherButton.addEventListener("mouseleave", () => {
    weatherButton.style.background = "rgba(255, 122, 89, 0)";
    weatherButton.style.cursor = "auto";
  });

  weatherButton.addEventListener("click", (wClickEvent) => {
    if (weatherPopupVisible) {
      dialogPopup.removeChild(weatherPopup);
      weatherPopupVisible = false;
    } else {
      dialogPopup.appendChild(weatherPopup);
      weatherPopupVisible = true;
    }
  });
  titleElement.appendChild(weatherButton);
};

const listenForEvent = async () => {
  if ((await checkNewEvent()) && !exists) {
    [currentLat, currentLong] = await getCurrentLocation.then((data) => data);

    updatePopup();

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
          [currentLat, currentLong] = coord;
          console.log(weatherPopup);

          if (weatherPopup.firstChild) {
            weatherPopup.removeChild(weatherPopup.firstChild);
          }
          let next = await updateWeather();
          if (next) {
            weatherPopup.appendChild(next);
          }
        }
        edited = false;
      }
      edited = textBox.ariaExpanded === "true";
    }
  }

  setTimeout(listenForEvent, 250);
};

listenForEvent();
