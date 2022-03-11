const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv"); /* NOTE: környezeti változó */
const fs = require("fs");
const conf = dotenv.config();
const port = conf.parsed.ADMINPORT;
var mysql = require("mysql");
const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.static("public/js"));
app.use(express.static("public/css"));
app.use(express.static("public/img"));

/* INFO: lasttransaction */
app.get("/lasttransaction", (req, res) => {
    console.log("lasttransaction OK");
    res.sendFile(__dirname + "/last-transaction.json");
});

/* INFO: MySQL connection */
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pultosterminal",
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected! 😎");
    console.log();
});

/* INFO: termek nev lekeres */
con.query("SELECT * FROM termekek", (err, data) => {
    if (err) throw err;
    console.log(data[1].id + " " + data[1].nev);
    termekeks = data;
});

/* INFO: induló képernyő */
app.get("/", (req, res) => {
    console.log("ADMIN console OK");
    res.sendFile(__dirname + "/views/admin.html");
});

/* INFO: /dataread 😋😋😋😋😋😋*/
app.get("/dataread", (req, res) => {
    con.query("SELECT * FROM termekek", (err, data) => {
        if (err) throw err;
        console.log(data[1].id + " " + data[1].nev);
        res.send(data);
    });
});

/* INFO: /datareadcsoport 😋😋😋😋😋😋*/
app.get("/datareadcsoport", (req, res) => {
    con.query("SELECT * FROM csoportok", (err, data) => {
        if (err) throw err;
        console.log(data[2].nev + " " + data[2].nev);
        res.send(data);
    });
});

/* INFO: /datareadkiszerelés 😋😋😋😋😋😋*/
app.get("/datareadkiszereles", (req, res) => {
    con.query("SELECT * FROM kiszereles", (err, data) => {
        if (err) throw err;
        console.log(data[0].nev + " " + data[0].nev);
        res.send(data);
    });
});

/* INFO: /datareadxkimeres 😋😋😋😋😋😋*/
app.get("/datareadxkimeres", (req, res) => {
    con.query("SELECT * FROM xkimeres", (err, data) => {
        if (err) throw err;
        console.log(data[0].termek_nev + " " + data[0].termek_nev);
        res.send(data);
    });
});

/* INFO: /datareadxkimeresnev 😋😋😋😋😋😋*/
app.get("/datareadxkimeresnev", (req, res) => {
    con.query("SELECT * FROM xkimeresnev", (err, data) => {
        if (err) throw err;
        console.log(data[1].urtartalom + " " + data[1].nev);
        res.send(data);
    });
});
/* INFO: /datareadkiszereles 😋😋😋😋😋😋*/
/* app.get("/datareadkiszereles", (req, res) => {
        con.query("SELECT * FROM kiszereles", (err, data) => {
            if (err) throw err;
            console.log(data[1].urtartalom + " " + data[1].nev);
            res.send(data);
        });
    }); */

/* INFO: config */
app.get("/config", (req, res) => {
    console.log("PIN pad console OK");
    res.sendFile(__dirname + "/views/config.html");
});

/* INFO: xkimeresnev */
app.get("/xkimeresnev", (req, res) => {
    console.log("xkimeresnev console OK");
    res.sendFile(__dirname + "/views/xkimeresnev.html");
});
/* INFO: kiszereles */
app.get("/kiszereles", (req, res) => {
    console.log("kiszereles console OK");
    res.sendFile(__dirname + "/views/kiszereles.html");
});
/* INFO: insert  INFO: START INFO: INFO: INFO: INFO: INFO: INFO:*/
app.post("/insert", bodyParser.json(), (req, res) => {
    const insertData = [req.body.nev, req.body.urtartalom];
    const nev = req.body.nev;
    const urtartalom = req.body.urtartalom;
    console.log(nev);
    console.log("urtartalom");
    console.log(urtartalom);

    /* INFO: INFO: INFO: */
    con.query(
        "INSERT INTO xkimeresnev (nev, urtartalom) VALUES (?)",
        [insertData],
        (err, data) => {
            if (err) throw err;
            res.send(data);
        }
    );
    /* INFO: INFO: INFO: */

    console.log("xkimeresnev console OK");
    res.sendFile(__dirname + "/views/xkimeresnev.html");
});
/* INFO: insert  INFO: STOP INFO: INFO: INFO: INFO: INFO: INFO:*/
/* INFO: insert  INFO: START INFO: INFO: INFO: INFO: INFO: INFO:*/
app.post("/insertkiszereles", bodyParser.json(), (req, res) => {
    const insertData = [req.body.nev, req.body.urtartalom];
    const nev = req.body.nev;
    const urtartalom = req.body.urtartalom;
    console.log(nev);
    console.log("urtartalom");
    console.log(urtartalom);

    /* INFO: INFO: INFO: */
    con.query(
        "INSERT INTO xkimeresnev (nev, urtartalom) VALUES (?)",
        [insertData],
        (err, data) => {
            if (err) throw err;
            res.send(data);
        }
    );
    /* INFO: INFO: INFO: */

    console.log("kiszereles console OK");
    res.sendFile(__dirname + "/views/kiszereles.html");
});
/* INFO: insert  INFO: STOP INFO: INFO: INFO: INFO: INFO: INFO:*/

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

app.listen(port, () => console.log("server is OK 😋 ADMINPORT: " + port));

//const user = ["Adminisztátor", "Pultos 1", "Pultos 2", "Pultos 3", "Pultos 4"];
/* const password = [
    conf.parsed.ADMIN,
    conf.parsed.PULTOS1,
    conf.parsed.PULTOS2,
    conf.parsed.PULTOS3,
    conf.parsed.PULTOS4,
]; */
/* INFO: alter tabla lekeres */
/* con.query("SELECT * FROM `kimert_termek`", (err, kimerve) => {
    if (err) throw err;
    console.log(kimerve);
    console.log(kimerve[0].termekeksid);
}); */
//const products = products.json;
/* res.send(
        "Ez már komolyabb routing!!! 😉<br><h1>De ami a lényeg az, hogy SAJÁT! 😋😋😋"
    ); */
