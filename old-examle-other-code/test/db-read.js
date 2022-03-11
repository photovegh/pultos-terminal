const mysql = require("mysql"); //NOTE: DATABASES connection
const dotenv = require("dotenv"); /* NOTE: környezeti változó */
const res = require("express/lib/response");
const conf = dotenv.config();
/* const port = conf.parsed.PORT; */
const con = mysql.createConnection({
    host: conf.parsed.HOST,
    user: conf.parsed.USER,
    /* user: conf.USER, */
    password: conf.parsed.PSW,
    database: conf.parsed.DBF,
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    //FIXME: kiirandó MySQL parancs összeállítása
    /* var sql = //TODO:
        "INSERT INTO termekek (nev, beszar, mennyiseg) VALUES ('cóla', 121, 212)"; */
    //FIXME: Kiírás az adatbázisba
    /* con.query(sql, function (err, result) { //TODO:
        if (err) throw err;
        console.log("1 record inserted");
    }); */
});

connection.query("SELECT * FROM termekek", function (err, result, fields) {
    res.send(result[2].nev);
});

/* con.query("SELECT * FROM termekek", function (err, result, fields) {
    res.send(result);
}); */

/* con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM termekek", function (err, result, fields) {
        if (err) throw err;

        console.log(result);
        const valasz = result;
        const tesztvalasz = "eztet innen ki lehet-e hozni";
        console.log("valasz : !!!!!!!");
        console.log(valasz[2].nev); */
/* res.send("result[2].nev"); */
/* document.write(result[2].nev);
        module.exports = valasz;
    });
});

module.exports = "tesztvalasz"; */
