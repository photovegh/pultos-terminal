const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv"); /* NOTE: környezeti változó */
const conf = dotenv.config();
const fs = require("fs");
var port = conf.parsed.PORT;
var mysql = require("mysql");
const app = express();

app.use(express.static("public"));
app.use(express.static("public/js"));
app.use(express.static("public/css"));
app.use(express.static("public/img"));

/* TODO:TODO:TODO:TODO:TODO:TODO:TODO: */
/* NOTE: inserttransactions  NOTE:NOTE:NOTE:NOTE:NOTE:NOTE:NOTE: */
app.post("/inserttransactions", bodyParser.json(), (req, res) => {
    const insertData = [
        req.body.trnumber,
        req.body.trdate,
        req.body.trfizetesmod,
        req.body.megjegyzes,
        req.body.pultos,
    ];
    /* FIXME:FIXME:FIXME: */
    con.query(
        "INSERT INTO transactions (trnumber, trdate, trfizetesmod, megjegyzes, pultos) VALUES (?)",
        [insertData],
        (err, data) => {
            try {
                res.send(data);
            } catch {
                if (err) throw err;
            }
        }
    );
    console.log("insertData/////////////");
    console.log(insertData);
    /* FIXME:FIXME:FIXME: */
});

/* TODO:TODO:TODO:TODO:TODO:TODO:TODO: */
/* NOTE: insertforgalom  NOTE:NOTE:NOTE:NOTE:NOTE:NOTE:NOTE: */
app.post("/insertforgalom", bodyParser.json(), (req, res) => {
    const insertData = [
        req.body.transaction_id,
        req.body.termekid,
        req.body.db,
        req.body.eladottbeszar,
        req.body.eladottelar,
        req.body.eladottdate,
        req.body.xkimeresnevid,
    ];
    /* FIXME:FIXME:FIXME: */
    con.query(
        "INSERT INTO forgalom (transaction_id, termekid, db, eladottbeszar, eladottelar, eladottdate, xkimeresnevid) VALUES (?)",
        [insertData],
        (err, data) => {
            try {
                res.send(data);
            } catch {
                if (err) throw err;
            }
        }
    );
    console.log("insertData************");
    console.log(insertData);
    /* FIXME:FIXME:FIXME: */
});

/* TODO:TODO:TODO:TODO:TODO:TODO:TODO: */
/* TODO: //lasttransactionid 😋😋😋😋😋😋*/
app.get("/lasttransactionid", (req, res) => {
    con.query("SELECT max(id) FROM transactions", (err, data) => {
        if (err) throw err;
        res.send(data);
    });
});
/* TODO: //lasttransactionid 😋😋😋😋😋😋*/
/* TODO:TODO:TODO:TODO:TODO:TODO:TODO: */

/* TODO:TODO:TODO:TODO:TODO:TODO:TODO: */
app.patch("/keszletmodositas", bodyParser.json(), (req, res) => {
    var insertData = [req.body.sumcl];
    var id = req.body.id;
    console.log("insertData");
    console.log(insertData);
    con.query(
        "UPDATE termekek SET sumcl = ? WHERE id = ?",
        [insertData, id],
        (err, data) => {
            try {
                res.send(data);
            } catch {
                if (err) throw err;
            }
        }
    );
});
/* TODO:TODO:TODO:TODO:TODO:TODO:TODO: */

/* TODO: //datareadkevert 😋😋😋😋😋😋*/
app.get("/datareadkevert", (req, res) => {
    con.query("SELECT * FROM kevert", (err, data) => {
        if (err) throw err;
        res.send(data);
    });
});

/* INFO: lasttransactionread */
app.get("/lasttransactionread", (req, res) => {
    con.query("SELECT * FROM transaction", (err, data) => {
        if (err) throw err;
        res.send(data);
    });
});
/* app.get("/@@@@@@@read", (req, res) => {
    con.query("SELECT * FROM @@@@@@@", (err, data) => {
        if (err) throw err;
        res.send(data);
    });
}); */
app.get("/gettransactions", (req, res) => {
    con.query(
        "SELECT * FROM transactions WHERE trdate >= '2022-04-11T19:00:00'",
        (err, data) => {
            if (err) throw err;
            res.send(data);
        }
    );
});

//BUG:BUG:BUG:BUG:BUG:BUG: torolni
app.get("/lasttransaction", (req, res) => {
    console.log("lasttransaction OK");
    res.sendFile(__dirname + "/last-transaction.json");
});
//BUG:BUG:BUG:BUG:BUG:BUG: torolni

/* INFO: MySQL connection */
/* var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pultosterminal",
}); */
var con = mysql.createConnection({
    host: "localhost",
    user: "pultos",
    password: "Terminal-2022",
    database: "pultosterminal",
});
/* INFO: MySQL connection */

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected! 😎");
});

/* INFO: termek nev lekeres */
con.query("SELECT * FROM termekek", (err, data) => {
    if (err) throw err;
    termekeks = data;
});

/* INFO: induló képernyő */
app.get("/", (req, res) => {
    console.log("PIN pad console OK");
    res.sendFile(__dirname + "/views/index.html");
});

/* INFO: /dataread 😋😋😋😋😋😋*/
app.get("/dataread", (req, res) => {
    con.query("SELECT * FROM termekek", (err, data) => {
        if (err) throw err;
        res.send(data);
    });
});

/* INFO: /datareadcsoport 😋😋😋😋😋😋*/
app.get("/datareadcsoport", (req, res) => {
    con.query("SELECT * FROM csoportok", (err, data) => {
        if (err) throw err;
        res.send(data);
    });
});

/* INFO: /datareadkiszerelés 😋😋😋😋😋😋*/
app.get("/datareadkiszereles", (req, res) => {
    con.query("SELECT * FROM kiszereles", (err, data) => {
        if (err) throw err;
        res.send(data);
    });
});

/* INFO: /datareadxkimeres 😋😋😋😋😋😋*/
app.get("/datareadxkimeres", (req, res) => {
    con.query("SELECT * FROM xkimeres", (err, data) => {
        if (err) throw err;
        res.send(data);
    });
});

/* INFO: /datareadxkimeresnev 😋😋😋😋😋😋*/
app.get("/datareadxkimeresnev", (req, res) => {
    con.query("SELECT * FROM xkimeresnev", (err, data) => {
        if (err) throw err;
        res.send(data);
    });
});

/* INFO: /dataread2 😋😋😋😋😋😋*/
app.get("/dataread2", (req, res) => {
    con.query("SELECT * FROM termekek", (err, rows) => {
        if (err) throw err;
        console.log(rows);
        var xxx = [];
        let i = 0;
        rows.forEach((row) => {
            xxx[i] += row.nev;
            i++;
        });
        res.send(JSON.stringify(xxx[2]));
    });
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
//app.listen(55555);
app.listen(port, () => console.log("server is OK 😋 PORT: " + port));
//app.listen(7755, () => console.log("server is OK 😋 PORT: "));

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
