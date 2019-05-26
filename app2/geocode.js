const request = require("request");

const MAPBOXTOKEN = 'pk.eyJ1IjoicGFuZGExOTIwIiwiYSI6ImNqdnplcHJzZzBxMXUzem1pbnJ4a2dnZ2MifQ.F4jQl5801SNSsGLw_Ey9yQ';

function geocode(address, callback) {
    let encodedAddressString = encodeURI(address);
    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddressString}.json?access_token=${MAPBOXTOKEN}`;

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