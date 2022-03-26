var lastTransaction = -1;
// NOTE: Ez definiálja a bekért adat ojektum tömbjét 😎
const state = {
    keszlet: [],
    csoportkategoria: [],
    xkimeres: [],
    lastTransaction: [],
    xkimeresnev: [],
    pult: [],
};

// NOTE: Ezek kellenek a forgalom adatokhoz
/*
 termék (lastTransaction) :HACK
 - id
 - név
 - kevert ital osszetevo
 - xkimeresnevnev
 - xkimeresnevid
 -  xkimeresnev urtartalom || 0 HACK: keszlet * cl-ból vonódik ez a mennyiség
 -  termek              cl || 0 HACK: keszlet * cl-ból vonódik ez a mennyiség
 - db
 - adott eladási kiszereles beszar
 - adott eladási kiszereles elar
 - INFO: fizetés kp, kártya, hitel, leltár, beszállító kifizetés ?????

 ...NOTE: átgondolni még, hogy mi kell
 ...NOTE: cl vagy darab készletcsökkentése !!! ha 2 vagy 1 vonja a cl-t
        2-nél nagyobb csökkentse a db
        NEM és NEM ha 2-nél nagyobb a urtartalom = urtartalom * 1
        INFO: a keszlet az összkészlet legyen INFO:
        INFO: az urtartalom  => db vagy urtartalom INFO:
        INFO: cl  => ha 2 urtartalom / 10;;; 3-tól urtartalom * 1 INFO:
        INFO: cl  => ha 1 ott 0, ugyanis az összetevők űrtartalma INFO:
        INFO: cl  => ha 1 vonódik le összetevőnként küln-külön 😋 INFO:
        INFO: A termékekhez kell egy jelenlegi készlet mező 😎🦉😎 INFO:
 ...NOTE: osszesen elar * db => mindösszesen sor

 */
const arrayPultNev = [];
const arrayPultElar = [];
//const arrayPultEdb = [];
var pultIndex = 0;
var productsHTML = "";
var productsHTMLdrop = "";
var brbr = "<br><br><br><br><br><br><br><br>"; //INFO:

getdata();

/* INFO: termék //ok bekérése START INFO: */
async function getdata() {
    /* NOTE: get last-transaction */
    var response = await fetch("/lasttransaction");
    state.lastTransaction = await response.json();

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
        let arrayIndextoggle = -1;
        let eladottElar = -1;
        let sorokNev;
        localStorage.setItem("eladottElar", eladottElar);
        let summa = 0;
        let xxx = "";
        /* BUG: dropdown-item figyelése BUG: */
        $(".btnKeszlet, .dropdown-item, .dropdown-toggle").click(function (e) {
            if (e.target.nodeName == "BUTTON") {
                arrayIndex = this.id;
                localStorage.setItem("arrayIndex", arrayIndex);
            }
            /* NOTE: INFO: ?? */
            let xButtonOrP = "";
            var edb = 1;

            xButtonOrP = e.target.nodeName;
            if (state.keszlet[arrayIndex].kiszereles_id == 2) {
                if (e.target.nodeName == "P") {
                    arrayIndextoggle = this.id; //HACK:

                    //sorokNev = state.keszlet[arrayIndex].nev;
                    sorokNev = state.keszlet[arrayIndex].nev; //HACK:
                    sorokId = state.keszlet[arrayIndex].id; //HACK:

                    eladottElar =
                        (state.keszlet[arrayIndex].elar /
                            state.keszlet[arrayIndex].cl) *
                        state.xkimeresnev[arrayIndextoggle].urtartalom;
                    sorokXkimeresNevNev =
                        state.xkimeresnev[arrayIndextoggle].nev; //HACK:
                    sorokXkimeresNevId = state.xkimeresnev[arrayIndextoggle].id;
                    sorokXkimeresNevUrtartalom =
                        state.xkimeresnev[arrayIndextoggle].urtartalom;

                    sorokEladottBeszar =
                        (state.keszlet[arrayIndex].beszar /
                            state.keszlet[arrayIndex].cl) *
                        state.xkimeresnev[arrayIndextoggle].urtartalom;

                    sorokEladottElar =
                        (state.keszlet[arrayIndex].elar /
                            state.keszlet[arrayIndex].cl) *
                        state.xkimeresnev[arrayIndextoggle].urtartalom;

                    //arrayPultNev.push(state.keszlet[arrayIndex].nev);
                    //arrayPultElar.push(eladottElar);

                    state.pult.push({
                        id: sorokId, //NOTE:
                        nev: sorokNev, //NOTE:
                        xkimeresnevnev: sorokXkimeresNevNev, //NOTE:
                        xkimeresnevid: sorokXkimeresNevId,
                        xkimeresnevurtartalom: sorokXkimeresNevUrtartalom,
                        db: edb, //NOTE:
                        //cl: edb * sorokXkimeresNevUrtartalom,
                        cl: sorokXkimeresNevUrtartalom,
                        eladottbeszar: sorokEladottBeszar, //NOTE:
                        eladottelar: sorokEladottElar, //NOTE:
                        fizetesmod: "k", //NOTE:
                        transactionnumber: 7, //NOTE:
                        megjegyzes: "megjegyzes", //NOTE:
                    });
                    //pultRender(arrayIndex); //BUG:BUG:BUG:BUG:BUG:BUG:BUG: state !!!
                    console.log(state.pult[2]);
                    renderPult();
                }
            } else {
                //arrayPultNev.push(state.keszlet[arrayIndex].nev); //NOTE:
                //arrayPultElar.push(state.keszlet[arrayIndex].elar);
                /* HACK: cl????????  HACK: */
                //arrayIndextoggle = this.id; //HACK:

                eladottElar = state.keszlet[arrayIndex].elar;
                //sorokNev = state.keszlet[arrayIndex].nev;
                sorokNev = state.keszlet[arrayIndex].nev; //HACK:
                sorokId = state.keszlet[arrayIndex].id; //HACK:

                /* eladottElar =
                        (state.keszlet[arrayIndex].elar /
                            state.keszlet[arrayIndex].cl) *
                        state.xkimeresnev[arrayIndextoggle].urtartalom; */
                /* sorokXkimeresNevNev =
                        state.xkimeresnev[arrayIndextoggle].nev; */
                /* sorokXkimeresNevId = state.xkimeresnev[arrayIndextoggle].id; */
                /* sorokXkimeresNevUrtartalom =
                        state.xkimeresnev[arrayIndextoggle].urtartalom; */

                sorokEladottBeszar = state.keszlet[arrayIndex].beszar;
                /* (state.keszlet[arrayIndex].beszar /
                            state.keszlet[arrayIndex].cl) *
                        state.xkimeresnev[arrayIndextoggle].urtartalom; */

                sorokEladottElar = state.keszlet[arrayIndex].elar;
                /* (state.keszlet[arrayIndex].elar /
                            state.keszlet[arrayIndex].cl) *
                        state.xkimeresnev[arrayIndextoggle].urtartalom; */
                /* sorokCl =
                    (edb * state.keszlet[arrayIndex].cl) /
                    state.keszlet[arrayIndex].urtartalom; */
                /* HACK: cl????????  HACK: */
                state.pult.push({
                    id: sorokId, //NOTE:
                    nev: sorokNev, //NOTE:
                    xkimeresnevnev: " ", //NOTE:
                    xkimeresnevid: " ",
                    xkimeresnevurtartalom: " ",
                    db: edb, //NOTE:
                    cl: state.keszlet[arrayIndex].cl,
                    //cl: sorokCl,
                    eladottbeszar: sorokEladottBeszar, //NOTE:
                    eladottelar: sorokEladottElar, //NOTE:
                    fizetesmod: "c", //NOTE:
                    transactionnumber: 21, //NOTE:
                    megjegyzes: "info", //NOTE:
                });
                //pultRender(arrayIndex); //BUG:BUG:BUG:BUG:BUG:BUG:BUG: state
                console.log(state.pult[2]);
                renderPult();
            }
        });
    });
}

function myFunction() {
    arrayPultNev.pop();
    arrayPultElar.pop();
}

/* HACK: termék button-ok felrajzolása STAR HACK: */
function renderProducts() {
    for (const csoport of state.csoportkategoria) {
        productsHTML += `<p class="bg-dark text-white mb-0 ">${csoport.nev}</p>`;
        let vIndex = 0;
        for (const product of state.keszlet) {
            var i = 0;
            if (csoport.id == product.csoport_id) {
                /* NOTE: ha kimért az italod, akkor rajzold fel, hogy milyen egységekben mérjem ki 😋 */
                if (state.keszlet[vIndex].kiszereles_id == 2) {
                    var productsHTMLxkimeresnev = "";
                    for (let vKimeres of state.xkimeres) {
                        if (vKimeres.termek_id == product.id) {
                            let xxx = parseInt(vKimeres.xkimeresnev_id - 1);
                            productsHTMLxkimeresnev += `<p class="dropdown-item" id = ${xxx}>${state.xkimeresnev[xxx].nev}</p>`;
                        }
                    }
                    i++;
                    productsHTML += `<div class="btn-group "> <div class="dropdown">
                    <button type="button" class="btn btn-primary dropdown-toggle m-1" data-toggle="dropdown" id = ${vIndex}>
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

function renderPult() {
    //FIXME: FIXME: FIXME:
    var tetelSorokHTML = "";
    var mindosszesen = 0;
    var tombIndex = 0;
    for (var sorok of state.pult) {
        tetelSorokHTML += `
        <div class="card">
        <div class="font-weight-bold">
            ${sorok.nev} ${sorok.xkimeresnevnev} : <span>${
            sorok.eladottelar
        }</span>
        </div>
        <div>
            <button class="btn mr-5 btn-danger delete-db" id = ${tombIndex}>del</button>   <button class="btn mr-3 btn-warning remove-db" id = ${tombIndex}>-</button>   ${
            sorok.db
        }    <button class="btn ml-3 btn-success insert-db" id = ${tombIndex}>+</button>   <span class="font-weight-bold">${
            sorok.eladottelar * sorok.db
        }</span>
        </div>
    </div>
        `;
        tombIndex++;
        mindosszesen += sorok.eladottelar * sorok.db;
        console.log(tombIndex);
    }
    document.getElementById("pult").innerHTML = tetelSorokHTML;
    document.getElementById("summa").innerHTML = mindosszesen;
    $(".insert-db").click(function (event) {
        let pultTombIndex = this.id;
        console.log("insert-db tombIndex");
        console.log(pultTombIndex);
        state.pult[pultTombIndex].db++;
        renderPult();
    });
    $(".remove-db").click(function (event) {
        let pultTombIndex = this.id;
        console.log("remove-db tombIndex");
        console.log(pultTombIndex);
        state.pult[pultTombIndex].db--;
        renderPult();
    });
    $(".delete-db").click(function (event) {
        let pultTombIndex = this.id;
        console.log("delete-db tombIndex");
        console.log(pultTombIndex);
        alert("Hamarosan bekötve"); //FIXME: FIXME: FIXME:
        renderPult();
    });
}
//FIXME: FIXME: FIXME:
window.onload = renderPult();

/* BUG: PULT render BUG: */
/* function pultRender(arrayIndex) {
    pultIndex++;
    let selement = 0;
    let kiir = "";
    for (i = 0; i < arrayPultNev.length; i++) {
        kiir += arrayPultNev[i] + arrayPultElar[i] + "<br>";
        selement += arrayPultElar[i];
    }

    document.getElementById("pult").innerHTML = kiir;
    kiir = "";
    pultIndex = 0;

    document.getElementById("summa").innerHTML = selement;
} */

/* //FIXME: 
    pult: [
        {
            id: 'id',//NOTE:
            nev: 'nev',//NOTE:
            //FIXME: kevertitalosszetevonev:  'nev *ezt nem iratom ki*, a tarolashoz kell',
            **xkimeresnevnev: '**xkimeresnevnev',//NOTE:
            **xkimeresnevid: '**xkimeresnevid',//NOTE:
            **xkimeresnevurtartalom: '**xkimeresnevurtartalom',///NOTE:
            db: 'db',//NOTE:
            cl: 'cl *ezt nem iratom ki* maradek keszlet eloallitasahoz kell',//NOTE: ha nem 2 a cl ugy lesz db, hogy cl / urtartalom NOTE:
            eladottbeszar: 'eladottbeszar *ezt nem iratom ki*',//NOTE:
            eladottelar: 'eladottelar',//NOTE:
            fizetesmod: 'kp, hitel, letar ...',//NOTE:
            transactionnumber: 'transactionnumber'//NOTE:
            megjegyzes: 'megjegyzes'//NOTE:
        }
    ]
 FIXME: */
/* //FIXME: 
    pult: [
        {
            id: 5,
            nev: 'kalinka',
            xkimeresnevnev: '3 centes',
            db: 1,
            eladottelar: 321,
        },
        {
            id: '12',
            nev: 'cola',
            xkimeresnevnev: ' ',
            db: 2,
            eladottelar: 77,
        }
    ]
 FIXME: */
