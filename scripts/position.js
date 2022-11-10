/**
 * Checks if the popup has moved too far to the left or right, and adjusts it if necessary.
 */
const checkPosition = () => {
    if (document.querySelector(".RDlrG")) {
        if (document.querySelector(".weatherPopup")) {
            let element = document.querySelector(".RDlrG");
            let bodyRect = document.body.getBoundingClientRect();
            let elemRect = element.getBoundingClientRect();
            let offset = elemRect.left - bodyRect.left;

            const weatherPopup = document.querySelector(".weatherPopup");
            if (offset <= 270) {
                weatherPopup.style.removeProperty("left");
                weatherPopup.style.right = "-220px";
                //console.log(weatherPopup.offsetParent);
            } else {
                weatherPopup.style.removeProperty("right");
                weatherPopup.style.left = "-220px";
            }
        }
    }

    setTimeout(checkPosition, 250);
}

checkPosition();