const printWeather = async (latitude, longitude) => {
    url = "https://forecast.weather.gov/MapClick.php?" + "lat=" + latitude.toFixed(4) + "&lon=" + longitude.toFixed(4) + "&FcstType=digitalDWML";

    // get xml of website with data
    const weather = await fetch(url)
            .then(response => response.text())
            .then(str => new DOMParser().parseFromString(str, "text/xml"));
    
    let time = new Array();

    const dateTimes = weather.getElementsByTagName("time-layout")[0].childNodes;
    dateTimes.forEach((node) => {
        if (node.tagName === "start-valid-time") {
            time.push(node['innerHTML'])
        }    
    })

    let precip = new Array();

    const chanceOfPrecip = weather.getElementsByTagName("probability-of-precipitation")[0].childNodes;
    chanceOfPrecip.forEach((node) => {
        precip.push(parseInt(node['innerHTML']));
    })

    let temperature = new Array();

    const temperatureValues = weather.getElementsByTagName("temperature")[2].childNodes;
    temperatureValues.forEach((node) => {
        temperature.push(parseInt(node['innerHTML']));
    })
    
    let combined = time.map((e, i) => {
        return [e, temperature[i], precip[i]];
    });

    return combined;
}

navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    printWeather(latitude, longitude).then((data) => console.log(data));
});

