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

var SerialPort = require("serialport").SerialPort,
    fs = require("fs"),
    serialPort;

/*
    The serial port to use.
*/

exports.port = "";

/*
    A simple wrapper function around "serialport.list".
*/

exports.listPorts = function (fn) {
    require("serialport").list(function (err, ports) {
        fn(ports);
    });
};

/*
    Open the serial port.
*/

exports.openPort = function (fn) {

    /*
        Reference the port in a local variable.
    */

    var port = exports.port;

    /*
        Check that there is a USB serial port to use.
    */

    fs.stat(port, function (err, stats) {

        var options = {
                baudRate: 9600
            };

        /*
            If there was an error we can do no more so return.
        */

        if (err) {
            console.log("Error finding port: " + port);
            console.log("Did not attempt to send alert message '" + msg + "'.");
            return;
        }

        /*
            Open the serial port.
        */

        serialPort = new SerialPort(port, options);
        console.log("Opening port: " + port);

        /*
            Nothing can be done until the port is open so we register the callback.
        */

        serialPort.on("open", fn);
    });
};

/*
    Close the serial port.
*/

exports.closePort = function (fn) {

    /*
        Reference the port in a local variable.
    */

    var port = exports.port;

    /*
        If there is no more data to write we can close the connection.
    */

    serialPort.close(function () {
        console.log("Closed connection on port: " + port);
        serialPort = null;
        fn();
    });
};

/*
    Trigger the Arduino to sound an alert.
*/

exports.sendAlert = function (msg) {

    /*
        Reference the port in a local variable.
    */

    var port = exports.port;

    /*
        If there is no serial port return with error.
    */
    if (!serialPort) {
        console.log("Error sending alert as port not open: " + port);
        return;
    }

    /*
        Set a default message for the alert if one is not given.
    */

    if (!msg) {
        msg = "Alert";
    }

    /*
        Make sure the message is uppercase and is only A-Z or spaces.
    */

    msg = msg.toUpperCase().replace(/[^A-Z ]/g, " ");

    /*
        Log that we are going to try and send a message.
    */

    console.log("Sending alert message '" + msg + "' on port: " + port);

    /*
        Now the port is open we write the "200" code.
        This will tell the Arduino to run it's alert sequence.
    */

    serialPort.write(msg, function (err, data) {

        /*
            Log if this was a success or failure.
        */

        if (err) {
            console.log("Error sending alert on port: " + port);
        } else {
            console.log("Alert sent successfully on port: " + port);
        }
    });
};
