//    (The MIT License)
//
//    Copyright (c) 2012 Richard S Allinson <rsa@mountainmansoftware.com>
//
//    Permission is hereby granted, free of charge, to any person obtaining
//    a copy of this software and associated documentation files (the
//    "Software"), to deal in the Software without restriction, including
//    without limitation the rights to use, copy, modify, merge, publish,
//    distribute, sublicense, and/or sell copies of the Software, and to
//    permit persons to whom the Software is furnished to do so, subject to
//    the following conditions:
//
//    The above copyright notice and this permission notice shall be
//    included in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
//    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
//    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
//    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
//    CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
//    TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
//    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/*
    Load the modules required.
*/

var program = require("commander"),
    express = require("express"),
    consolidate = require('consolidate'),
    configs = require("./lib/configs"),
    checker = require("./lib/checker"),
    notifier = require("./lib/notifier"),
    path = require("path"),
    app = express(),
    port = 8080;

/*
    Get the command line inputs
*/

program
    .version('0.0.1')
    .option('-s, --serial-port [port]', 'The serial port to use', null)
    .option('-i, --interval [minutes]', 'The number of minutes between checks', 5)
    .parse(process.argv);

/*
    We cannot do anyhting without a serial port so it's the first thing we check.
*/

if (program.serialPort) {

    /*
        If we were given a serial port set it in the "notifier".
    */

    notifier.port = program.serialPort;

    /*
        Open the serial port for ready later use.
    */

    notifier.openPort(function () {

        /*
            We don't wait for the callback as it will be not be used instantly.
            It's assumed th port will be open and ready by the time it's required.
        */

        console.log("Opened connection on port: " + notifier.port);
    });

} else {

    /*
        If we were not given a serial port, list the ones avaliable and exit.
    */

    notifier.listPorts(function (ports) {
        ports.forEach(function (port) {
            console.log(port.comName);
        });
        process.exit(0);
    });
}

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
app.set('views', path.join(__dirname, "views"));

/*
    Use the connect bodyParser() to read the form values.
*/

app.use(express.bodyParser());

/*
    Use the connect static() handler to serve assets.
*/

app.use(express.static(path.join(__dirname, "assets")));

/*
    The main URL for the web application.
*/

app.get("/", function (req, res) {
    res.render("main");
});

/*
    This URL is used to test the the Arduino is working correctly.
*/

app.get("/notify", function (req, res) {
    notifier.sendAlert(req.query.msg || "New email received");
    res.redirect("/");
});

/*
    This URL is used to create or edit accounts.
*/

app.get("/accounts", function (req, res) {

    configs.readConfigs(function (accounts) {

        /*
            Add an empty account so it can be used create a new one.
        */

        accounts.push({
            port: 993,
            secure: false
        });

        /*
            Render the accounts in the main HTML page.
        */

        res.render("accounts", {accounts: accounts});
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
            secure: (req.body.secure === "true" ? "true" : "")
        });
    }

    res.redirect("/accounts");
});

/*
    This URL is used to force the checking of new mail.
*/

app.get("/check", function (req, res) {
    checker.check();
    res.redirect("/accounts");
});

/*
    With the application setup and ready to go we listen for requests.
*/

app.listen(port);

/*
    Log that the application has started.
*/

console.log("Started on http://127.0.0.1:" + port + "/");

/*
    With the web application running we now check for mail every n minutes.
*/

setInterval(function () {
    checker.check();
}, program.interval * 1000 * 60);
