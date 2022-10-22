// const {
//   printCoords,
//   printWeather,
//   getCurrentLocation,
// } = require("./weatherRequest.js");
const printCoords = async (locationInput) => {
  locURL =
    "https://nominatim.openstreetmap.org/search?q=" +
    locationInput.replace(" ", "+") +
    "&format=xml&addressdetails=1";
  const location = await fetch(locURL)
    .then((response) => response.text())
    .then((str) => new DOMParser().parseFromString(str, "text/xml"));

  let coordinate = new Array();
  const lat = location.getElementsByTagName("place")[0].getAttribute("lat");
  coordinate.push(lat);
  const lon = location.getElementsByTagName("place")[0].getAttribute("lon");
  coordinate.push(lon);
  return coordinate;
};

const printWeather = async (latitude, longitude) => {
  url =
    "https://forecast.weather.gov/MapClick.php?" +
    "lat=" +
    latitude.toFixed(4) +
    "&lon=" +
    longitude.toFixed(4) +
    "&FcstType=digitalDWML";

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

  let combined = time.map((e, i) => {
    return [e, temperature[i], precip[i]];
  });

  return combined;
};

function success(position) {
  const crd = position.coords;
}

const getCurrentLocation = new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    resolve(await printWeather(latitude, longitude));
  });
});

setTimeout(() => {
  const calendar = document.querySelector('[jscontroller="JjlYBf"]');
  console.log(calendar);
  if (calendar) {
    calendar.addEventListener("click", (event) => {
      setTimeout(() => {
        document.querySelector(".RDlrG").style.overflowX = "visible";
        document.querySelector(".RDlrG").style.overflowY = "visible";
        const dateElements = document.querySelectorAll(".ky6s2b");
        const titleElement = document.querySelector(".mvRfff");

        //weatherPopup styling
        const weatherPopup = document.createElement("div");
        weatherPopup.style.position = "absolute";
        weatherPopup.style.padding = "20px";
        weatherPopup.style.height = "250px";
        weatherPopup.style.width = "180px";
        weatherPopup.style.zIndex = 20;
        weatherPopup.style.backgroundColor = "lightblue";
        weatherPopup.style.left = "-210px";
        weatherPopup.style.display = "flex";
        weatherPopup.style.flexDirection = "column";
        weatherPopup.style.overflow = "auto";
        weatherPopup.style.borderRadius = "8px";

        //Adding hour elements to the pop up
        let hourW = document.createElement("p");
        hourW.textContent = "Temp, Percent chance";
        weatherPopup.appendChild(hourW);

        hourW = document.createElement("p");
        getCurrentLocation.then((data) => console.log(data));
        hourW.textContent = "Temp, Percent chance";

        weatherPopup.appendChild(hourW);

        //Weather button styling
        const weatherButton = document.createElement("button");
        weatherButton.textContent = "☁️";
        weatherButton.style.position = "absolute";
        weatherButton.style.background = "rgba(255, 122, 89, 0)";
        weatherButton.style.borderStyle = "none";
        weatherButton.style.bottom = "400px";
        weatherButton.style.left = "20px";
        weatherButton.addEventListener("click", (wClickEvent) => {
          titleElement.appendChild(weatherPopup);
        });

        titleElement.appendChild(weatherButton);

        const date = new Date(dateElements[0].textContent.split(", ")[1]);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        console.log(month, day);
      }, 500);
    });
  }
}, 5000);
