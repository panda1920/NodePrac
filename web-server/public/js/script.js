const WEATHER_ENDPOINT_URL = "http://localhost:3000/weather";

function setPageToSearching() {
    setPageMessage("Searching...", "");
}
function setPageMessage(msg1, msg2) {
    let errorMessageHTML = document.getElementById("errorMessage");
    let forecastHTML     = document.getElementById("forecast");

    errorMessageHTML.innerText = msg1;
    forecastHTML.innerText = msg2;
}

function sendRequestToWeatherApp(address) {
    if (!address) {
        setPageMessage("Enter address before search. Search aborted", ""); return
    }

    fetch(WEATHER_ENDPOINT_URL + `?address=${address}`)
    .then(
        response => {
            return response.text();
        }
    ).then(
        data => {
            if (data.errorMessage) {
                setPageMessage(data.errorMessage);
            }
            else {
                setPageMessage("", data);
            }
        }
    ).catch(
        reason => {
            setPageMessage(reason);
        }
    )    
}
// retrieve value from input form
function getInputValue() {
    let input = document.querySelector("#main-content > form > input");
    return input.value;
}
// make button capable of sending content of input form to the backend api
function buttonHandler(event) {
    setPageToSearching();
    sendRequestToWeatherApp( getInputValue());
}
function setHandlers() {
    let button = document.querySelector("#main-content > form > button");
    if (!button) {
        console.log("cannot locate button element");
        return;
    }

    button.addEventListener("click", buttonHandler);
}

document.addEventListener("DOMContentLoaded", setHandlers);