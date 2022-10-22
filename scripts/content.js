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

        for (let i = 0; i < 15; i++) {
          hourW = document.createElement("p");
          hourW.textContent = "Temp, Percent chance";
          weatherPopup.appendChild(hourW);
        }

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
