const request = require("request");
const tokens  = require("./tokens.js");

function forecast(long, lat, address, callback) {
    const PARAMS     = "?units=si";
    let darkskyToken = tokens.getTokens().darksky;
    let url          = `https://api.darksky.net/forecast/${darkskyToken}/${long},${lat}${PARAMS}`;
    
    request( { url:url, json:true }, (err, response) => {
        if (err) {
            callback("Failed to connect to darksky", undefined);
        }
        else {
            response["address"] = address;
            callback(undefined, response);
        }
    });
}

module.exports = forecast;