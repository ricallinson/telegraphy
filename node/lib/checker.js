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

var util = require('util'),
    ImapConnection = require('imap').ImapConnection,
    configs = require("./configs"),
    notifier = require("./notifier"),
    path = require("path");

/*
    Set the root location of the configuration files.
*/

configs.root = path.join(__dirname, "cfg");

/*
    Check each account for new messages.
*/

exports.check = function () {

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

            /*
                Log each step so we can debug if something goes wrong.
            */

            console.log("Checking imap account for mailbox '" + account.username + "' .");

            /*
                Create an IMAP connection for the account.
            */

            var imap = new ImapConnection(account);

            /*
                And then try and connect to it.
            */

            imap.connect(function (err) {

                /*
                    If there was an error there is nothing more we can do so return.
                */

                if (err) {
                    console.log("Error opening mailbox '" + account.username + "'; " + err);
                    return;
                }

                /*
                    With the IMAP connection we open the mail box to see if there is a change.
                */

                imap.openBox('INBOX', false, function (err, mailbox) {

                    console.log("Mailbox '" + account.username + "' opened.");

                    /*
                        To see if something has changed we look at the "uidnext"
                        and compare it to the one stored in the configuration.

                        If there has been any new messages since the last check this
                        value will be different.
                    */

                    if (account.uidnext === mailbox.uidnext) {

                        /*
                            If the two values are the same then there was no change
                            and we can logout of the IMAP account and return.
                        */

                        console.log("No change at mailbox '" + account.username + "'.");
                        imap.logout();
                        return;
                    }

                    /*
                        Grab the value of "uidnext" so we can compare it next time.
                    */

                    account.uidnext = mailbox.uidnext;

                    console.log("Mailbox '" + account.username + "' had new mail.");

                    /*
                        Save the updated configuration.
                    */

                    configs.saveConfig(account, function (err) {

                        /*
                            Local var for fetching the most recent email.
                        */

                        var fetch;

                        /*
                            If there was an error logout and return.
                        */

                        if (err) {
                            console.log("Error saving configuration for mailbox '" + account.username + "'.");
                            imap.logout();
                            return;
                        }

                        /*
                            Get the subject of the most recent email.
                        */
                            
                        fetch = imap.seq.fetch(
                            mailbox.messages.total + ':*', {
                                request: {
                                    headers: ['subject'],
                                    body: false,
                                    struct: false
                                }
                            }
                        );

                        /*
                            Listen for the message fetch to arrive.
                        */

                        fetch.on('message', function (msg) {

                            /*
                                Listen for the end of the actual message.
                            */

                            msg.on('end', function() {

                                /*
                                    Set the default alert text.
                                */

                                var text = "New mail";

                                /*
                                    Only use the subject for the alert text if one is found.
                                */

                                if (msg.headers && msg.headers.subject && msg.headers.subject.length) {
                                    text = msg.headers.subject[0];
                                }

                                /*
                                    Now tell the notifier to send an alert.
                                */

                                notifier.sendAlert(text);
                            });
                                
                        });

                        /*
                            Listen for the end of the message fetch.
                        */

                        fetch.on('end', function () {

                            /*
                                With all our work done we can now logout of the IMAP account.
                            */

                            imap.logout();
                        });
                    });
                });
            });
        });
    });
};
