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

var confdir = require("../"),
    assert = require("assert"),
    pathlib = require("path");

describe("confdir.read()", function () {

    it("should return function", function () {
        assert.equal(typeof confdir.read, "function");
    });

    it("should return an empty object", function () {

        var config = confdir.read(),
            name,
            test = false;

        for (name in config) {
            test = true;
        }

        assert.strictEqual(test, false);
    });

    it("should return jsonValue, yamlValue, ymlValue", function () {

        var config = confdir.read(pathlib.join(__dirname, "fixtures"));

        assert.equal(config.json.jsonKey, "jsonValue");
        assert.equal(config.yaml.yamlKey, "yamlValue");
        assert.equal(config.yml.ymlKey, "ymlValue");
    });

    it("should return jsonSubValue, yamlSubValue, ymlSubValue", function () {

        var config = confdir.read(pathlib.join(__dirname, "fixtures", "subfolder"));

        assert.equal(config.subjson.jsonSubKey, "jsonSubValue");
        assert.equal(config.subyaml.yamlSubKey, "yamlSubValue");
        assert.equal(config.subyml.ymlSubKey, "ymlSubValue");
    });

    it("should return 1, 2, mapValue", function () {

        var config = confdir.read(pathlib.join(__dirname, "fixtures"), pathlib.join(__dirname, "fixtures", "defaults"));

        assert.equal(config.json.jsonKey, "jsonValue");
        assert.equal(config.yaml.yamlKey, 1);
        assert.equal(config.yaml.yamlDefault, 2);
        assert.equal(config.yaml.yamlMap.mapKey, "mapValue");
        assert.equal(config.yml.ymlKey, "ymlValue");
    });

    it("should return undefined", function () {

        var config = confdir.read(pathlib.join(__dirname, "fixtures", "bad")),
            name,
            test = false;

        for (name in config) {
            test = true;
        }

        assert.strictEqual(test, false);
    });
});