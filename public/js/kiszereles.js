var lastTransaction = -1;
// NOTE: Ez definiálja a bekért //ok ojektum tömbjét 😎
const state = {
    kiszereles: [],
};
// NOTE: Ezek kellenek a forgalom //okhoz
//const arrayPultNev = [];
//const arrayPultElar = [];
//var productsHTML = "";
//var productsHTMLdrop = "";
var xid = 1;

getdata();

/* INFO: termék //ok bekérése START INFO: */
async function getdata() {
    /* NOTE: get last-transaction */
    var response = await fetch("/lasttransaction");
    state.lastTransaction = await response.json();
    console.log("lastTransaction 😎");
    console.log(state.lastTransaction[0].ltr);

    /* NOTE: get kiszereles */
    var response = await fetch("/datareadkiszereles");
    state.kiszereles = await response.json();

    /* NOTE: get keszlet INFO: INFO: INFO:*/
    var response = await fetch("/dataread");
    state.keszlet = await response.json();

    /* NOTE: get csoport INFO: INFO: INFO:*/
    var response = await fetch("/datareadcsoport");
    state.csoportkategoria = await response.json();

    /* NOTE: get xkimeres INFO: INFO: INFO:*/
    var response = await fetch("/datareadxkimeres");
    state.xkimeres = await response.json();

    /* NOTE: get xkimeresnev INFO: INFO: INFO:*/
    var response = await fetch("/datareadxkimeresnev");
    state.xkimeresnev = await response.json();

    renderkiszereles();
    /* NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: */

    $(document).ready(function () {
        $("#newdata").click(function () {
            insertMySQL();

            async function insertMySQL() {
                /* HACK:HACK:HACK: */
                const nevInput = document.querySelector("#nev");
                const nev = nevInput.value == "" ? "noname" : nevInput.value;
                nevInput.value = "";
                /* HACK:HACK:HACK: */
                const urtartalomInput = document.querySelector("#urtartalom");
                const urtartalom =
                    urtartalomInput.value == "" ? "0" : urtartalomInput.value;
                urtartalomInput.value = "";
                /* HACK:HACK:HACK: */
                var id = xid + 1;
                /* INFO: insert  INFO: INFO: INFO: INFO: INFO: INFO: INFO:*/
                await fetch("/insertkiszereles/", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ nev: nev, urtartalom: urtartalom }),
                });
                /* INFO: insert  INFO: INFO: INFO: INFO: INFO: INFO: INFO:*/
                kiszerelesHTML += `<tr >
                <td>${id}</td>
                <td>${nev}</td>
                <td>${urtartalom}</td>
                </tr>
                `;
                id++;
                xid++;
                document.getElementById("kiszereles").innerHTML =
                    kiszerelesHTML;
                //.then((response) => response.json())
                //.then((data) => console.log(data["data"]));
                /* .then((data) => insertRowIntoTable(data["data"])); */
            }
        });
    });
}

function renderkiszereles() {
    let index = 0;
    kiszerelesHTML = "";
    console.log(state.kiszereles[0].nev);
    for (let vkiszereles of state.kiszereles) {
        kiszerelesHTML += `<tr >
                <td>${vkiszereles.id}</td>
                <td>${vkiszereles.nev}</td>
                <td>${vkiszereles.urtartalom}</td>
                </tr>

     `;
        index++;
        xid = vkiszereles.id; /* BUG: */
    }
    document.getElementById("kiszereles").innerHTML = kiszerelesHTML;
}
/* keszlet: [],
    csoportkategoria: [],
    xkimeres: [],
    lastTransaction: [],
    xkimeresnev: [], */
