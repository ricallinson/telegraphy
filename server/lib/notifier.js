
/*
    Load the modules required.
*/

var SerialPort = require("serialport").SerialPort,
    fs = require("fs"),
    port = "/dev/tty.usbserial-AH01O5E5";

exports.sendAlert = function () {

    fs.stat(port, function (err, stats) {

        var serial,
            value = 0x01,
            options = {
                baudRate: 9600
            };

        if (err) {
            console.log("Error finding port: " + port);
            console.log("Did not attempt to trigger alert.");
            // console.log(err);
            return;
        }

        if (!serial) {
            serial = new SerialPort(port, options);
            console.log("Opening port: " + port);
        }

        serial.on("open", function () {
            console.log("Sending alert to port: " + port);
            serial.write(new Buffer([value]), function (err, data) {
                if (err) {
                    console.log("Error triggering alert on port: " + port);
                } else {
                    console.log("Alert triggered on port: " + port);
                }
                serial.close(function () {
                    console.log("Closed connection on port: " + port);
                    serial = null;
                });
            });
        });
    });
};
