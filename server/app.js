var express = require("express"),
    consolidate = require('consolidate'),
    mail = require("./lib/mail"),
    path = require("path"),
    app = express();

/*
    Set the root location of the configuration files
*/

mail.root = path.join(__dirname, "cfg");

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

    mail.readConfigs(function (accounts) {

        accounts.push({
            label: "Save"
        });

        res.render("list", {accounts: accounts});
    });
});

app.post("/save", function (req, res) {

    if (req.body.action === "Delete") {
        mail.deleteConfig(req.body.username);
    } else if (req.body.action === "Save") {
        mail.saveConfig({
            username: req.body.username,
            password: req.body.password,
            host: req.body.host,
            port: req.body.port,
            secure: req.body.secure
        });
    }

    res.redirect("back");
});

app.listen(8080);
