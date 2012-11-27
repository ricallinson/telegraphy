
/*
    Load the modules required.
*/

var fs = require("fs"),
    path = require("path"),
    crypto = require('crypto'),
    SECRET = "xxx",
    EXT = ".cfg";

/*
    Encode the given string
*/

function encode(text, secret) {
    var cipher = crypto.createCipher('aes-256-cbc', secret),
        crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

/*
    Decode the given string
*/

function decode(text, secret) {
    var decipher = crypto.createDecipher('aes-256-cbc', secret),
        dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

/*
    The directory of the configuration files
*/

exports.root = "";

/*
    Saves the given JS object to an encrypted configuration file
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
        fn(false);
        return;
    }

    fs.writeFile(filename, file, "utf8", function (err) {
        if (err) {
            console.log("Error saving: " + filename);
            fn(false);
        }
        console.log("Successfully saved: " + filename);
        fn(true);
    });
};

/*
    Deletes the configuration file saved with "username"
*/

exports.deleteConfig = function (username, fn) {

    var filename = path.join(exports.root, username + EXT);

    if (!fn) {
        fn = function () {};
    }

    fs.unlink(filename, function (err) {
        if (err) {
            console.log("Error deleting: " + filename);
            fn(false);
        }
        console.log("Successfully deleted: " + filename);
        fn(true);
    });
};

/*
    Reads each encrypted configuration file found in "exports.root" and returns them
    decrypted as an array of JS objects.
*/

exports.readConfigs = function (fn) {

    fs.readdir(exports.root, function (err, list) {

        var configs = [];

        list.forEach(function (filename) {
            var json;
            if (/.cfg$/.test(filename)) {
                file = decode(fs.readFileSync(path.join(exports.root, filename), "utf8"), SECRET);
                json = JSON.parse(file);
                configs.push(json);
            }
        });

        fn(configs);
    });
};