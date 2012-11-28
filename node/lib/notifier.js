
/*
    Load the modules required.
*/

var SerialPort = require("serialport").SerialPort,
    fs = require("fs"),
    port = "/dev/tty.usbserial-AH01O5E5";

/*
    Trigger the Arduino to sound an alert.
*/

exports.sendAlert = function () {

    /*
        Check that there is a USB serial port to use.
    */

    fs.stat(port, function (err, stats) {

        var serial,
            options = {
                baudRate: 9600
            };

        /*
            If there was an error we can do no more so return.
        */

        if (err) {
            console.log("Error finding port: " + port);
            console.log("Did not attempt to trigger alert.");
            return;
        }

        /*
            Open the serial port.
        */

        serial = new SerialPort(port, options);
        console.log("Opening port: " + port);

        /*
            Nothing can be done until the port is open so we register a callback.
        */

        serial.on("open", function () {
            console.log("Triggering alert on port: " + port);

            /*
                Now the port is open we write the "200" code.
                This will tell the Arduino to run it's alert sequence.
            */

            serial.write(new Buffer([200]), function (err, data) {

                /*
                    Log if this was a success or failure.
                */

                if (err) {
                    console.log("Error triggering alert on port: " + port);
                } else {
                    console.log("Alert triggered successfully on port: " + port);
                }

                /*
                    There is no more data to write so we can close the connection.
                */

                serial.close(function () {
                    console.log("Closed connection on port: " + port);
                    serial = null;
                });
            });
        });
    });
};
