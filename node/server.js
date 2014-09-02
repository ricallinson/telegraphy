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


"use strict";

/*
    Load the modules required.
*/

var program = require("commander"),
    express = require("express"),
    epacks = require("express-packs"),
    consolidate = require("consolidate"),
    configs = require("./lib/configs"),
    notifier = require("./lib/notifier"),
    checker = require("./lib/checker"),
    random = require("./lib/random"),
    utils = require("./lib/utils"),
    path = require("path"),
    app = express(),
    port = 8080;

/*
    Get the command line inputs
*/

program
    .version("0.0.1")
    .option("-l, --list-serial-ports", "List the available serial ports", null)
    .option("-s, --serial-port [port]", "Force the serial port to use", null)
    .option("-i, --interval [minutes]", "The number of minutes between checks", 10)
    .parse(process.argv);

/*
    If asked list all the available serial ports and exit.
*/

if (program.listSerialPorts) {
    notifier.listAllPorts(function (ports) {
        ports.forEach(function (port) {
            console.log(port.comName);
        });
        process.exit(0);
    });
}

/*
    We cannot do anything without a serial port so it"s the first thing we check.
*/

notifier.connect(program.serialPort);

/*
    With the web application running we send a new message every n minutes.
*/

setInterval(function () {
    random.words(notifier, 3);
}, program.interval * 1000 * 60);

/*
    Send a new message after 10 seconds.
*/

setTimeout(function () {
    random.words(notifier, 5);
}, 10000);

return;

/*
    ----------------------- END OF PROGRAM ------------------------
 */

/*
    Set the root location of the configuration files.
*/

configs.root = path.join(__dirname, "cfg");

/*
    assign the handlebars engine to .html files.
*/

app.engine("html", consolidate.handlebars);

/*
    set .html as the default extension.
*/

app.set("view engine", "html");

/*
    Use the connect bodyParser() to read the form values.
*/

app.use(express.bodyParser());

/*
    Use the connect static() handler to serve assets.
*/

//- app.use(express.static(path.join(__dirname, "assets")));

/*
    Use express-packs to add routes and templates.
*/

app.set("packs dir", path.join(__dirname, "packs"));
app.set("views", path.join(__dirname, "packs"));
app.use(epacks(app));

/*
    With the application setup and ready to go we listen for requests.
*/

app.listen(port);

/*
    Log that the application has started.
*/

console.log("Started on http://" + utils.getIpAddress() + ":" + port + "/");

/*
    With the web application running we now check for mail every n minutes.
*/

setInterval(function () {
    checker.check(configs, notifier);
}, program.interval * 1000 * 60);

/*
    Check for new messages after 10 seconds.
*/

setTimeout(function () {
    checker.check(configs, notifier);
}, 10000);
