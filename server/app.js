
/*
    Load the modules required.
*/

var express = require("express"),
    consolidate = require('consolidate'),
    configs = require("./lib/configs"),
    checker = require("./lib/checker"),
    notifier = require("./lib/notifier"),
    path = require("path"),
    app = express();

/*
    Set the root location of the configuration files
*/

configs.root = path.join(__dirname, "cfg");

/*
    assign the swig engine to .html files
*/

app.engine('html', consolidate.handlebars);

/*
    set .html as the default extension 
*/

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(express.bodyParser());

app.get("/", function (req, res) {

    configs.readConfigs(function (accounts) {

        accounts.push({
            label: "Save"
        });

        res.render("list", {accounts: accounts});
    });
});

app.post("/save", function (req, res) {

    if (req.body.action === "Delete") {
        configs.deleteConfig(req.body.username);
    } else if (req.body.action === "Save") {
        configs.saveConfig({
            username: req.body.username,
            password: req.body.password,
            host: req.body.host,
            port: req.body.port,
            secure: req.body.secure
        });
    }

    res.redirect("/");
});

app.get("/check", function (req, res) {
    checker.check();
    res.redirect("/");
});

app.get("/notify", function (req, res) {
    notifier.sendAlert();
    res.redirect("/");
});

app.listen(8080);
