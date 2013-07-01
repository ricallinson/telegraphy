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
    Check each account found in the given configs object for new messages.
*/

exports.check = function (configs, notifier) {

    var checker;

    console.log("Opening configuration files to check.");

    /*
        First we have to read in all the configurations.
    */

    configs.readConfigs(function (accounts) {

        /*
            If no accounts are provided we just log a message and return.
        */

        if (accounts.length === 0) {
            console.log("No configuration files were found for checking.");
            return;
        }

        /*
            Now we loop through each of the accounts returned to check them.
        */

        accounts.forEach(function (account) {

            checker = require("./checkers/" + account.type);

            /*
                Check if the requested checker is supported.
            */

            if (checker && typeof checker.check === "function") {

                /*
                    With an account and checker we can now try and get a message.
                */

                checker.check(account, function (msg, updatedAccountCfg) {

                    if (msg) {

                        /*
                            Tell the notifier to send an alert.
                        */

                        notifier.sendAlert(msg);
                    }

                    if (updatedAccountCfg) {

                        /*
                            Save the updated configuration.
                        */

                        configs.saveConfig(updatedAccountCfg, function () {
                            // ...
                        });
                    }
                });

            } else {
                console.log("No checker was found for account \"" + account.username + "\" .");
            }
        });
    });
};
