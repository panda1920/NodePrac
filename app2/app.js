const request = require("request");
const chalk   = require("chalk");
const geocode = require("./geocode.js");

function printWeather(address) {
    geocode(address, requestDarksky);
}

function requestDarksky(error, data) {
    const PARAMS = "?units=si";
    let url = `https://api.darksky.net/forecast/757f0bbab33583f88697f2ca3f2e1e0f/${data.long},${data.lat}${PARAMS}`;
    
    if (error) {
        console.log(error);
    }
    else {
        request( { url:url, json:true }, (err, response) => {
            console.log(chalk.yellow(`Current weather of ${data.address}:`));
            console.log(`\ttemperature: ${response.body.currently.temperature} Celsius`);
            console.log(`\thumidity: ${response.body.currently.humidity* 100} %`);
        });
    }
}



printWeather("TOkyo shinagawa");