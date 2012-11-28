
/*
    Load the modules required.
*/

var express = require("express"),
    consolidate = require('consolidate'),
    configs = require("./lib/configs"),
    checker = require("./lib/checker"),
    notifier = require("./lib/notifier"),
    path = require("path"),
    app = express(),
    port = 8080;

/*
    Set the root location of the configuration files.
*/

configs.root = path.join(__dirname, "cfg");

/*
    assign the swig engine to .html files.
*/

app.engine('html', consolidate.handlebars);

/*
    set .html as the default extension.
*/

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

/*
    Use the connect bodyParser() to read the form values.
*/

app.use(express.bodyParser());

/*
    The main URL for the web application.
*/

app.get("/", function (req, res) {

    configs.readConfigs(function (accounts) {

        /*
            Add an empty account so it can be used create a new one.
        */

        accounts.push({});

        /*
            Render the accounts in the main HTML page.
        */

        res.render("main", {accounts: accounts});
    });
});

/*
    This URL is used to save a new account or update one.
*/

app.post("/save", function (req, res) {

    if (req.body.action === "Delete") {
        configs.deleteConfig(req.body.username);
    } else if (req.body.action === "Save") {
        configs.saveConfig({
            username: req.body.username,
            password: req.body.password,
            host: req.body.host,
            port: req.body.port,
            secure: req.body.secure
        });
    }

    res.redirect("/");
});

/*
    This URL is used to force the checking of new mail.
*/

app.get("/check", function (req, res) {
    checker.check();
    res.redirect("/");
});

/*
    This URL is used to test the the Arduino is working correctly.
*/

app.get("/notify", function (req, res) {
    notifier.sendAlert();
    res.redirect("/");
});

/*
    With the application setup and ready to go we listen for requests.
*/

app.listen(port);

/*
    Log that the application has started.
*/

console.log("Started on http://127.0.0.1:" + port + "/");
