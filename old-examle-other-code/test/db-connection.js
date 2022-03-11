const mysql = require("mysql"); //NOTE: DATABASES connection
const dotenv = require("dotenv"); /* NOTE: környezeti változó */
const conf = dotenv.config();
/* const port = conf.parsed.PORT; */
const connection = mysql.createConnection({
    host: conf.parsed.HOST,
    user: conf.parsed.USER,
    /* user: conf.USER, */
    password: conf.parsed.PSW,
    database: conf.parsed.DBF,
});
/* console.log("host: " + conf.parsed.HOST);INFO: .parsed. !!!!! INFO:
console.log("user: " + conf.parsed.USER);
console.log("psw: " + conf.parsed.PSW); */

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    //FIXME: kiirandó MySQL parancs összeállítása
    var sql = //TODO:
        "INSERT INTO termekek (nev, beszar, mennyiseg) VALUES ('sssscóla', 111, 222)";
    //FIXME: Kiírás az adatbázisba
    connection.query(sql, function (err, result) {
        //TODO:
        if (err) throw err;
        console.log("1 record inserted");
    });
});
