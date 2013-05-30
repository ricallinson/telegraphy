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
    Returns the first IPv4 External address found in the given device array.
*/

exports.getExternalIpv4Address = function (device) {

    var current, details;

    for (current in device) {

        details = device[current];

        if (details.family === "IPv4" && details.internal === false) {
            return details.address;
        }
    }
};

/*
    Returns the first external IP address found in the network interfaces.
*/

exports.getIpAddress = function () {

    var os = require("os"),
        ifaces = os.networkInterfaces(),
        device,
        address;

    for (device in ifaces) {
        address = this.getExternalIpv4Address(ifaces[device]);
        if (address) {
            return address;
        }
    }
};