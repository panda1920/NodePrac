const path     = require("path");
const express  = require("express");
const hbs      = require("hbs");
const geocode  = require("./geocode/geocode.js");
const forecast = require("./geocode/forecast.js");

// create object accessible from views
function createSubstituteObject(title, msg) {
    return {
        title,
        name: "panda1920",
        message: msg
    };
}
function renderErrorPage(res, title, msg) {
    res.render("showmessage", createSubstituteObject(title, msg));
}

// define paths for exoress
const SHARE_PATH    = path.join(__dirname, "../public");
const VIEWS_PATH    = path.join(__dirname, "../templates/views");
const PARTIALS_PATH = path.join(__dirname, "../templates/partials");

const app = express();

// set port to heroku port if available
const PORT = process.env.PORT || 3000;

// setup handlebars and view location
app.set("view engine", "hbs");
app.set("views", VIEWS_PATH);
hbs.registerPartials(PARTIALS_PATH);

// setup static dir to serve
app.use( express.static(SHARE_PATH) );

// get() method defines what the server does when user access the location specified
// route GET request
app.get("/weather", (req, res) => {
    if (!req.query.address) {
        res.render("index", {});
        return;
    }

    geocode(req.query.address, (err, response) => {
        if (err) {
            // renderErrorPage(res, "weather", err);
            res.send({
                errorMessage: err
            })
            return;
        }
        
        forecast(response.long, response.lat, response.address, (err, response) => {
            if (err) {
                // renderErrorPage(res, "weather", err);
                res.send({
                    errorMessage: err
                })
                return;
            }

            let location = response.address;
            let temperature = response.body.currently.temperature;
            let humidity = response.body.currently.humidity;
            let summary = response.body.currently.summary;
            let forecast = `The current weather of ${location} is ${summary}, with a temperature of ${temperature} Celsius and humidity of ${humidity * 100}%`;

            res.send({
                location,
                temperature,
                humidity,
                summary,
                forecast
            });
        });
    });
});
app.get("", (req, res) => {
    res.render("showmessage", createSubstituteObject("index", ""));
});
app.get("/about", (req, res) => {
    res.render("about", {});
});
app.get("/help", (req, res) => {
    res.render("help", createSubstituteObject("help", "This is a web app that I am currently developing."));
});
app.get("/help/*", (req, res) => {
    res.render("showmessage", createSubstituteObject("404 ERROR" ,"Help article not found."));
});
app.get("*", (req, res) => {
    res.render("showmessage", createSubstituteObject("404 ERROR" ,"Page not found."));
})

app.listen(PORT, () => {    
    console.log(`Server is up on port ${PORT}`);
});