

const xmlReturn = fetch('https://forecast.weather.gov/MapClick.php?lat=34.7749&lon=-81.9526&FcstType=digitalDWML')
    .then(response => response.text())
    .then(str => new DOMParser().parseFromString(str, "text/xml"))

const printWeather = async () => {
    // get xml of website with data
    const weather = await xmlReturn;
    
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

printWeather().then((data) => console.log(data));