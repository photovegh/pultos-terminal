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
    con.query("SELECT * FROM termekek", function (err, result, fields) {
        if (err) throw err;

        console.log(result);
        const valasz = result;
        const tesztvalasz = "eztet innen ki lehet-e hozni";
        console.log("valasz : !!!!!!!");
        console.log(valasz[2].nev);
        /* res.send("result[2].nev"); */
        /* document.write(result[2].nev); */
        module.exports = valasz;
    });
});

module.exports = "tesztvalasz";
