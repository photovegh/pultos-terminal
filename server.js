const express = require("express");
const dotenv = require("dotenv"); /* NOTE: környezeti változó */
const fs = require("fs");
const conf = dotenv.config();
const port = conf.parsed.PORT;

var mysql = require("mysql");
//const user = ["Adminisztátor", "Pultos 1", "Pultos 2", "Pultos 3", "Pultos 4"];
/* const password = [
    conf.parsed.ADMIN,
    conf.parsed.PULTOS1,
    conf.parsed.PULTOS2,
    conf.parsed.PULTOS3,
    conf.parsed.PULTOS4,
]; */
const app = express();

app.use(express.static("public"));
app.use(express.static("public/js"));
app.use(express.static("public/css"));
app.use(express.static("public/img"));

/* INFO: MySQL connection */
var con = mysql.createConnection({
    host: "valami.online:57777",
    user: "root",
    password: "susuSoft_0913x",
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

/* INFO: induló képernyő */
app.get("/", (req, res) => {
    console.log("PIN pad console OK");
    res.sendFile(__dirname + "/views/index.html");
});
/* INFO: config */
app.get("/config", (req, res) => {
    console.log("PIN pad console OK");
    res.sendFile(__dirname + "/views/config.html");
});
/* INFO: password authentication */
function loggerMiddleWare(req, res, next) {
    const pin = true;
    if (pin) {
        console.log("loggerMiddleWare is OK 😋 ");
        next();
    } else {
        console.log(body);
        /* res.status(401).send("Authentical error is NEMOK 🤔 "); */
        res.status(200).sendFile(__dirname + "/views/index.html");
        /* console.log("loggerMiddleWare is NEMOK 🤔 ");
        return; */
    }
}
app.get("/pult", loggerMiddleWare, (req, res) => {
    console.log("Pult console OK");
    res.sendFile(__dirname + "/views/pult.html");
});

app.listen(port, () => console.log("server is OK 😋 PORT: " + port));
