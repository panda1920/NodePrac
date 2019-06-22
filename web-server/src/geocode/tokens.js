const fs   = require("fs");
const path = require("path");

const TOKENFILE = path.join(__dirname, "APItokens.json");

function getTokens() {
    try {
        let buffer = fs.readFileSync(TOKENFILE);
        return JSON.parse(buffer.toString());
    }
    catch (e) {
        console.warn(`Make sure you have file ${TOKENFILE} present in the app directory`);
        throw e;
    }
}

module.exports = {getTokens};