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

        const weatherPopup = document.createElement("div");
        weatherPopup.style.position = "absolute";
        weatherPopup.style.padding = "20px";
        weatherPopup.style.zIndex = 20;
        weatherPopup.style.backgroundColor = "blue";
        weatherPopup.style.left = "-30px";

        const weatherButton = document.createElement("button");
        weatherButton.textContent = "JOEJOEJOEJOE";
        weatherButton.style.position = "absolute";
        weatherButton.style.left = "30px";
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
