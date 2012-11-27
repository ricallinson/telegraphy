
/*
    Load the modules required.
*/

var SerialPort = require("serialport").SerialPort,
    fs = require("fs"),
    port = "/dev/tty.usbserial-AH01O5E5",
    serial;

exports.triggerAlert = function () {

    fs.stat(port, function (err, stats) {

        var value = 0x01,
            options = {
                baudRate: 9600
            };

        if (err) {
            console.log(err);
            process.exit();
        }

        if (!serial) {
            serial = new SerialPort(port, options);
        }

        serial.on("open", function () {
            serial.write(new Buffer([value]), function (err, data) {
                serial.close();
            });
        });

        serial.on("data", function (data) {
            console.log("> " + data);
        });
    });
};

// Test code
// exports.triggerAlert();