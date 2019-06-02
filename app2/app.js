const request  = require("request");
const chalk    = require("chalk");
const geocode  = require("./geocode.js");
const forecast = require("./forecast.js");
const tokens   = require("./tokens.js");

function printWeather(address) {
    geocode(address, callbackOfGeocode);
}
function callbackOfGeocode(error, response) {
    if (error) {
        console.log(error);
    }
    else {
        forecast(response.long, response.lat, response.address, callbackOfForecast);
    }
}
function callbackOfForecast(error, response) {
    if (error) {
        console.log(err);
    }
    else {
        console.log(chalk.yellow(`Current weather of ${response.address}:`));
        console.log(`\ttemperature: ${response.body.currently.temperature} Celsius`);
        console.log(`\thumidity: ${response.body.currently.humidity* 100} %`);
    }
}



printWeather("TOkyo shinagawa");
// console.log(tokens.getTokens());