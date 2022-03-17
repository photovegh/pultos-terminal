var lastTransaction = -1;
var termekKiszereles = 9;
var csoportKiszereles = 5;
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
    //console.log("lastTransaction 😎");
    //console.log(state.lastTransaction[0].ltr);

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
    /* HACK: */
    renderkiszereles();
    rendercsoport();
    /* HACK: */
    /* NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: */

    $(document).ready(function () {
        $("#newdata").click(function () {
            /* TODO: NOTE: INFO: insertMySQL(); TODO: NOTE: INFO:*/

            figyel();
            async function insertMySQL() {
                /* TODO: NOTE: INFO: NOTE: TODO: */
                /* const kiszerelesInput =
                    document.querySelector("#kiszereles_id");
                const kiszerelesId = kiszerelesInput.value;
                const kiszerelesId = kiszerelesInput.value;
                kiszerelesInput.value = ""; */
                /* TODO: NOTE: INFO: NOTE: TODO: */

                const nevInput = document.querySelector("#nev");
                const nev = nevInput.value;
                nevInput.value = "";

                const beszarInput = document.querySelector("#beszar");
                const beszar = beszarInput.value;
                beszarInput.value = "";

                const elarInput = document.querySelector("#elar");
                const elar = elarInput.value;
                elarInput.value = "";

                const leltarozandoInput =
                    document.querySelector("#leltarozando");
                const leltarozando = leltarozandoInput.value;
                leltarozandoInput.value = "";

                const kritikusInput = document.querySelector("#kritikus");
                const kritikus = kritikusInput.value;
                kritikusInput.value = "";

                const gyujtoInput = document.querySelector("#gyujto");
                const gyujto = gyujtoInput.value;
                gyujtoInput.value = "";

                const jelenlegiKeszletInput =
                    document.querySelector("#jelenlegiKeszlet");
                const jelenlegiKeszlet = jelenlegiKeszletInput.value;
                jelenlegiKeszletInput.value = "";

                const urtartalomInput = document.querySelector("#urtartalom");
                const urtartalom = urtartalomInput.value;
                urtartalomInput.value = "";

                var id = xid + 1;
                /* INFO: insert  INFO: INFO: INFO: INFO: INFO: INFO: INFO:*/
                await fetch("/inserttermekek/", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        /* TODO: NOTE: INFO: NOTE: TODO: */
                        elar: elar,
                        leltarozando: leltarozando,
                        kritikus: kritikus,
                        gyujto: gyujto,
                        jelenlegiKeszlet: jelenlegiKeszlet,
                        urtartalom: urtartalom,
                        kiszerelesId: termekKiszereles,
                        csoportId: csoportKiszereles,

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
            }
        });
    });
}

function rendertermekek() {
    let index = 0;
    termekekHTML = "";
    //console.log(state.termekek[0].nev);
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
/* HACK: */
function renderkiszereles() {
    /* var termekKiszereles = 0; */
    let kiszerelesHTML = "";
    kiszerelesHTML += "<form>";
    for (let vKiszereles of state.kiszereles) {
        kiszerelesHTML += `
        <input type="radio" id=${vKiszereles.id} name="kiszerelesRadio" value=${vKiszereles.id} class="kiszerelesRadio">
        <label for=${vKiszereles.id}>${vKiszereles.nev}</label><br>
        `;
        //console.log("vKiszereles.id");
        //console.log(vKiszereles.id);
    }
    kiszerelesHTML += "</form>";
    //console.log("**********kiszerelesHTML***********");
    //console.log(kiszerelesHTML);
    document.getElementById("kiszerelesSelect").innerHTML = kiszerelesHTML;
    /* BUG: */
    $(".kiszerelesRadio").click(function () {
        termekKiszereles = this.id;
        console.log("kiszerelesRadio OK");
        console.log(this.id);
        console.log("termekKiszereles");
        console.log(termekKiszereles);
    });
    /* BUG: */
}
/* HACK: https://www.w3schools.com/bootstrap/tryit.asp?filename=trybs_form_horizontal&stacked=h HACK: */
function rendercsoport() {
    /* var csoportKiszereles = 0; */
    let csoportHTML = "";
    csoportHTML += "<form>";
    for (let vCsoport of state.csoportkategoria) {
        csoportHTML += `
        <input type="radio" id=${vCsoport.id} name="csoportRadio" value=${vCsoport.id} class="csoportRadio">
        <label for=${vCsoport.id}>${vCsoport.nev}</label><br>
        `;
    }
    csoportHTML += "</form>";
    //console.log("**********csoportHTML***********");
    //console.log(csoportHTML);
    document.getElementById("csoportSelect").innerHTML = csoportHTML;
    /* BUG: */
    $(".csoportRadio").click(function () {
        csoportKiszereles = this.id;
        console.log("csoportRadio OK");
        console.log(this.id);
        console.log("csoportKiszereles");
        console.log(csoportKiszereles);
    });
    /* BUG: */
}
/* HACK: */

function figyel() {
    if (document.getElementById("nev").value == "") {
        console.log("******* mezo UUURRREEESSS *******");
    }
    console.log("******* Ok *******");
}

/* HACK: */

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

/* BUG: nem lehet kiválasztani még az xkiszerelesnevet mert új a termék és nincs !!!!!ID!!!!! BUG: */

/*     $(".kiszerelesRadio").click(function () {
        console.log("kiszerelesRadio console OK");
        console.log(this.id);
        let xkimeresnevHTML = "";
        xkimeresnevHTML += "<form>";
        for (vXkimeresnev of state.xkimeresnev) {
            xkimeresnevHTML += `<input type="checkbox" id=${vXkimeresnev.id} name="xkimeresnevBox" value=${vXkimeresnev.id} class="xkimeresnevBox">
            <label for="xkimeresnevBox">${vXkimeresnev.nev}</label><br>`;
        }
        xkimeresnevHTML += "</form>";
        console.log("************xkimeresnevHTML************");
        console.log(xkimeresnevHTML);
        document.getElementById("xkimeresnevSelect").innerHTML =
            xkimeresnevHTML;
        $(".xkimeresnevBox").click(function () {
            console.log("xkimeresnevBox console OK");
            console.log("xkimeresnevBox : " + this.id);
            console.log("checked??? : " + this.checked);
        });
    }); */
