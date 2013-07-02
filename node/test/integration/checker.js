// (The MIT License)

// Copyright (c) 2012 Richard S Allinson <rsa@mountainmansoftware.com>

// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// 'Software'), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/*global describe: true, it: true*/

"use strict";

var checker = require("../../lib/checker"),
    assert = require("assert"),
    configsMock,
    notifierMock;

function configsMock() {
    return {
        readConfigsCalled: false,
        readConfigsValue: [],
        readConfigs: function (fn) {
            fn(this.readConfigsValue);
            this.readConfigsCalled = true;
        },
        saveConfigCalled: false,
        saveConfigValue: false,
        saveConfig: function (val) {
            this.saveConfigValue = val;
            this.saveConfigCalled = true;
        }
    };
}

function notifierMock() {
    return {
        sendAlertCalled: false,
        sendAlert: function () {
            this.sendAlertCalled = true;
        }
    };
}

describe("checker", function () {

    it("should return an object", function () {
        assert.equal(typeof checker, "object");
    });

    it("should return a function", function () {
        assert.equal(typeof checker.check, "function");
    });

    it("should call checker.readConfigs()", function () {

        var configs = configsMock(),
            notifier = notifierMock();

        checker.check(configs, notifier);

        assert.equal(configs.readConfigsCalled, true);
    });

    it("should call checker.readConfigs() and trap an error", function () {

        var configs = configsMock(),
            notifier = notifierMock();

        configs.readConfigsValue = [
            {
                type: "fake"
            }
        ];

        checker.check(configs, notifier);

        assert.equal(configs.readConfigsCalled, true);
    });
});