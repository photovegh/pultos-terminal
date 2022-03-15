var lastTransaction = -1;
// NOTE: Ez definiálja a bekért //ok ojektum tömbjét 😎
const state = {
    kiszereles: [],
    keszlet: [],
    csoportkategoria: [],
    xkimeres: [],
    lastTransaction: [],
    xkimeresnev: [],
    termekek: [],
};
// NOTE: Ezek kellenek a forgalom //okhoz
var xid = 1;

getdata();

/* INFO: termék //ok bekérése START INFO: */
async function getdata() {
    /* NOTE: get kiszereles INFO: INFO: INFO:*/
    var response = await fetch("/dataread");
    state.kiszereles = await response.json();

    /* NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: */

    /* NOTE: get last-transaction */
    var response = await fetch("/lasttransaction");
    state.lastTransaction = await response.json();
    console.log("lastTransaction 😎");
    console.log(state.lastTransaction[0].ltr);

    /* NOTE: get keszlet */
    var response = await fetch("/dataread");
    state.keszlet = await response.json();

    /* NOTE: get termekek */
    var response = await fetch("/datareadtermekek");
    state.keszlet = await response.json();

    /* NOTE: get csoport */
    var response = await fetch("/datareadcsoport");
    state.csoportkategoria = await response.json();

    /* NOTE: get xkimeres INFO: INFO: INFO:*/
    var response = await fetch("/datareadxkimeres");
    state.xkimeres = await response.json();

    /* NOTE: get xkimeresnev INFO: INFO: INFO:*/
    var response = await fetch("/datareadxkimeresnev");
    state.xkimeresnev = await response.json();

    /* NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: */
    rendertermekek();

    $(document).ready(function () {
        $("#newdata").click(function () {
            $("#nev").change(function () {
                /*                 let nevInput = $("#nev");
                let v = $(this).val();

                let beszar = document.querySelector("#beszar");
                console.log("nevInput.value");
                console.log(v);
                console.log("beszar.value");
                console.log(beszar.value); */
                let v = 1;
                if (v !== null) {
                    console.log("************************************");
                }
            });
            insertMySQL();

            async function insertMySQL() {
                const nevInput = document.querySelector("#nev");
                const nev = nevInput.value;
                nevInput.value = "";
                const urtartalomInput = document.querySelector("#beszar");
                const urtartalom = urtartalomInput.value;
                var id = xid + 1;
                urtartalomInput.value = 0;
                /* INFO: insertkiszereles  INFO: INFO: INFO: INFO: INFO: INFO: INFO:*/
                await fetch("/insertkiszereles", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ nev: nev, urtartalom: urtartalom }),
                });
                /* INFO: insertkiszereles  INFO: INFO: INFO: INFO: INFO: INFO: INFO:*/
                termekekHTML += `<tr >
                <td>${id}</td>
                <td>${nev}</td>
                <td>${urtartalom}</td>
                </tr>
                `;
                id++;
                xid++;
                document.getElementById("xkimeresdata").innerHTML =
                    termekekHTML;
            }
        });
    });
}

function rendertermekek() {
    let index = 0;
    termekekHTML = "";
    console.log(state.keszlet[0].nev);
    for (let vKimeresnev of state.keszlet) {
        termekekHTML += `<tr >
                <td>${vKimeresnev.id}</td>
                <td>${vKimeresnev.nev}</td>
                <td>${vKimeresnev.beszar}</td>
                </tr>

     `;
        index++;
        xid = vKimeresnev.id; /* BUG: */
    }
    document.getElementById("xkimeresdata").innerHTML = termekekHTML;
}
