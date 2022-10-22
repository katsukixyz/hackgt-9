setTimeout(() => {
  const calendar = document.querySelector('[jscontroller="JjlYBf"]');
  if (calendar) {
    calendar.addEventListener("click", (event) => {
      setTimeout(() => {
        const dialogPopup = document.querySelector(".RDlrG");
        dialogPopup.style.overflowX = "visible";
        dialogPopup.style.overflowY = "visible";
        const dateElements = document.querySelectorAll(".ky6s2b");
        const titleElement = document.querySelector(".mvRfff");

        //weatherPopup styling
        const weatherPopup = document.createElement("div");
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
        weatherPopup.style.pointerEvents = "visible";

        //Adding hour elements to the pop up
        const hourArray = [];
        for (let i = 0; i < 24; i++) {
          hourArray.push([i, 30]);
        }

        const dayW = document.createElement("div");
        hourArray.forEach((hour) => {
          const hourW = document.createElement("div");
          hourW.style.display = "flex";
          hourW.style.flexDirection = "row";
          hourW.style.alignItems = "center";
          hourW.style.justifyContent = "space-between";

          const time = document.createElement("p");
          time.textContent = "2:00pm";

          const icon = document.createElement("div");
          icon.style.display = "flex";
          icon.style.flexDirection = "column";
          icon.style.alignItems = "center";

          const iconImage = document.createElement("img");
          iconImage.src = chrome.runtime.getURL("images/rain_s_sunny.png");
          iconImage.style.height = "25px";
          iconImage.style.border = "none";
          iconImage.style.padding = 0;
          iconImage.style.margin = 0;
          const iconPercent = document.createElement("p");
          iconPercent.style.fontSize = "12px";
          iconPercent.style.border = "none";
          iconPercent.style.padding = 0;
          iconPercent.style.margin = 0;
          iconPercent.textContent = "30%";
          icon.appendChild(iconImage);
          icon.appendChild(iconPercent);

          const temp = document.createElement("p");
          temp.textContent = "47°";

          hourW.appendChild(time);
          hourW.appendChild(icon);
          hourW.appendChild(temp);

          dayW.appendChild(hourW);
        });
        weatherPopup.appendChild(dayW);

        //Weather button styling
        const weatherButton = document.createElement("button");
        weatherButton.textContent = "☁️";
        weatherButton.style.position = "absolute";
        weatherButton.style.background = "rgba(255, 122, 89, 0)";
        weatherButton.style.zIndex = "20";
        weatherButton.style.borderStyle = "none";
        weatherButton.style.top = "100px";
        weatherButton.style.left = "20px";
        weatherButton.addEventListener("click", (wClickEvent) => {
          dialogPopup.appendChild(weatherPopup);
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
