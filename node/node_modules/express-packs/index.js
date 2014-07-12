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
    Load the modules required.
*/

var express = require("express"),
    pathlib = require("path"),
    fslib = require("fs");

/*
    Backwards compatability for 0.6.x
*/

function existsSync(path) {
    var stats;
    try {
        stats = fslib.lstatSync(path);
        if (stats.isDirectory() || stats.isFile()) {
            return true;
        }
    }
    catch (e) {
        // ...
    }
    return false;
}

/*
    If there is no existsSync() function on fslib add it.
*/

if (!fslib.existsSync) {
    fslib.existsSync = existsSync;
}

/*
    Packs Object.
*/

function Packs() {}

/*
    exports.GET_index === GET /
    exports.GET_page === GET /page
    exports.POST_page === POST /page
    exports["GET_/admin/logon"] === GET /admin/logon
    exports["POST_/admin/logon"] === POST /admin/logon
*/

Packs.prototype.parseKey = function (key, prefix) {

    var route = {
        source: "",
        method: "",
        path: ""
    };

    if (!key) {
        return route;
    }

    prefix = prefix || "/";

    route.source = key.split("_");

    if (route.source.length === 1) {
        route.source.unshift("");
    }

    if (route.source[1] === "index") {
        route.source[1] = "";
    }

    route.method = route.source[0].toLowerCase();
    route.path = pathlib.join(prefix, route.source[1]);

    return route;
};

/*
    ./ctr.js
    ./assets
    ./views

    exports.view = "html";
    exports.engine = function ();
    exports.path = "/prefix";
*/

Packs.prototype.loadPack = function (abspath, app) {

    var controller = require(abspath),
        key,
        route,
        assetsPath = pathlib.join("/", pathlib.basename(pathlib.dirname(abspath)), "assets"),
        assetsRoot = pathlib.join(pathlib.dirname(abspath), "assets");

    app.use(assetsPath, express.static(assetsRoot));

    for (key in controller) {

        if (typeof controller[key] === "function") {

            route = this.parseKey(key, controller.path);

            if (route.method) {
                app[route.method](route.path, controller[key]);
            }
        }
    }
};

/*
    Returns a list of modules which can be loaded via the "express-module-loader".
*/

Packs.prototype.listPacks = function (dir) {

    var items,
        index,
        abspath,
        list = [];

    if (!dir) {
        return list;
    }

    /*
        Get a list of all the files in the given directory.
    */

    items = fslib.readdirSync(dir);

    /*
        For each item see if it is an "express-modules".
    */

    for (index in items) {

        abspath = pathlib.join(dir, items[index], "ctr.js");

        if (fslib.existsSync(abspath)) {
            list.push(abspath);
        }
    }

    return list;
};

/*
    Given an express application as "app" this function will
    attach all "express-packs" found in the given "packs dir" folder.
*/

module.exports = function (app) {

    var loader = module.exports.create(),
        packs,
        index;

    if (!app) {
        throw new Error("You must provided an express app.");
    }

    if (!app.get("packs dir")) {
        throw new Error("The express app must have a setting of 'packs dir' which is an absolute path.");
    }

    packs = loader.listPacks(app.get("packs dir"));

    for (index in packs) {
        loader.loadPack(packs[index], app);
    }

    return function (req, res, next) {
        next();
    };
};

/*
    Expose the raw Packs object for testing.
*/

module.exports.create = function () {
    return new Packs();
};

/*
    Expose the existsSync function for testing.
*/

module.exports.existsSync = existsSync;
