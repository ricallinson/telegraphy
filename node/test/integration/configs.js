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

var configs = require("../../lib/configs"),
    pathlib = require("path"),
    fslib = require("fs"),
    assert = require("assert");

var configsRoot = pathlib.join(__dirname, "..", "fixtures", "configs"),
    example;

example = function () {
    return {
        type: "",
        username: "",
        password: "",
        host: "",
        port: "",
        secure: undefined
    };
};

describe("config", function () {
    it("should return an object", function () {
        assert.equal(typeof configs, "object");
    });
});

describe("config.saveConfig()", function () {

    configs.root = configsRoot;

    it("should return function", function () {
        assert.equal(typeof configs.saveConfig, "function");
    });

    it("should throw an error", function () {
        assert.throws(configs.saveConfig);
    });

    it("should return false", function () {
        configs.saveConfig(undefined, function (result) {
            assert.equal(result, false);
        });
    });

    it("should return false", function () {
        configs.saveConfig({}, function (result) {
            assert.equal(result, false);
        });
    });

    it("should return false", function () {
        configs.saveConfig(example, function (result) {
            assert.equal(result, false);
        });
    });

    it("should save the file test1.cfg to disk", function () {

        var cfg = example();

        cfg.username = "test1";

        configs.saveConfig(cfg, function (result) {

            var file = pathlib.join(configs.root, cfg.username + ".cfg");

            assert.equal(result, true);
            assert.equal(fslib.statSync(file).isFile(), true);
            assert.doesNotThrow(function () {
                fslib.unlinkSync(file);
            });
        });
    });

    it("should save the file test2.cfg to disk", function () {

        var cfg = example();

        cfg.username = "bad/test2";

        configs.saveConfig(cfg, function (result) {
            assert.equal(result, false);
        });
    });
});

describe("config.readConfig()", function () {

    configs.root = configsRoot;

    it("should return function", function () {
        assert.equal(typeof configs.readConfig, "function");
    });

    it("should throw an error", function () {
        assert.throws(configs.readConfig);
    });

    it("should save and read file test3.cfg returning the same data", function (done) {

        var cfg = example();

        cfg.type = "imap";
        cfg.username = "test3";
        cfg.password = "pwd";
        cfg.host = "imap.mail.com";
        cfg.port = "93";
        cfg.secure = true;

        configs.saveConfig(cfg, function (result) {

            var file = pathlib.join(configs.root, cfg.username + ".cfg"),
                res;

            assert.equal(result, true);
            assert.equal(fslib.statSync(file).isFile(), true);

            res = configs.readConfig(file);

            assert.equal(res.type, cfg.type);
            assert.equal(res.username, cfg.username);
            assert.equal(res.password, cfg.password);
            assert.equal(res.host, cfg.host);
            assert.equal(res.port, cfg.port);
            assert.equal(res.secure, cfg.secure);

            assert.doesNotThrow(function () {
                fslib.unlinkSync(file);
                done();
            });
        });
    });

    it("should read the file bad.cfg and return an empty object", function () {

        var file = pathlib.join(configs.root, "bad.cfg"),
            res = configs.readConfig(file);

        assert.equal(typeof res, "object");
    });
});

describe("config.deleteConfig()", function () {

    configs.root = configsRoot;

    it("should return function", function () {
        assert.equal(typeof configs.deleteConfig, "function");
    });

    it("should throw an error", function () {
        assert.throws(configs.deleteConfig);
    });

    it("should delete the test4.cfg file", function (done) {

        var cfg = example();

        cfg.username = "test4";

        configs.saveConfig(cfg, function (result) {

            var file = pathlib.join(configs.root, cfg.username + ".cfg");

            assert.equal(result, true);
            assert.equal(fslib.statSync(file).isFile(), true);

            configs.deleteConfig(cfg.username, function (result1) {
                assert.equal(result1, true);
                try {
                    fslib.statSync(file).isFile();
                } catch (err) {
                    done();
                }
            });
        });
    });

    it("should fail to delete the test5.cfg file", function () {
        configs.deleteConfig("test5", function (result) {
            assert.equal(result, false);
        });
    });
});

describe("config.readConfigs()", function () {

    configs.root = configsRoot;

    it("should return an function", function () {
        assert.equal(typeof configs.readConfigs, "function");
    });

    it("should throw an error", function () {
        assert.throws(configs.readConfigs);
    });

    it("should return ...", function (done) {

        configs.readConfigs(function (configs) {

            configs.sort(function (a, b) {
                if (a.port < b.port) {
                    return -1;
                }
                if (a.port > b.port) {
                    return 1;
                }
                return 0;
            });

            assert.equal(configs.length, 3);
            assert.equal(configs[0].port, "");
            assert.equal(configs[1].port, "23");
            assert.equal(configs[2].port, "25");

            done();
        });
    });

    it("should return an empty list", function (done) {

        configs.root = pathlib.join(configsRoot, "empty");

        configs.readConfigs(function (configs) {
            assert.equal(configs.length, 0);
            done();
        });
    });

    it("should return an empty list", function (done) {

        configs.root = pathlib.join(configsRoot, "empty", "error");

        configs.readConfigs(function (configs) {
            assert.equal(configs.length, 0);
            done();
        });
    });
});