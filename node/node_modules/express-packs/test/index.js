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

var expressPacks = require("../"),
    pathlib = require("path"),
    assert = require("assert");

describe("expressPacks", function () {

    it("should return a function", function () {
        assert.equal(typeof expressPacks, "function");
    });

    it("should throw an error", function () {
        assert.throws(expressPacks);
    });

    it("should throw an error after calling app.get()", function () {

        var app = {},
            get = false;

        app.get = function () {
            get = true;
        };

        assert.throws(function () {
            expressPacks(app);
        });
    });

    it("should call app.get()", function () {

        var app = {},
            get = false,
            dir = pathlib.join(__dirname, "fixtures");

        app.use = function () {};

        app.get = function (key) {
            if (key === "packs dir") {
                get = true;
                return dir;
            }
        };

        expressPacks(app);

        assert.equal(get, true);
    });

    it("should return a connect function", function () {

        var app = {},
            get = false,
            dir = pathlib.join(__dirname, "fixtures"),
            middleware;

        app.use = function () {};

        app.get = function (key) {
            if (key === "packs dir") {
                get = true;
                return dir;
            }
        };

        middleware = expressPacks(app);

        // Call the return function for 100% converage.
        middleware(null, null, function () {});

        assert.equal(typeof middleware, "function");
    });
});

describe("expressPacks.listPacks()", function () {

    var loader = expressPacks.create(),
        dir = pathlib.join(__dirname, "fixtures");

    it("should return a function", function () {
        assert.equal(typeof loader.listPacks, "function");
    });

    it("should return an empty list", function () {

        var list = loader.listPacks();

        assert.equal(list.length, 0);
    });

    it("should return a list of absoute paths to packs", function () {
        
        var list = loader.listPacks(dir);

        assert.equal(list.length, 1);
    });
});

describe("expressPacks.loadPack()", function () {

    var loader = expressPacks.create();

    it("should return a function", function () {
        assert.equal(typeof loader.loadPack, "function");
    });

    it("should return call app.use() and app.get()", function () {

        var abspath = pathlib.join(__dirname, "fixtures", "pack1", "ctr.js"),
            app = {},
            use = false,
            get = false;

        app.use = function (path, fn) {
            if (path === "/pack1/assets" && typeof fn === "function") {
                use = true;
            }
        };

        app.get = function (path, fn) {
            if (path === "/" && typeof fn === "function") {
                get = true;
            }
        };

        loader.loadPack(abspath, app);

        assert.equal(use, true);
        assert.equal(get, true);
    });
});

describe("expressPacks.parseKey()", function () {

    var loader = expressPacks.create();

    it("should return an empty route object", function () {
        assert.equal(typeof loader.parseKey, "function");
    });

    it("should return an empty route object", function () {

        var route = loader.parseKey();

        assert.equal(route.source, "");
        assert.equal(route.method, "");
        assert.equal(route.path, "");
    });

    it("should return a route object with no method", function () {

        var route = loader.parseKey("index");

        assert.equal(route.source[0], "");
        assert.equal(route.method, "");
        assert.equal(route.path, "/");
    });

    it("should return a route object with no method", function () {

        var route = loader.parseKey("page");

        assert.equal(route.source[0], "");
        assert.equal(route.method, "");
        assert.equal(route.path, "/page");
    });

    it("should return a route object", function () {

        var route = loader.parseKey("GET_index");

        assert.equal(route.source[0], "GET");
        assert.equal(route.method, "get");
        assert.equal(route.path, "/");
    });

    it("should return a route object", function () {

        var route = loader.parseKey("get_index");

        assert.equal(route.source[0], "get");
        assert.equal(route.method, "get");
        assert.equal(route.path, "/");
    });

    it("should return a route object with a path of /path", function () {

        var route = loader.parseKey("GET_path");

        assert.equal(route.source[0], "GET");
        assert.equal(route.method, "get");
        assert.equal(route.path, "/path");
    });

    it("should return a route object with no method and a path of /path", function () {

        var route = loader.parseKey("path");

        assert.equal(route.source[0], "");
        assert.equal(route.method, "");
        assert.equal(route.path, "/path");
    });
});

describe("existsSync()", function () {

    it("should return a true", function () {
        var abspath = pathlib.join(__dirname, "fixtures", "pack1", "ctr.js"),
            exists = expressPacks.existsSync(abspath);
        assert.equal(exists, true);
    });

    it("should return a true", function () {
        var abspath = pathlib.join(__dirname, "fixtures", "pack1"),
            exists = expressPacks.existsSync(abspath);
        assert.equal(exists, true);
    });

    it("should return a false", function () {
        var abspath = pathlib.join(__dirname, "fixtures", "pack1", "empty"),
            exists = expressPacks.existsSync(abspath);
        assert.equal(exists, false);
    });

    it("should return a flase", function () {
        var abspath = "",
            exists = expressPacks.existsSync(abspath);
        assert.equal(exists, false);
    });
});