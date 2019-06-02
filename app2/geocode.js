const request = require("request");
const tokens  = require("./tokens.js");

function geocode(address, callback) {
    let encodedAddressString = encodeURI(address);
    let mapboxToken          = tokens.getTokens().mapbox;
    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddressString}.json?access_token=${mapboxToken}`;

    request( {url: url, json: true}, (error, response) => {
        if (error) {
            callback("There was an error connecting to geocode API.", undefined);
        }
        else if (response.body.features.length === 0) {
            callback(`Search failed for address: ${address}`, undefined);
        }
        else {
            const {0:lat, 1:long} = response.body.features[0].center;
            const address = response.body.features[0].place_name;
            callback(undefined, {long, lat, address});
        }
    });
}

module.exports = geocode;