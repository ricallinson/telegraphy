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

var fs = require("fs"),
    path = require("path"),
    crypto = require("crypto"),
    SECRET = "xxx",
    EXT = ".cfg",
    REGEX_EXT = /.cfg$/;

/*
    Encode the given string.
*/

function encode(text, secret) {
    var cipher = crypto.createCipher("aes-256-cbc", secret),
        crypted = cipher.update(text, "utf8", "hex");
    crypted += cipher.final("hex");
    return crypted;
}

/*
    Decode the given string.
*/

function decode(text, secret) {
    var decipher = crypto.createDecipher("aes-256-cbc", secret),
        dec = decipher.update(text, "hex", "utf8");
    try {
        dec += decipher.final("utf8");
        return dec;
    } catch (err) {
        return "{}";
    }
}

/*
    The directory used for the configuration files.
*/

exports.root = "";

/*
    Saves the given JS object to an encrypted configuration file.
*/

exports.saveConfig = function (cfg, fn) {

    /*
        Declare some variables.
    */

    var filename,
        json,
        file;

    /*
        If we were not given a callback create a fake one.
    */

    if (!fn) {
        throw new Error("A callback function is required.");
    }

    /*
        If there is no "username" we cannot make a configuration file.
    */

    if (!cfg || !cfg.username) {
        console.log("Error saving as no username was given for configuration file: " + filename);
        fn(false);
        return;
    }

    /*
        Set the filename and file content.
    */

    filename = path.join(exports.root, cfg.username + EXT);
    json = JSON.stringify(cfg);
    file = encode(json, SECRET);

    /*
        Write the configuration file to disk in the "exports.root" directory.
    */

    fs.writeFile(filename, file, "utf8", function (err) {
        if (err) {
            console.log("Error saving configuration file: " + filename);
            fn(false);
            return;
        }
        console.log("Successfully saved configuration: " + filename);
        fn(true);
    });
};

/*
    Deletes the configuration file saved with "username".
*/

exports.deleteConfig = function (username, fn) {

    var filename;

    /*
        If we were not given a callback create a fake one.
    */

    if (!fn) {
        throw new Error("A callback function is required.");
    }

    filename = path.join(exports.root, username + EXT);

    /*
        Delete the "username" configuration file in the "exports.root" directory.
    */

    fs.unlink(filename, function (err) {
        if (err) {
            console.log("Error deleting configuration file: " + filename);
            fn(false);
            return;
        }
        console.log("Successfully deleted configuration file: " + filename);
        fn(true);
    });
};

/*
    Reads an encrypted configuration file found at "abspath" and returns it
    as a decrypted JS objects.
*/

exports.readConfig = function (abspath) {

    var cfg,
        file;

    /*
        Read the raw file and decode it.
    */

    file = decode(fs.readFileSync(abspath, "utf8"), SECRET);

    /*
        The decoded file is in JSON so parse it into a JS object.
    */

    cfg = JSON.parse(file);

    /*
        Return the decrypted JS object.
    */

    return cfg;
};

/*
    Reads each encrypted configuration file found in "exports.root" and returns them
    decrypted as an array of JS objects.
*/

exports.readConfigs = function (fn) {

    var self = this;

    /*
        If we were not given a callback create a fake one.
    */

    if (!fn) {
        throw new Error("A callback function is required.");
    }

    fs.readdir(this.root, function (err, list) {

        var configs = [];

        if (err) {
            console.log("No configuration files were loaded as there was an error reading the directory: " + exports.root);
            list = [];
        }

        /*
            For each file in the list.
        */

        list.forEach(function (filename) {

            var cfg;

            /*
                Check that the file is one of our configuration files.
            */

            if (REGEX_EXT.test(filename)) {

                cfg = self.readConfig(path.join(exports.root, filename));

                /*
                    If we are given an object with a username add
                    it to the configuration objects array.
                */

                if (cfg && cfg.username) {
                    configs.push(cfg);
                }
            }
        });

        /*
            Return the array of configuration objects.
        */

        fn(configs);
    });
};
