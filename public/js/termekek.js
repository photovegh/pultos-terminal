var lastTransaction = -1;
// NOTE: Ez definiálja a bekért //ok ojektum tömbjét 😎
const state = {
    keszlet: [],
    csoportkategoria: [],
    xkimeres: [],
    lastTransaction: [],
    xkimeresnev: [],
    kiszereles: [],
    termekek: [],
};
// NOTE: Ezek kellenek a forgalom //okhoz
const arrayPultNev = [];
const arrayPultElar = [];
var productsHTML = "";
var productsHTMLdrop = "";
var xid = 1;

getdata();

/* INFO: termék //ok bekérése START INFO: */
async function getdata() {
    /* NOTE: get last-transaction */
    var response = await fetch("/lasttransaction");
    state.lastTransaction = await response.json();
    console.log("lastTransaction 😎");
    console.log(state.lastTransaction[0].ltr);

    /* NOTE: get keszlet */
    var response = await fetch("/dataread");
    state.keszlet = await response.json();

    /* NOTE: get kiszereles */
    var response = await fetch("/datareadkiszereles");
    state.kiszereles = await response.json();

    /* NOTE: get csoport */
    var response = await fetch("/datareadcsoport");
    state.csoportkategoria = await response.json();

    /* NOTE: get xkimeres INFO: INFO: INFO:*/
    var response = await fetch("/datareadxkimeres");
    state.xkimeres = await response.json();

    /* NOTE: get xkimeresnev INFO: INFO: INFO:*/
    var response = await fetch("/datareadxkimeresnev");
    state.xkimeresnev = await response.json();

    /* NOTE: get datareadtermekek INFO: INFO: INFO:*/
    var response = await fetch("/datareadtermekek");
    state.termekek = await response.json();

    rendertermekek();
    /* NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: */

    $(document).ready(function () {
        $("#newdata").click(function () {
            insertMySQL();

            async function insertMySQL() {
                /* TODO: NOTE: INFO: NOTE: TODO: */
                const kiszerelesInput =
                    document.querySelector("#kiszereles_id");
                const kiszerelesId = kiszerelesInput.value;
                kiszerelesInput.value = "";
                /* TODO: NOTE: INFO: NOTE: TODO: */

                const nevInput = document.querySelector("#nev");
                const nev = nevInput.value;
                nevInput.value = "";

                const beszarInput = document.querySelector("#beszar");
                const beszar = beszarInput.value;
                var id = xid + 1;
                beszarInput.value = "";
                /* INFO: insert  INFO: INFO: INFO: INFO: INFO: INFO: INFO:*/
                await fetch("/inserttermekek/", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        /* TODO: NOTE: INFO: NOTE: TODO: */
                        kiszerelesId: kiszerelesId,
                        /* TODO: NOTE: INFO: NOTE: TODO: */
                        nev: nev,
                        beszar: beszar,
                    }),
                });
                /* INFO: insert  INFO: INFO: INFO: INFO: INFO: INFO: INFO:*/
                termekekHTML += `<tr >
                <td>${id}</td>
                <td>${nev}</td>
                <td>${beszar}</td>
                </tr>
                `;
                id++;
                xid++;
                document.getElementById("termekek").innerHTML = termekekHTML;
                //.then((response) => response.json())
                //.then((data) => console.log(data["data"]));
                /* .then((data) => insertRowIntoTable(data["data"])); */
            }
        });
    });
}

function rendertermekek() {
    let index = 0;
    termekekHTML = "";
    console.log(state.termekek[0].nev);
    for (let vTermekek of state.termekek) {
        termekekHTML += `<tr >
                <td>${vTermekek.id}</td>
                <td>${vTermekek.nev}</td>
                <td>${vTermekek.beszar}</td>
                </tr>

     `;
        index++;
        xid = vTermekek.id; /* BUG: */
    }
    document.getElementById("termekek").innerHTML = termekekHTML;
}

/* addBtn.onclick = function () {
    const nameInput = document.querySelector("#name-input");
    const name = nameInput.value;
    nameInput.value = ""; 
    ====================================
        fetch("/insert/", {
        headers: {
            "Content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ name: name }),
    })
    ================================
        .then((response) => response.json())
        .then((data) => insertRowIntoTable(data["data"]));
    */
