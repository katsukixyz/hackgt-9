let tZone = 0;
// day = "YYYY-MM-DD"
// time = "HH:MM"

const isDay = (data, time) => {
    let sunrise = data.results.sunrise;
    let sunset = data.results.sunset;
    let riseHour = parseInt(sunrise.split(":")[0]);
    let half = (sunrise.split(":")[2]).split(" ")[1];
    //console.log("GMT Rise: ", riseHour);
    if (half === "PM" && riseHour != 12) {
      riseHour += 12;
    }
  
    riseHour += 24 - tZone;
    riseHour %= 24;
    //console.log("Adjusted Rise: ", riseHour);
  
    let riseMin = parseInt(sunrise.split(":")[1]);
    let setHour = parseInt(sunset.split(":")[0]);
    //console.log("GMT Set: ", setHour);
    half = (sunset.split(":")[2]).split(" ")[1];
    //console.log("GMT Half: ", half);
    if (half === "PM" && setHour != 12) {
      setHour += 12;
    }
    if (half === "AM" && setHour == 12) {
      setHour += 12;
    }
    setHour += 24 - tZone;
    setHour %= 24;
    //console.log("Adjusted Set: ", setHour);
    let setMin = parseInt(sunset.split(":")[1]);
    let timeHour = parseInt(time.split(":")[0]);
    let timeMin = parseInt(time.split(":")[1]);
  
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
  
    if (weather.getElementsByTagName("parsererror").length > 0) {
      return null;
    }
  
    let time = new Array();
  
    //console.log(weather);
  
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
      tZone = parseInt(time[i].slice(20, 22));
      //console.log(time[i].slice(20, 22));
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

const getCurrentLocation = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      resolve([latitude, longitude]);
    });
  });
  