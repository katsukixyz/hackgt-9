class WeatherPopup {
    constructor() {
        let weatherPopup = document.createElement("div");
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

        weatherPopup.style.pointerEvents = "visible";

        this.dayW = document.createElement("div");
        weatherPopup.appendChild(this.dayW);

        this.weatherPopup = weatherPopup;
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
            this.togglePopupVisibility();
        });
        this.weatherButton = weatherButton;
        this.lat = 0;
        this.lon = 0;
        this.date = new Date();
    }

    togglePopupVisibility() {
        if (this.weatherPopup.style.visibility === 'hidden') {
            this.weatherPopup.style.visibility = 'visible';
        } else {
            this.weatherPopup.style.visibility = 'hidden';
        }
    }

    async update() {
        console.log(this.lat);
        const dayW = await makeWeather(this.lat, this.lon, this.date);
        if (dayW) {
            this.weatherPopup.replaceChild(dayW, this.dayW);
            this.dayW = dayW;
        }
    }

    async updateWeather(lat, lon, date) {
        this.lat = lat;
        this.lon = lon;
        this.date = date;
        this.update();
    }

    async updateDateWeather(date) {
        this.date = date;
        this.update();
    }

    async updateLocWeather(lat, lon) {
        this.lat = lat;
        this.lon = lon;
        this.update();
    }

}