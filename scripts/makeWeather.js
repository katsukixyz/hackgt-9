const makeWeather = async (currentLat, currentLong, date) => {
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

  console.log(dayData);

  const dayW = document.createElement("div");

  const formatDate = `2022-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day
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
      const [hIndex, hTemp, hPrecip, hCloud, hInclement, hIsDay] = hour;

      const hourW = document.createElement("div");
      hourW.style.display = "flex";
      hourW.style.flexDirection = "row";
      hourW.style.alignItems = "center";
      hourW.style.justifyContent = "space-between";

      const parsedH = parseInt(hIndex);
      const am = parsedH < 12;

      const time = document.createElement("p");
      time.textContent = `${am
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

      iconImage.src = findIcon(roundedPrecip, hIsDay, hCloud, hInclement);

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

  console.log(dayW);
  return dayW;
};