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

var yaml = require("js-yaml"),
    pathlib = require("path"),
    fs = require("fs");

exports.objectMerge = function (from, to) {

    var key;

    for (key in from) {

        try {
            // Property in destination object set; update its value.
            if (from[key].constructor === Object) {
                to[key] = this.objectMerge(from[key], to[key]);
            } else {
                to[key] = from[key];
            }
        } catch (err) {
            // Property in destination object not set; create it and set its value.
            to[key] = from[key];
        }
    }
    return to;
};

/*
    Reads the given "filePath" as either a .yml, .yaml or .json
    and returns it's contents as an object.
*/

exports.readConfigFileSync = function (filePath) {

    var ext = pathlib.extname(filePath),
        raw,
        obj;

    try {

        raw = fs.readFileSync(filePath, "utf8");

        if (ext === ".yml" || ext === ".yaml") {
            obj = yaml.load(raw);
        }

        if (ext === ".json") {
            obj = JSON.parse(raw);
        }

    } catch (err) {
        console.log(err);
    }

    return obj;
};

/*
    Walks the given directory and extracts all yml, yaml and json files
    returning their content in an object.
*/

exports.readConfigDirSync = function (dir) {

    var files,
        name,
        absPath,
        ext,
        key,
        config,
        configs = {};

    /*
        Get a list of all the files in the given directory.
    */

    files = fs.readdirSync(dir);

    /*
        For each file try and read it as configuration.
    */

    for (name in files) {

        /*
            Create the absolute path to the file.
        */

        absPath = pathlib.join(dir, files[name]);

        /*
            Get the extension from the file.
        */

        ext = pathlib.extname(files[name]);

        /*
            If the extension is a value then try and read the configuration.
        */

        if (ext) {

            /*
                Get the name of the file to use as the key in the returned object.
            */

            key = files[name].slice(0, ext.length * -1);

            /*
                Read the configuration from the file and assign it to the key.
            */

            config = exports.readConfigFileSync(absPath);

            if (config) {
                configs[key] = config;
            }
        }
    }

    return configs;
};

/*
    Reads the given "sourceDir" and "defaultDir" if provided.
    The values from "sourceDir" will overwrite "defaultDir".
*/

exports.read = function (sourceDir, defaultDir) {

    var cfg = {},
        def = {};

    if (sourceDir) {
        cfg = this.readConfigDirSync(sourceDir);
    }

    if (defaultDir) {
        def = this.readConfigDirSync(defaultDir);
        return this.objectMerge(def, cfg);
    }

    return cfg;
};