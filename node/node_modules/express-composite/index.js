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

"use strict";

/*
    Load required modules.
*/

var pathlib = require("path");

exports.dispatch = function (cfg, req, res) {

    var packsDir,
        moduleName,
        abspath;

    if (!cfg) {
        throw new Error("A configuration object must be provided.");
    }

    if (!req || !res) {
        throw new Error("The Express request, response objects must be provided.");
    }

    packsDir = req.app.get("packs dir") || "";
    moduleName = cfg.module || "";
    abspath = pathlib.resolve(packsDir, moduleName);

    try {
        require(abspath)[cfg.action](req, res);
    } catch (err) {
        throw new Error("Function '" + cfg.action + "'' was not found in module at '" + abspath + "'.");
    }

    return this;
};

exports.render = function (map, req, res, cb) {

    var Response,
        response,
        buffer = {},
        count = 0,
        index;

    /*
        If no callback is given then render() the result.
    */

    if (!cb) {
        cb = function (err, slots) {
            if (err) {
                console.log(err);
            }
            map.data = map.data || {};
            map.data.slots = slots;
            res.render(map.tmpl, map.data);
        };
    }

    /*
        Extend the Express response object.
    */

    Response = Object.create(res);

    /*
        Override the the default render function.
    */

    Response.render = function (view, options) {
        var self = this;
        res.render(view, options, function (err, data) {
            count = count - 1;
            if (err) {
                console.log(err);
            }
            buffer[self.index] = data;
            if (count <= 0) {
                cb(err, buffer);
            }
        });
    };

    /*
        For each slot in the map call dispatch.
    */

    for (index in map.slots) {
        count = count + 1;
        response = Object.create(Response);
        response.index = index;
        this.dispatch(map.slots[index], req, response);
    }
};
