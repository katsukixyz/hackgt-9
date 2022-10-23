weatherOldPopupVisible = false;
weatherOldPopup = null;
dialogOldPopup = null;
existsOld = false;
oldLoc = "";

const updateWeatherOld = async () => {
  const dateElements = document.querySelectorAll(".DN1TJ");
  console.log(dateElements[0].textContent.split(", ")[1].split("⋅")[0]);

  const date = new Date(dateElements[0].textContent.split(", ")[1].split("⋅")[0]);

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
      
      if (roundedPrecip >= 60) {
        iconImage.src = chrome.runtime.getURL("images/rain.png");
      } else if (roundedPrecip >= 30) {
        if (hIsDay) {
          iconImage.src = chrome.runtime.getURL("images/rain_s_sunny.png");
        } else {
          iconImage.src = chrome.runtime.getURL("images/rain_night.png");
        }
      } else if (hCloud >= 70) {
        iconImage.src = chrome.runtime.getURL("images/cloudy.png");
      } else if (hCloud >= 30) {
        if (hIsDay) {
          iconImage.src = chrome.runtime.getURL("images/partly_cloudy.png");
        } else {
          iconImage.src = chrome.runtime.getURL("images/cloudy_night.png");
        }
      } else {
        if (hIsDay) {
          iconImage.src = chrome.runtime.getURL("images/sunny.png");
        } else {
          iconImage.src = chrome.runtime.getURL("images/night.png");
        }
      }
      


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



const updatePopupOld = async () => {
  dialogOldPopup = document.querySelector(".RDlrG");
  dialogOldPopup.style.overflowX = "visible";
  dialogOldPopup.style.overflowY = "visible";
  dialogOldPopup.style.position = "relative";


  const titleElement = document.querySelector(".wv9rPe");

  //weatherOldPopup styling
  weatherOldPopup = document.createElement("div");
  weatherOldPopup.style.position = "absolute";
  weatherOldPopup.style.padding = "20px";
  weatherOldPopup.style.height = "250px";
  weatherOldPopup.style.width = "180px";
  weatherOldPopup.style.zIndex = "20";
  weatherOldPopup.style.backgroundColor = "white";
  weatherOldPopup.style.boxShadow =
    "0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%), 0px 11px 15px -7px rgb(0 0 0 / 20%)";
  weatherOldPopup.style.left = "-220px";
  weatherOldPopup.style.display = "flex";
  weatherOldPopup.style.flexDirection = "column";
  weatherOldPopup.style.overflow = "auto";
  weatherOldPopup.style.borderRadius = "8px";
  weatherOldPopup.classList.add("weatherOldPopup");

  //initial leftRight styling
  let element = document.querySelector(".RDlrG");
  let bodyRect = document.body.getBoundingClientRect();
  let elemRect = element.getBoundingClientRect();
  let offset = elemRect.left - bodyRect.left;

  if (offset <= 270) {
    weatherOldPopup.style.removeProperty("left");
    weatherOldPopup.style.right = "-220px";
  } else {
    weatherOldPopup.style.removeProperty("right");
    weatherOldPopup.style.left = "-220px";
  }

  weatherOldPopup.style.pointerEvents = "visible";

  const locat = document.querySelectorAll(".DN1TJ")[1];
  let address = locat.textContent.split(", ");
  
    while (address.length > 4) {
        address.shift();
    }
    oldLoc = address.join(", ");
    let coord = await printCoords(address.join(", "));
    if (coord) {
        [currentLat, currentLong] = coord;
    }

  const dayW = await updateWeatherOld();

  if (dayW) {
    weatherOldPopup.appendChild(dayW);
    console.log("HI")
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
  weatherButton.style.top = "80px";
  weatherButton.style.left = "20px";
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
    if (weatherOldPopupVisible) {
        dialogOldPopup.removeChild(weatherOldPopup);
      weatherOldPopupVisible = false;
    } else {
        dialogOldPopup.appendChild(weatherOldPopup);
      weatherOldPopupVisible = true;
    }
  });
  titleElement.appendChild(weatherButton);
};

const listenForOldEvent = async () => {
  if ((await checkOldEvent()) && !existsOld) {
    [currentLat, currentLong] = await getCurrentLocation.then((data) => data);

    updatePopupOld();

    existsOld = true;
  } else {
    if (!(await checkOldEvent())) {
      weatherOldPopupVisible = false;
      existsOld = false;
    } else if (await checkOldEvent()){
        const locat = document.querySelectorAll(".DN1TJ")[1];

        let address = locat.textContent.split(", ");
        while (address.length > 4) {
          address.shift();
        }
        if (address.join(", ") != oldLoc) {
            oldLoc = address.join(", ");
            console.log(address.join(", "));

            let coord = await printCoords(address.join(", "));
            if (coord) {
                [currentLat, currentLong] = coord;
                console.log(weatherOldPopup);

                if (weatherOldPopup.firstChild) {
                    weatherOldPopup.removeChild(weatherOldPopup.firstChild);
                }
                if (weatherOldPopupVisible) {
                    dialogOldPopup.removeChild(weatherOldPopup);
                }
                weatherOldPopupVisible = false;
                await updatePopupOld();
            }
        }
      }
    }

  setTimeout(listenForOldEvent, 250);
};

listenForOldEvent();
