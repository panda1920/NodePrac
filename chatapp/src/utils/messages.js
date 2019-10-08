function generateMessage(username, text) {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    };
}

function generateLocationMessage(username, loc) {
    return {
        username,
        url: `https://google.com/maps/?q=${loc.lat},${loc.long}`,
        createdAt: new Date().getTime()
    };
}

module.exports = {generateMessage, generateLocationMessage};