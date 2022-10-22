setTimeout(() => {
  const calendar = document.querySelector('[jscontroller="JjlYBf"]');
  console.log(calendar);
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
        weatherPopup.style.left = "-210px";
        weatherPopup.style.display = "flex";
        weatherPopup.style.flexDirection = "column";
        weatherPopup.style.overflow = "auto";
        weatherPopup.style.borderRadius = "8px";
        weatherPopup.style.pointerEvents = "visible";

        weatherPopup.addEventListener("click", () => console.log("clicked!"));

        //Adding hour elements to the pop up
        const hourArray = [];
        for (let i = 0; i < 24; i++) {
          hourArray.push([i, 30]);
        }

        let hourW = document.createElement("p");
        hourW.textContent =
          hourArray[0][0] + "F " + hourArray[0][1] + "% chance";
        weatherPopup.appendChild(hourW);

        for (let i = 1; i < 24; i++) {
          hourW = document.createElement("p");
          hourW.textContent =
            hourArray[i][0] + "F " + hourArray[i][1] + "% chance";
          weatherPopup.appendChild(hourW);
        }

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
