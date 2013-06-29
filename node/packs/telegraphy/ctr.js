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

/* jshint camelcase: false */

"use strict";

/*
    Load the modules required.
*/

var composite = require("express-composite"),
    confdir = require("confdir"),
    configs = require("../../lib/configs"),
    notifier = require("../../lib/notifier"),
    checker = require("../../lib/checker");

/*
    The main URL for the web application.
*/

exports.GET_index = function (req, res) {

    composite.render({
        tmpl: "telegraphy/views/index",
        slots: {
            body: {
                module: "telegraphy/ctr",
                action: "index"
            }
        }
    }, req, res);
};

exports.index = function (req, res) {

    var messages = confdir.read(__dirname + "/confs").presets;

    res.render("telegraphy/views/home", {messages: messages});
};

/*
    This URL is used to create or edit accounts.
*/

exports.GET_accounts = function (req, res) {
    
    composite.render({
        tmpl: "telegraphy/views/index",
        slots: {
            body: {
                module: "telegraphy/ctr",
                action: "accounts"
            }
        }
    }, req, res);
};

exports.accounts = function (req, res) {

    configs.readConfigs(function (accounts) {

        /*
            Add an empty account so it can be used create a new one.
        */

        accounts.push({
            port: 993,
            secure: false
        });

        /*
            Render the accounts in the main HTML page.
        */

        res.render("telegraphy/views/accounts", {accounts: accounts});
    });
};

/*
    This URL is used to test the the Arduino is working correctly.
*/

exports.GET_notify = function (req, res) {
    notifier.sendAlert(req.query.msg || "Testing");
    res.redirect("/");
};

/*
    This URL is used to save a new account or update one.
*/

exports.PODT_save = function (req, res) {
    if (req.body.action === "Delete") {
        configs.deleteConfig(req.body.username);
    } else if (req.body.action === "Save") {
        configs.saveConfig({
            type: "imap",
            username: req.body.username,
            password: req.body.password,
            host: req.body.host,
            port: req.body.port,
            secure: (req.body.secure === "true" ? "true" : "")
        });
    }

    res.redirect("/accounts");
};

/*
    This URL is used to force the checking of new mail.
*/

exports.GET_check = function (req, res) {
    checker.check(configs, notifier);
    res.redirect("/accounts");
};

/*
    This URL is used to re-connect each Arduino.
*/

exports.GET_reset = function (req, res) {
    notifier.connect(program.serialPort);
    res.redirect("/");
};
