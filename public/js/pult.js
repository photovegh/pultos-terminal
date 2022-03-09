var lastTransaction = -1;
// NOTE: Ez definiálja a bekért adatok ojektum tömbjét 😎
const state = {
    keszlet: [],
    csoportkategoria: [],
    xkimeres: [],
    lastTransaction: [],
    xkimeresnev: [],
};
// NOTE: Ezek kellenek a forgalom adatokhoz
const arrayPultNev = [];
const arrayPultElar = [];
var productsHTML = "";
var productsHTMLdrop = "";

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

    /* NOTE: get csoport */
    var response = await fetch("/datareadcsoport");
    state.csoportkategoria = await response.json();

    /* NOTE: get xkimeres INFO: INFO: INFO:*/
    var response = await fetch("/datareadxkimeres");
    state.xkimeres = await response.json();

    /* NOTE: get xkimeresnev INFO: INFO: INFO:*/
    var response = await fetch("/datareadxkimeresnev");
    state.xkimeresnev = await response.json();

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
            arrayIndex = this.id;
            /* NOTE: INFO: ?? */
            if (state.keszlet[arrayIndex].kiszereles_id == 2) {
                /* NOTE: PULT nev */
                arrayPultNev.push(state.keszlet[arrayIndex].nev);
                arrayPultElar.push(state.keszlet[arrayIndex].elar);
                adat = state.xkimeres[arrayIndex].nev;
                vNev = state.keszlet[arrayIndex].nev;
                vElar = state.keszlet[arrayIndex].elar;
                /* NOTE: PULT aladasi ar */
                /* BUG: PULT render BUG: */
                pultRender(vNev, vElar);
            } else {
                /* NOTE: INFO: OK */
                /* NOTE: PULT nev */
                /* NOTE: PULT aladasi ar */
                arrayPultNev.push(state.keszlet[arrayIndex].nev);
                arrayPultElar.push(state.keszlet[arrayIndex].elar);
                vElar = state.keszlet[arrayIndex].elar;
                //vElar = state.keszlet[arrayIndex].elar;
                //summa += vElar;
                vNev = state.keszlet[arrayIndex].nev;
                vElar = state.keszlet[arrayIndex].elar;
                pultRender(vNev, vElar);
            }
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
            var i = 0;
            if (csoport.nev == product.csoport_nev) {
                /* NOTE: ha kiért az italod, akkor rajzold fel, hogy milyen egységekben mérjem ki 😋 */
                if (state.keszlet[vIndex].kiszereles_id == 2) {
                    var productsHTMLxkimeresnev = "";
                    for (let vKimeres of state.xkimeres) {
                        if (vKimeres.termek_id == product.id) {
                            productsHTMLxkimeresnev += `<p class="dropdown-item" >${vKimeres.xkimeresnev_nev}</p>`;
                        }
                    }
                    i++;
                    productsHTML += `<div class="btn-group"> <div class="dropdown">
                    <button type="button" class="btn btn-primary dropdown-toggle m-1" data-toggle="dropdown">
                    ${product.nev}
                    </button>
                    <div class="dropdown-menu">
                      <p class="dropdown-item" >${productsHTMLxkimeresnev}</p>
                      
                    </div>
                  </div></div>`;
                } else {
                    productsHTML += `<button type='button' class='btn btn-danger  m-1 btnKeszlet' id = ${vIndex}>${product.nev}</button>`;
                }
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
/* console.log("state.xkimeres[x].termek_id");
                console.log(state.xkimeres[2].termek_id);
                console.log("state.xkimeres[x].termek_nev");
                console.log(state.xkimeres[2].termek_nev); */
//console.log(state.xkimeres.length);
//console.log("vIndex : " + vIndex);
//let xIndex = 0;
//for (xkimeres of state.xkimeres) {
//console.log("xkimeres.termek_id😋");
//console.log(xkimeres.termek_id);
/* console.log(
                        "state.keszlet[xkimeres.termek_id].kiszereles_id😎😎"
                    ); */
//console.log(state.keszlet[vIndex].kiszereles_id);
//document.getElementById("p").innerHTML = "hmmmmm";
//document.getElementById("termekdrop").innerHTML = productsHTMLdrop;
/* console.log(arrayPultNev);
                console.log("arrayPultElar");
                console.log(arrayPultElar); */
/* console.log("arrayPultElar");
                console.log(arrayPultElar);
                console.log(arrayPultNev); */
//console.log("state.xkimeres[0].termek_nev");
//console.log(state.xkimeres[0].termek_nev);
//console.log(state.keszlet[0].nev);
//console.log(state.csoportkategoria[0].nev);
//console.log("state.xkimeres[0].termek_nev");
//console.log(state.xkimeres[0].termek_nev);
//console.log(state.keszlet[vIndex].nev);
