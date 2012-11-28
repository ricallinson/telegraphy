
/*
    Load the modules required.
*/

var util = require('util'),
    ImapConnection = require('imap').ImapConnection,
    mail = require("./configs"),
    notifier = require("./notifier"),
    path = require("path");

/*
    Set the root location of the configuration files.
*/

mail.root = path.join(__dirname, "cfg");

/*
    Check each account for new messages.
*/

exports.check = function () {

    console.log("Opening configuration files to check.");

    mail.readConfigs(function (accounts) {

        accounts.forEach(function (account) {

            console.log("Checking imap account for mailbox '" + account.username + "' .");

            var imap = new ImapConnection(account);

            imap.connect(function (err) {

                if (err) {
                    console.log('Uh oh: ' + err);
                } else {
                    imap.openBox('INBOX', false, function (err, mailbox) {

                        console.log("Mailbox '" + account.username + "' opened.");

                        if (account.uidnext === mailbox.uidnext) {
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

                        mail.saveConfig(account, function (err) {

                            if (err) {
                                console.log("Error saving configuration for mailbox '" + account.username + "'.");
                            }

                            imap.logout();
                            notifier.sendAlert();
                        });
                    });
                }
            });
        });
    });
};