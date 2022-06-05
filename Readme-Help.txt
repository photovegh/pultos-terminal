try {
// code may cause error
// kód hibát okozhat
} catch(error){
// code to handle error
// kód a hiba kezelésére
}

---

try {
let result = add(10, 20);
console.log(result);
} catch (e) {
console.log({ name: e.name, message: e.message });
}
console.log('Bye');

---

{name: 'TypeError', message: 'add is not a function'}
Bye

---

const add = (x, y) => x + y; //function definition !!!!!!!

let result = 0;

try {
result = add(10, 20);
} catch (e) {
console.log(e.message);
} finally {
console.log({ result });
}

---

https://www.javascripttutorial.net/javascript-try-catch/
https://www.javascripttutorial.net/javascript-try-catch-finally/

/_ INFO: TODO: INFO: TODO: INFO: _/
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
/_ con.query(
"INSERT INTO csoportok (nev) VALUES (?)",
[insertData],
(err, data) => {
if (err) throw err;
res.send(data);
}
); _/
/_ INFO: TODO: INFO: TODO: INFO: _/
