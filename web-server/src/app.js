const path    = require("path");
const express = require("express");
const hbs     = require("hbs");

// create object accessible from views
function createSubstituteObject(title, msg) {
    return {
        title,
        name: "panda1920",
        message: msg
    };
}

// define paths for exoress
const SHARE_PATH    = path.join(__dirname, "../public");
const VIEWS_PATH    = path.join(__dirname, "../templates/views");
const PARTIALS_PATH = path.join(__dirname, "../templates/partials");

const app = express();

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
        res.render("index", createSubstituteObject("weather", "no address was specified"));
        return;
    }

    res.send({
        forecast: "some weather",
        location: req.query.address
    });
});
app.get("", (req, res) => {
    res.render("index", createSubstituteObject("index", ""));
});
app.get("/about", (req, res) => {
    res.render("index", createSubstituteObject("about", ""));
});
app.get("/help", (req, res) => {
    res.render("index", createSubstituteObject("help", "This is a web app that I am currently developing."));
});
app.get("/help/*", (req, res) => {
    res.render("error", createSubstituteObject("404 ERROR" ,"Help article not found."));
});
app.get("*", (req, res) => {
    res.render("error", createSubstituteObject("404 ERROR" ,"Page not found."));
})

app.listen(3000, () => {
    console.log("Server is up on port 3000");
});