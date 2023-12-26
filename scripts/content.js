existsNew = false;
existsOld = false;

/**
 * Main loop of program, checks if new and old events exist and calls appropriate update functions.s
 */
const listenForEvent = async () => {
    if ((await checkNewEvent()) && !existsNew) {
        const [currentLat, currentLong] = await getCurrentLocation.then((data) => data);

        updatePopup(currentLat, currentLong);

        existsNew = true;
    } else {
        if (!(await checkNewEvent())) {
            existsNew = false;
        }
    }
    if ((await checkOldEvent()) && !existsOld) {
        //const locat = document.querySelectorAll(".DN1TJ")[1];
        const locat = document.querySelectorAll(".AzuXid")[1];
        
        console.log(locat)
        let address = locat.textContent.split(", ");
        console.log(address)
        while (address.length > 4) {
            address.shift();
        }
        let [lat, long] = await getCurrentLocation.then((data) => data);
        if (address.length !== 0) {
            let coord = await printCoords(address.join(", "));
            if (coord) {
                [lat, long] = coord;
            }
        }

        updatePopupOld(lat, long);

        existsOld = true;
    } else {
        if (!(await checkOldEvent())) {
            existsOld = false;
        }
    }
    setTimeout(listenForEvent, 250);
};

listenForEvent();