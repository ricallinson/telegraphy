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

/*
    Load the modules required.
*/

var fs = require("fs"),
    path = require("path"),
    crypto = require('crypto'),
    SECRET = "xxx",
    EXT = ".cfg",
    REGEX_EXT = /.cfg$/;

/*
    Encode the given string.
*/

function encode(text, secret) {
    var cipher = crypto.createCipher('aes-256-cbc', secret),
        crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

/*
    Decode the given string.
*/

function decode(text, secret) {
    var decipher = crypto.createDecipher('aes-256-cbc', secret),
        dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

/*
    The directory used for the configuration files.
*/

exports.root = "";

/*
    Saves the given JS object to an encrypted configuration file.
*/

exports.saveConfig = function (cfg, fn) {

    var filename = path.join(exports.root, cfg.username + EXT),
        json = JSON.stringify(cfg),
        file = encode(json, SECRET);

    /*
        If we were not given a callback create a fake one.
    */

    if (!fn) {
        fn = function () {};
    }

    /*
        If there is no "username" we cannot make a configuration file.
    */

    if (!cfg.username) {
        console.log("Error saving as no username was given: " + filename);
        fn(false);
        return;
    }

    /*
        Write the configuration file to disk in the "exports.root" directory.
    */

    fs.writeFile(filename, file, "utf8", function (err) {
        if (err) {
            console.log("Error saving: " + filename);
            fn(true);
            return;
        }
        console.log("Successfully saved: " + filename);
        fn(false);
    });
};

/*
    Deletes the configuration file saved with "username".
*/

exports.deleteConfig = function (username, fn) {

    var filename = path.join(exports.root, username + EXT);

    /*
        If we were not given a callback create a fake one.
    */

    if (!fn) {
        fn = function () {};
    }

    /*
        Delete the "username" configuration file in the "exports.root" directory.
    */

    fs.unlink(filename, function (err) {
        if (err) {
            console.log("Error deleting: " + filename);
            fn(true);
        }
        console.log("Successfully deleted: " + filename);
        fn(false);
    });
};

/*
    Reads each encrypted configuration file found in "exports.root" and returns them
    decrypted as an array of JS objects.
*/

exports.readConfigs = function (fn) {

    fs.readdir(exports.root, function (err, list) {

        var configs = [];

        /*
            If there are no files in the folder set the list to an empty array.
        */

        if (!list) {
            list = [];
        }

        /*
            For each file in the list.
        */

        list.forEach(function (filename) {

            var json;

            /*
                Check that the file is one of our configuration files.
            */

            if (REGEX_EXT.test(filename)) {

                /*
                    Read the raw file and decode it.
                */

                file = decode(fs.readFileSync(path.join(exports.root, filename), "utf8"), SECRET);

                /*
                    The decoded file is in JSON so parse it into a JS object.
                */

                json = JSON.parse(file);

                /*
                    Add the final object to the "configs" array.
                */

                configs.push(json);
            }
        });

        /*
            Return the array of configuration objects.
        */

        fn(configs);
    });
};
