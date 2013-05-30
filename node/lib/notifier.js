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
    serialPort = {};

/*
    The serial ports to use.
*/

exports.ports = [];

/*
    A simple wrapper function around "serialport.list".
*/

exports.listAllPorts = function (fn) {
    require("serialport").list(function (err, ports) {
        fn(ports);
    });
};

/*
    Open all the serial ports.
*/

exports.openPorts = function (fn) {

    var current,
        self = this,
        count = this.ports.length;

    if (count === 0) {
        fn();
        return;
    }

    for (current in this.ports) {
        this.openPort(self.ports[current], function () {
            count = count - 1;
            if (count <= 0) {
                fn();
            }
        });
    }
}

/*
    Open the given serial port.
*/

exports.openPort = function (port, fn) {

    /*
        If the given port is not "usbserial", "usbmodem" or "ttyUSB" then skip it.
    */

    if (port.indexOf("usbserial") < 0 && port.indexOf("usbmodem") < 0 && port.indexOf("ttyUSB") < 0) {
        console.log("Not a usable port: " + port);
        fn();
        return;
    }

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
            fn();
            return;
        }

        /*
            Open the serial port.
        */

        serialPort[port] = new SerialPort(port, options);
        console.log("Opening port: " + port);

        /*
            Nothing can be done until the port is open so we register the callback.
        */

        serialPort[port].on("open", fn);
    });
};

/*
    Close all the serial ports.
*/

exports.closePorts = function (fn) {

    var current,
        self = this,
        count = this.ports.length;

    if (count === 0) {
        fn();
        return;
    }

    for (current in this.ports) {
        this.closePort(self.ports[current], function () {
            count = count - 1;
            if (count <= 0) {
                fn();
            }
        });
    }
}

/*
    Close the given serial port.
*/

exports.closePort = function (port, fn) {

    if (!serialPort[port]) {
        fn();
        return;
    }

    console.log("Closing port " + port);

    serialPort[port].on("close", function () {
        console.log("Closed connection on port: " + port);
        delete serialPort[port];
        fn();
    });

    serialPort[port].close();
};

/*
    Connect to all ports found.
*/

exports.connect = function (port, fn) {

    var self = this;

    if (!fn) {
        fn = function () {
            console.log("Usable ports opened");
        };
    }

    /*
        First, if we have any ports, close them.
    */

    this.closePorts(function () {

        /*
            Now get a list of all the ports and then try and connect them.
        */

        self.listAllPorts(function (ports) {

            var current;

            if (port) {

                /*
                    If we were given a serial port set it in the "notifier".
                */

                self.ports = [port];
                
            } else {

                /*
                    If we were not given a serial port, attach all the ones available.
                */

                self.ports = [];

                for (current in ports) {
                    self.ports.push(ports[current].comName);
                }
            }

            /*
                Open the serial ports.
            */

            self.openPorts(fn);
        });
    }); 
};

/*
    Trigger the Arduino with an alert.
*/

exports.sendAlert = function (msg) {

    var current,
        port;

    for (current in this.ports) {

        /*
            Reference the port in a local variable.
        */

        port = this.ports[current];

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
            Write the given msg to the given port.
        */

        this.writeMsg(msg, port);
    }
};

/*
    Send the message to the device on the given port.
*/

exports.writeMsg = function (msg, port) {

    /*
        If there is no serial port do nothing.
    */

    if (serialPort[port]) {

        serialPort[port].write(msg, function (err, data) {

            /*
                Log if this was a success or failure.
            */

            if (err) {
                console.log("Error sending alert on port: " + port);
            } else {
                console.log("Alert sent successfully on port: " + port);
            }
        });
    }
};
