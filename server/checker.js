
/*
    Load the modules required.
*/

var util = require('util'),
    ImapConnection = require('imap').ImapConnection,
    mail = require("./lib/mail"),
    path = require("path"),
    alerts = require("./lib/serial");

/*
    Set the root location of the configuration files.
*/

mail.root = path.join(__dirname, "cfg");

/*
    Check each account for new messages.
*/

mail.readConfigs(function (accounts) {

    accounts.forEach(function (account) {

        var imap = new ImapConnection(account);

        imap.connect(function (err) {

            if (err) {
                console.log('Uh oh: ' + err);
            } else {
                imap.openBox('INBOX', false, function (err, mailbox) {

                    console.log(mailbox);
                    
                    if (account.uidnext === mailbox.uidnext) {
                        imap.logout();
                        return;
                    }

                    /*
                        Grab the value of "uidnext" so we can compare it next time.
                    */

                    account.uidnext = mailbox.uidnext;

                    /*
                        Save the updated configuration.
                    */

                    mail.saveConfig(account, function (err) {
                        console.log(mailbox);
                        imap.logout();
                        alerts.triggerAlert();
                    });
                });
            }
        });
    });
});