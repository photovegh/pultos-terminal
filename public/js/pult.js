var lastTransaction = -1;
// NOTE: Ez definiálja a bekért adatok ojektum tömbjét 😎
const state = {
    keszlet: [],
    csoportkategoria: [],
    xkimeres: [],
    lastTransaction: [],
};
// NOTE: Ezek kellenek a forgalom adatokhoz
const arrayPultNev = [];
const arrayPultElar = [];
var productsHTML = "";
getdata();

/* INFO: termék adatok bekérése START INFO: */
async function getdata() {
    /* NOTE: get last-transaction */
    var response = await fetch("/lasttransaction");
    state.lastTransaction = await response.json();
    console.log("lastTransaction 😎");
    console.log(state.lastTransaction[0].ltr);

    /* NOTE: get keszlet */
    var response = await fetch("/dataread");
    state.keszlet = await response.json();
    //console.log(state.keszlet[0].nev);

    /* NOTE: get csoport */
    var response = await fetch("/datareadcsoport");
    state.csoportkategoria = await response.json();
    //console.log(state.csoportkategoria[0].nev);

    /* NOTE: get xkimeres */
    var response = await fetch("/datareadxkimeres");
    state.xkimeres = await response.json();
    //console.log(state.xkimeres[0].nev);

    renderProducts(); /* HACK: fv() hívás HACK: */
    /* NOTE: A button click funkciójának figyelése */
    $(document).ready(function () {
        let arrayIndex = -1;
        let vElar = -1;
        let vNev;
        localStorage.setItem("vElar", vElar);
        let summa = 0;
        let xxx = "";
        $(".btnKeszlet").click(function () {
            //alert(this.id);
            arrayIndex = this.id;
            /* NOTE: INFO: ?? */
            if (state.keszlet[arrayIndex].kiszereles_id == 2) {
                /* NOTE: PULT nev */
                arrayPultNev.push(state.keszlet[arrayIndex].nev);
                arrayPultElar.push(state.keszlet[arrayIndex].elar);
                console.log("arrayPultElar");
                console.log(arrayPultElar);
                console.log(arrayPultNev);
                adat = state.xkimeres[arrayIndex].nev;
                vNev = state.keszlet[arrayIndex].nev;
                vElar = state.keszlet[arrayIndex].elar;
                /* NOTE: PULT aladasi ar */
                /* BUG: PULT render BUG: */
                /* document.getElementById("pult").innerHTML +=
                    state.keszlet[arrayIndex].nev + " Ea: " + vElar + "<br>"; */
                pultRender(vNev, vElar);
            } else {
                /* NOTE: INFO: ?? */
                /* NOTE: PULT nev */
                arrayPultNev.push(state.keszlet[arrayIndex].nev);
                console.log(arrayPultNev);
                /* NOTE: PULT aladasi ar */
                arrayPultElar.push(state.keszlet[arrayIndex].elar);
                console.log("arrayPultElar");
                console.log(arrayPultElar);

                vElar = state.keszlet[arrayIndex].elar;
                //vElar = state.keszlet[arrayIndex].elar;
                //summa += vElar;
                vNev = state.keszlet[arrayIndex].nev;
                vElar = state.keszlet[arrayIndex].elar;
                pultRender(vNev, vElar);
                /* document.getElementById("pult").innerHTML +=
                    state.keszlet[arrayIndex].nev + " Ea: " + vElar + "<br>"; */
            }
            /* TODO: summa */
            /* let selement = 0;
            arrayPultElar.forEach((element) => {
                console.log(element);
                selement = selement + element;
            });
            console.log(selement);
            document.getElementById("summa").innerHTML = selement; */
        });
    });
}
/* INFO: termék adatok bekérése END INFO: */

/* HACK: termék button-ok felrajzolása STAR HACK: */
function renderProducts() {
    for (const csoport of state.csoportkategoria) {
        //console.log(csoport.nev + "**********");
        productsHTML += `<p class="bg-dark text-white mb-0">${csoport.nev}</p>`;
        let vIndex = 0;
        for (const product of state.keszlet) {
            if (csoport.nev == product.csoport_nev) {
                productsHTML += `<button type='button' class='btn btn-danger  m-1 btnKeszlet' id = ${vIndex}>${product.nev}</button>`;
            }
            vIndex++;
        }
        productsHTML += `<br>`;
    }

    document.getElementById("termek").innerHTML = productsHTML;
}

/* BUG: PULT render BUG: */
function pultRender(vNev, vElar) {
    document.getElementById("pult").innerHTML +=
        vNev + " Ea: " + vElar + "<br>";
    /* TODO: summa */
    let selement = 0;
    arrayPultElar.forEach((element) => {
        //console.log(element);
        selement = selement + element;
    });
    //console.log(selement);
    document.getElementById("summa").innerHTML = selement;
}

/* HACK: termék button-ok felrajzolása END HACK: */

/* ####### FRONTEND SEND get REQUEST INFO: START INFO:*/
/* ####### FRONTEND SEND get REQUEST  INFO: */

/* ####### BUTTON EVENT INFO: variable INFO:*/
/* NOTE: A button click funkciójának figyelése */
