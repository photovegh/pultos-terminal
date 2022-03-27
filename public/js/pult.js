var lastTransaction = -1;
// NOTE: Ez definiálja a bekért adat ojektum tömbjét 😎
const state = {
    keszlet: [],
    csoportkategoria: [],
    xkimeres: [],
    lastTransaction: [],
    xkimeresnev: [],
    pult: [],
    kosarak: [],
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
var pultIndex = 0;
var productsHTML = "";
var productsHTMLdrop = "";
var foundPult = false;
var foundKosar = false;

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

                    state.pult.push({
                        id: sorokId,
                        nev: sorokNev,
                        xkimeresnevnev: sorokXkimeresNevNev,
                        xkimeresnevid: sorokXkimeresNevId,
                        xkimeresnevurtartalom: sorokXkimeresNevUrtartalom,
                        db: edb,
                        cl: sorokXkimeresNevUrtartalom,
                        eladottbeszar: sorokEladottBeszar,
                        eladottelar: sorokEladottElar,
                        fizetesmod: "k",
                        transactionnumber: 7,
                        megjegyzes: "megjegyzes",
                    });
                    renderPult();
                }
            } else {
                /* HACK: cl????????  HACK: */
                //arrayIndextoggle = this.id; //HACK:

                eladottElar = state.keszlet[arrayIndex].elar;
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
                    id: sorokId,
                    nev: sorokNev,
                    xkimeresnevnev: " ",
                    xkimeresnevid: " ",
                    xkimeresnevurtartalom: " ",
                    db: edb,
                    cl: state.keszlet[arrayIndex].cl,
                    eladottbeszar: sorokEladottBeszar,
                    eladottelar: sorokEladottElar,
                    fizetesmod: "c",
                    transactionnumber: 21,
                    megjegyzes: "info",
                });
                //pultRender(arrayIndex); //BUG:BUG:BUG:BUG:BUG:BUG:BUG: state
                renderPult();
            }
        });
    });
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
            <button class="btn mr-4 btn-danger delete-db" id = ${tombIndex}>del</button>   <button class="btn mr-3 btn-warning remove-db" id = ${tombIndex}>-</button>   ${
            sorok.db
        }    <button class="btn ml-3 btn-success insert-db" id = ${tombIndex}>+</button>   <span class="font-weight-bold">${
            sorok.eladottelar * sorok.db
        }</span>
        </div>
    </div>
        `;
        tombIndex++;
        mindosszesen += sorok.eladottelar * sorok.db;
    }
    document.getElementById("pult").innerHTML = tetelSorokHTML;
    document.getElementById("summa").innerHTML = mindosszesen;
    $(".insert-db").click(function (event) {
        let pultTombIndex = this.id;
        state.pult[pultTombIndex].db++;
        renderPult();
    });
    $(".remove-db").click(function (event) {
        let pultTombIndex = this.id;
        state.pult[pultTombIndex].db--;
        renderPult();
    });
    $(".delete-db").click(function (event) {
        let pultTombIndex = this.id;
        state.pult.splice(pultTombIndex, 1);
        renderPult();
    });
    //foundKosar = tetelSorokHTML == "" ? false : true;
    foundPult = tetelSorokHTML == "" ? false : true;
}
//FIXME: FIXME: FIXME:
function naTegyukEgyUjKosarba() {
    console.log("kapdBe");
    if (foundPult) {
        $("#kosarMegnevezesModal").modal();
    }
    foundKosar = state.kosarak.length > 0 ? true : false;
    console.log(state.kosarak.length);
}
function kosarNevSzerintiTarolas() {
    let kosarMegnevezes = "jani";
    console.log("document.querySelector(#kosarMegnevezes");
    console.log(document.querySelector("#kosarMegnevezes").value);
    kosarMegnevezes = document.querySelector("#kosarMegnevezes").value;
    state.pult.push({
        kosarMegnevezes: kosarMegnevezes,
    });
    state.kosarak.push(state.pult);
    state.pult = [];
    renderPult();
    console.log("state.kosarak-------------------------------------");
    console.log(state.kosarak);
}

$(".kosarBtn").click(function () {
    if (foundPult) {
        let kosarMegnevezes = "jani";
        state.pult.push({
            kosarMegnevezes: kosarMegnevezes,
        });
        state.kosarak.push(state.pult);
        state.pult = [];
        renderPult();
        console.log("state.kosarak-------------------------------------");
        console.log(state.kosarak);
    }
    foundKosar = state.kosarak.length > 0 ? true : false;
    console.log(state.kosarak.length);
});

$(".kosarak").click(function () {
    //var vizsgal = foundKosar == false ? "üres" : "teli mint a deli busz";
    //console.log(vizsgal);

    if (foundPult) {
        alert(
            "Előbb a pulton lévő termékeket vagy fizettesd ki, vagy tedd a kosárba, de a pultnak üresnek kell lenni, hogy visszatölts egy kosarat!"
        );
    } else {
        if (foundKosar) {
            $("#kosarakModal").modal();
            var kosarSorokHTML = "";

            for (let index = 0; index < state.kosarak.length; index++) {
                kosarSorokHTML += `<div class="card m-3"><h3>${state.kosarak[index][1].kosarMegnevezes}</h3></div>`;
                //console.log("kosarSor 🤔");
                //console.log(state.kosarak.nev);
                /* console.log("state.kosarak.lenght");
                console.log(state.kosarak.length);
                console.log("state.kosarak[index][0].nev");
                console.log(state.kosarak[index][0].nev); */
            }
            /* 
            for (var kosarSor of state.kosarak[0]) {
                kosarSorokHTML += `<div class="card m-3"><h3>${kosarSor.nev}</h3></div>`;
                console.log("kosarSor 🤔");
                console.log(kosarSor.nev);
                console.log("state.kosarak.lenght");
                console.log(state.kosarak.length);
                console.log("state.kosarak");
                console.log(state.kosarak);
            } */
            document.getElementById("kosarakFelsorolasa").innerHTML =
                kosarSorokHTML;
        }
    }
});

window.onload = renderPult();
