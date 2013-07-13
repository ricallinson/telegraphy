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

var ImapConnection = require("imap").ImapConnection;

/*
    Helper function to log a message on imap logout.
*/

function logout(imap, account) {
    console.log("Logging out of imap mailbox \"" + account.username + "\"");
    imap.logout();
}

/*
    Given an account object this function will try and retive the last unread email subject.
*/

exports.check = function (account, callback) {

    var imap;

    /*
        Log each step so we can debug if something goes wrong.
    */

    console.log("Checking imap account for mailbox \"" + account.username + "\" .");

    /*
        Typecast input values to be safe.
    */

    account.port = parseInt(account.port, 10);

    if (typeof account.secure === "string") {
        account.secure = account.secure === "true" ? true : false;
    }

    /*
        Create an IMAP connection for the account.
    */

    imap = new ImapConnection(account);

    /*
        And then try and connect to it.
    */

    imap.connect(function (err) {

        /*
            If there was an error there is nothing more we can do so return.
        */

        if (err) {
            console.log("Error opening imap mailbox \"" + account.username + "\"; " + err);
            callback();
            return;
        }

        /*
            With the IMAP connection open we can read the mail box to see if there is a change.
        */

        imap.openBox("INBOX", false, function (err, mailbox) {

            if (err) {
                console.log("No action performed as there was an error opening the imap mailbox \"" + account.username + "\".");
                logout(imap, account);
                callback();
                return;
            }

            console.log("Imap mailbox \"" + account.username + "\" opened.");

            /*
                To see if something has changed we look at the "uidnext"
                and compare it to the one stored in the configuration.

                If there has been any new messages since the last check this
                value will be different.
            */

            /*
                Un-comment the following line to force the reading of emails (good for testing).
            */

            // account.uidnext = 0;

            if (account.uidnext === mailbox.uidnext) {

                /*
                    If the two values are the same then there was no change
                    and we can logout of the IMAP account and return.
                */

                console.log("No change for imap mailbox \"" + account.username + "\".");
                logout(imap, account);
                callback();
                return;
            }

            /*
                Grab the value of "uidnext" so we can compare it next time.
            */

            account.uidnext = mailbox.uidnext;

            console.log("Imap mailbox \"" + account.username + "\" had new mail.");

            /*
                Get the subject of the most recent email.
            */

            imap.seq.fetch(
                mailbox.messages.total + ":*",
                {},
                {
                    headers: ["subject"],
                    body: false,
                    cb: function (fetch) {

                        /*
                            Listen for the message fetch to arrive.
                        */

                        fetch.on("message", function (msg) {

                            /*
                                Listen for the headers of the message.
                            */

                            msg.on("headers", function (headers) {

                                /*
                                    Set the default alert text.
                                */

                                var text = "New email received";

                                /*
                                    Only use the subject for the alert text if one is found.
                                */

                                if (headers && headers.subject && headers.subject.length) {
                                    text = headers.subject[0];
                                }

                                /*
                                    Now tell the notifier to send an alert and update the account configuration.
                                */

                                callback(text, account);
                            });
                        });
                    }
                }, function (err) {
                    if (err) {
                        console.log("Error fetching message from imap mailbox!");
                        callback();
                    }
                    logout(imap, account);
                }
            );
        });
    });
};