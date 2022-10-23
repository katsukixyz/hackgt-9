// day = "YYYY-MM-DD"
// time = "HH:MM"
const isDay = (data, time) => {
  let sunrise = data.results.sunrise;
  let sunset = data.results.sunset;
  let riseHour = parseInt(sunrise.split(":")[0]);
  let riseMin = parseInt(sunrise.split(":")[1]);
  let setHour = parseInt(sunset.split(":")[0]);
  let setMin = parseInt(sunset.split(":")[1]);
  let timeHour = parseInt(time.split(":")[0]);
  let timeMin = parseInt(time.split(":")[1]);
  //console.log(riseHour, riseMin, setHour, setMin, timeHour, timeMin);
  if (riseHour < timeHour && timeHour < setHour) {
    return true;
  }
  if (riseHour == timeHour && riseMin < timeMin) {
    return true;
  }
  if (timeHour == setHour && timeMin < setMin) {
    return true;
  }
  return false;
};

const printCoords = async (locationInput) => {
  locURL =
    "https://nominatim.openstreetmap.org/search?q=" +
    locationInput.replace(" ", "+") +
    "&format=xml&addressdetails=1";
  const location = await fetch(locURL)
    .then((response) => response.text())
    .then((str) => new DOMParser().parseFromString(str, "text/xml"));

  if (location.getElementsByTagName("place").length === 0) {
    return null;
  } else {
    const lat = parseFloat(
      location.getElementsByTagName("place")[0].getAttribute("lat")
    );
    const lon = parseFloat(
      location.getElementsByTagName("place")[0].getAttribute("lon")
    );
    return [lat, lon];
  }
};

const printWeather = async (latitude, longitude) => {
  console.log(latitude);
  console.log(longitude);
  url =
    "https://forecast.weather.gov/MapClick.php?" +
    "lat=" +
    latitude.toFixed(4) +
    "&lon=" +
    longitude.toFixed(4) +
    "&FcstType=digitalDWML";

  let dict = {};

  // get xml of website with data
  const weather = await fetch(url)
    .then((response) => response.text())
    .then((str) => new DOMParser().parseFromString(str, "text/xml"));

  let time = new Array();

  const dateTimes = weather.getElementsByTagName("time-layout")[0].childNodes;
  dateTimes.forEach((node) => {
    if (node.tagName === "start-valid-time") {
      time.push(node["innerHTML"]);
    }
  });

  let precip = new Array();

  const chanceOfPrecip = weather.getElementsByTagName(
    "probability-of-precipitation"
  )[0].childNodes;
  chanceOfPrecip.forEach((node) => {
    precip.push(parseInt(node["innerHTML"]));
  });

  let temperature = new Array();

  const temperatureValues =
    weather.getElementsByTagName("temperature")[2].childNodes;
  temperatureValues.forEach((node) => {
    temperature.push(parseInt(node["innerHTML"]));
  });

  let cloudCover = new Array();
  const cloudCoverValues =
    weather.getElementsByTagName("cloud-amount")[0].childNodes;

  cloudCoverValues.forEach((node) => {
    cloudCover.push(
      Math.floor(Math.round(parseInt(node["innerHTML"])) / 10) * 10
    );
  });

  for (let i = 0; i < time.length; i++) {
    let curTime = time[i].slice(11, 13);
    if (time[i].slice(5, 10) in dict == false) {
      dict[time[i].slice(5, 10)] = new Array();
    }
    dict[time[i].slice(5, 10)].push([
      curTime,
      temperature[i],
      precip[i],
      cloudCover[i],
    ]);
  }
  return dict;
};

edited = false;
exists = false;
currentLat = 0;
currentLong = 0;

const getCurrentLocation = new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    resolve([latitude, longitude]);
  });
});

exists = false;
weatherPopupVisible = false;
weatherPopup = null;

const updateWeather = async () => {
  const dateElements = document.querySelectorAll(".ky6s2b");

  const date = new Date(dateElements[0].textContent.split(", ")[1]);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const weekData = await printWeather(currentLat, currentLong);
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
      if (roundedPrecip <= 50 && roundedPrecip >= 10) {
        iconImage.src = chrome.runtime.getURL("images/rain_s_sunny.png");
      } else if (roundedPrecip === 0) {
        iconImage.src = chrome.runtime.getURL("images/sunny.png");
      } else {
        iconImage.src = chrome.runtime.getURL("images/rain.png");
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
    attributes: true
  }

  const observer = new MutationObserver(async (mutationList, observer) => {
    weatherPopup.removeChild(weatherPopup.firstChild);
    weatherPopup.appendChild(await updateWeather());
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

  weatherPopup.appendChild(dayW);

  //Weather button styling
  const weatherButton = document.createElement("img");
  // weatherButton.textContent = "☁️";
  weatherButton.src = "images/button.svg";

  weatherButton.style.position = "absolute";
  weatherButton.style.background = "rgba(255, 122, 89, 0)";
  weatherButton.style.zIndex = "20";
  weatherButton.style.borderStyle = "none";
  weatherButton.style.top = "100px";
  weatherButton.style.left = "20px";

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

          weatherPopup.removeChild(weatherPopup.firstChild);
          weatherPopup.appendChild(await updateWeather());
        }
        edited = false;
      }
      edited = textBox.ariaExpanded === "true";
    }
  }

  setTimeout(listenForEvent, 250);
};

listenForEvent();

