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
    //console.log("lasttransaction OK");
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
    //console.log("Connected! 😎");
    //console.log();
});

/* INFO: termek nev lekeres */
con.query("SELECT * FROM termekek", (err, data) => {
    if (err) throw err;
    //console.log(data[1].id + " " + data[1].nev);
    termekeks = data;
});

/* INFO: induló képernyő */
app.get("/", (req, res) => {
    console.log("ADMIN console OK");
    res.sendFile(__dirname + "/views/admin.html");
});

/* INFO: /dataread 😋HACK:HACK:😋*/
app.get("/dataread", (req, res) => {
    con.query("SELECT * FROM termekek", (err, data) => {
        if (err) throw err;
        //console.log(data[1].id + " " + data[1].nev);
        res.send(data);
    });
}); /*   HACK:HACK:      HACK:HACK: */

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
        //console.log(data[0].nev + " " + data[0].nev);
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
        //console.log(data[1].urtartalom + " " + data[1].nev);
        res.send(data);
    });
});

/* INFO: /datareadtermekek 😋😋😋😋😋😋*/
app.get("/datareadtermekek", (req, res) => {
    con.query("SELECT * FROM termekek", (err, data) => {
        if (err) throw err;
        //console.log(data[1].nev + " " + data[1].nev);
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
    //console.log("PIN pad console OK");
    res.sendFile(__dirname + "/views/config.html");
});

/* INFO: xkimeresnev */
app.get("/xkimeresnev", (req, res) => {
    //console.log("xkimeresnev console OK");
    res.sendFile(__dirname + "/views/xkimeresnev.html");
});
/* INFO: kiszereles */
app.get("/kiszereles", (req, res) => {
    //console.log("kiszereles console OK");
    res.sendFile(__dirname + "/views/kiszereles.html");
});
/* INFO: csoportok */
app.get("/csoportok", (req, res) => {
    console.log("csoportok console OK");
    res.sendFile(__dirname + "/views/csoportok.html");
});
/* INFO: termekek */
app.get("/termekek", (req, res) => {
    //console.log("termekek console OK");
    res.sendFile(__dirname + "/views/termekek.html");
});

/* INFO: insert  INFO: START INFO: INFO: INFO: INFO: INFO: INFO:*/
app.post("/insertxkimeresnev", bodyParser.json(), (req, res) => {
    const insertData = [req.body.nev, req.body.urtartalom];
    const nev = req.body.nev;
    const urtartalom = req.body.urtartalom;
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
    res.sendFile(__dirname + "/views/xkimeresnev.html");
});
/* INFO: insert  INFO: STOP INFO: INFO: INFO: INFO: INFO: INFO:*/

/* NOTE: insert  NOTE: START NOTE: NOTE: NOTE: NOTE: NOTE: NOTE:*/
app.post("/inserxkimeres", bodyParser.json(), (req, res) => {
    const insertData = [
        req.body.termek_id,
        req.body.termek_nev,
        req.body.xkimeresnev_id,
    ];
    //const nev = req.body.nev;
    //const urtartalom = req.body.urtartalom;
    /* INFO: INFO: INFO: */
    con.query(
        "INSERT INTO xkimeres (termek_id, termek_nev, xkimeresnev_id) VALUES (?)",
        [insertData],
        (err, data) => {
            if (err) throw err;
            res.send(data);
        }
    );
    /* INFO: INFO: INFO: */
    res.sendFile(__dirname + "/views/xkimeresnev.html");
});
/* NOTE: insert  NOTE: STOP NOTE: NOTE: NOTE: NOTE: NOTE: NOTE:*/

/* INFO: insertkiszereles  INFO: START INFO: INFO: INFO: INFO: INFO: INFO:*/
app.post("/insertkiszereles", bodyParser.json(), (req, res) => {
    const insertData = [req.body.nev, req.body.urtartalom];
    const nev = req.body.nev;
    const urtartalom = req.body.urtartalom;
    //console.log(nev);
    //console.log("urtartalom");
    //console.log(urtartalom);

    /* INFO: INFO: INFO: */
    con.query(
        "INSERT INTO kiszereles (nev, urtartalom) VALUES (?)",
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
/* INFO: insertkiszereles  INFO: STOP INFO: INFO: INFO: INFO: INFO: INFO:*/
/* INFO: insertcsoportok  INFO: START INFO: INFO: INFO: INFO: INFO: INFO:*/
app.post("/insertcsoportok", bodyParser.json(), (req, res) => {
    const insertData = [req.body.nev];
    const nev = req.body.nev;

    //console.log(nev);

    /* INFO: TODO: INFO: TODO: INFO: */
    con.query(
        "INSERT INTO csoportok (nev) VALUES (?)",
        [insertData],
        (err, data) => {
            try {
                res.send(data);
            } catch {
                if (err) throw err;
            }
        }
    );
    /* con.query(
        "INSERT INTO csoportok (nev) VALUES (?)",
        [insertData],
        (err, data) => {
            if (err) throw err;
            res.send(data);
        }
    ); */
    /* INFO: TODO: INFO: TODO: INFO: */

    //console.log("csoportok console OK");
    res.sendFile(__dirname + "/views/csoportok.html");
});
/* INFO: insertcsoportok  INFO: STOP INFO: INFO: INFO: INFO: INFO: INFO:*/

/* BUG: inserttermekek  BUG: START BUG: BUG: BUG: BUG: BUG: BUG:*/
app.post("/inserttermekek", bodyParser.json(), (req, res) => {
    const nev = req.body.nev;
    const beszar = req.body.beszar;
    /* TODO: NOTE: INFO: NOTE: TODO: */
    /* const kiszerelesId = req.body.kiszerelesId; */
    const kiszerelesId = req.body.kiszerelesId;
    const csoportId = req.body.csoportId;
    /* TODO: NOTE: INFO: NOTE: TODO: */
    //console.log(nev);
    //console.log("beszar");
    //console.log(beszar);
    //console.log("kiszerelesId***");
    //console.log(kiszerelesId);
    //console.log("csoportId***");
    //console.log(csoportId);
    /* TODO: NOTE: INFO: NOTE: TODO: */
    var insertData = [
        req.body.nev,
        req.body.beszar,
        req.body.elar,
        req.body.leltarozando,
        req.body.kritikus,
        req.body.gyujto,
        req.body.jelenlegiKeszlet,
        req.body.urtartalom,
        req.body.cl,
        req.body.kiszerelesId,
        req.body.csoportId,
    ];
    /* TODO: NOTE: INFO: NOTE: TODO: */
    /* INFO: INFO: INFO: */
    con.query(
        /* TODO: NOTE: INFO: NOTE: TODO: */
        "INSERT INTO termekek (nev, beszar, elar, leltarozando, kritikus, gyujto, keszlet, urtartalom, cl, kiszereles_id, csoport_id) VALUES (?)",
        /* TODO: NOTE: INFO: NOTE: TODO: */
        [insertData],
        (err, data) => {
            if (err) throw err;
            varBUG: insertData = [""];
            /* BUG:constBUG: insertData = [""]; */

            try {
                //console.log("data");
                //console.log(data);
                res.send(data);
            } catch {
                if (err) throw err;
            }
            /* res.send(data); */
        }
    );
    /* INFO: INFO: INFO: */

    //console.log("termekek console OK");
    res.sendFile(__dirname + "/views/termekek.html");
});
/* BUG: inserttermekek  BUG: STOP BUG: BUG: BUG: BUG: BUG: BUG:*/

/* INFO: password authentication */
function loggerMiddleWare(req, res, next) {
    const pin = true;
    if (pin) {
        //console.log("loggerMiddleWare is OK 😋 ");
        next();
    } else {
        //console.log(body);
        /* res.status(401).send("Authentical error is NEMOK 🤔 "); */
        res.status(200).sendFile(__dirname + "/views/index.html");
        /* console.log("loggerMiddleWare is NEMOK 🤔 ");
        return; */
    }
}

app.get("/pult", loggerMiddleWare, (req, res) => {
    //console.log("Pult console OK");
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
