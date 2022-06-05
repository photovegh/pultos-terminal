const vissza = localStorage.getItem("adminLocal");
console.log("hol vagzok 😁");
console.log(vissza);

var trNumberDatum = new Date();
const keyboardTemplateHTML = keyboardTemplateRender();
var datum = new Date().toLocaleString();
//var lastTransaction = -1;

const userLocalName = localStorage.getItem("user");
console.log(userLocalName);
console.log("hol vagzok 😁");
console.log(vissza);
document.getElementById("localStorageName").innerHTML = userLocalName;

var trNumber = "";
var pultos = 2;
var lastTransactionId = -1;
var trFizetesMod = "";
var megjegyzes = "";
var kivetMegnevezes = "";
var osszegKivet = "";
var osszeg = -1;
var mindosszesenTransaction = -1;
var mindosszesenTransactionBeszar = -1;
var fizetoHitelesId = -1;
var fizetoHitelesMegjegyzes = "";
var fizetoHitelesIndex = -1;
var trFizetesMod = "";
createTrNumber();
/* 
const state = {
    keszlet: [],
    csoportkategoria: [],
    xkimeres: [],
    xkimeresnev: [],
    pult: [],
    kosarak: [],
    kosarNevek: [],
    kevert: [],
    fullTransactions: [],
};
*/
// NOTE: Ez definiálja a bekért adat ojektum tömbjét 😎
const state = {
    keszlet: [],
    csoportkategoria: [],
    xkimeres: [],
    xkimeresnev: [],
    pult: [],
    kosarak: [],
    kosarNevek: [],
    kevert: [],
    fullTransactionsHitel: [],
};

// lastTransaction: [],
// NOTE: Ezek kellenek a forgalom adatokhoz
/*
======================================================================
 termék (transaction) :HACK:
 - id
 - transaction number FIXME:FIXME:
 - date
 - pultos
 - fizetés: kp, kártya, hitel, leltár, beszállító kifizetés FIXME:
 --- k: kp
 --- c: bank card
 --- h: hitel (info: kie a hitel) NOTE:
 --- l: leltar (info: ???) NOTE:
 --- b: beszállító kifizetés (info: kinek let kifizetve) NOTE:
 - info FIXME:
 ======================================================================
 termék (transaction item) :HACK:
 - - transaction number_id FIXME:FIXME:
 - termék id FIXME:
 - db FIXME:
 - adott eladási kiszereles beszar FIXME:
 - adott eladási kiszereles elar FIXME:
 - xkimeresnev id FIXME:
 ======================================================================
 - cl: azonnali FIXME:
 - sumcl: azonnali FIXME:
 ======================================================================
 INFO: ha a kiszereles_id i
 - *1* adalek (termek) id x
 - *1* xkimeresnev id x
 - *2* adalek (termek) id y
 - *2* xkimeresnev id y
 INFO: ha a kiszereles_id i

 - kevert ital osszetevo
 -  xkimeresnev urtartalom || 0 HACK: keszlet * cl-ból vonódik ez a mennyiség
 -  termek              cl || 0 HACK: keszlet * cl-ból vonódik ez a mennyiség
 

 ...NOTE: átgondolni még, hogy mi kell
 ...NOTE: cl vagy darab készletcsökkentése !!! ha 2 vagy 1 vonja a cl-t
        2-nél nagyobb csökkentse a db
        NEM és NEM ha 2-nél nagyobb a urtartalom = urtartalom * 1
        INFO: a keszlet az összkészlet legyen INFO:
        INFO: az urtartalom  => db vagy urtartalom INFO:
        INFO: cl  => ha 2 urtartalom / 10;;; 3-tól urtartalom * 1 INFO: OKK
        INFO: cl  => ha 1 ott 0, ugyanis az összetevők űrtartalma INFO: OKK
        INFO: cl  => ha 1 vonódik le összetevőnként küln-külön 😋 INFO:
        INFO: A termékekhez kell egy jelenlegi készlet mező 😎🦉😎 INFO:
 ...NOTE: osszesen elar * db => mindösszesen sor

 */
var productsHTML = "";
var foundPult = false;
var foundKosar = false;
var kosarbolVisszatoltott = false;
var kosarbolVisszatoltottId = -1;
var kosarMegnevezes = "*";

getdata();

/* INFO: termék //ok bekérése START INFO: */
/* TODO:TODO:TODO: GETDATA TODO:TODO:TODO: */
async function getdata() {
    /* NOTE: get gettransactions */
    /* var response = await fetch("/gettransactions");
    state.fullTransactions = await response.json(); */

    /* NOTE: get gettransactionshitel */
    var id = "h";
    var response = await fetch(`/gettransactionshitel/${id}`);
    //var response = await fetch("/gettransactionshitel");
    state.fullTransactionsHitel = await response.json();

    /* NOTE: get kevert */
    var response = await fetch("/datareadkevert");
    state.kevert = await response.json();

    /* NOTE: get last-transaction */
    /* var response = await fetch("/lasttransaction");
    state.lastTransaction = await response.json(); */

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
        let kosarUjsorIndex = -1;
        localStorage.setItem("eladottElar", eladottElar);
        let summa = 0;
        let xxx = "";
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
                    sorokKiszerelesId = state.keszlet[arrayIndex].kiszereles_id; //HACK:
                    arrayIndextoggle = this.id; //HACK:
                    sorokNev = state.keszlet[arrayIndex].nev; //HACK:
                    sorokId = state.keszlet[arrayIndex].id; //HACK:
                    eladottElar = Math.round(
                        (state.keszlet[arrayIndex].elar /
                            state.keszlet[arrayIndex].cl) *
                            state.xkimeresnev[arrayIndextoggle].urtartalom
                    );
                    sorokXkimeresNevNev =
                        state.xkimeresnev[arrayIndextoggle].nev; //HACK:
                    sorokXkimeresNevId = state.xkimeresnev[arrayIndextoggle].id;
                    sorokXkimeresNevUrtartalom =
                        state.xkimeresnev[arrayIndextoggle].urtartalom;

                    sorokEladottBeszar = Math.round(
                        (state.keszlet[arrayIndex].beszar /
                            state.keszlet[arrayIndex].cl) *
                            state.xkimeresnev[arrayIndextoggle].urtartalom
                    );

                    sorokEladottElar = Math.round(
                        (state.keszlet[arrayIndex].elar /
                            state.keszlet[arrayIndex].cl) *
                            state.xkimeresnev[arrayIndextoggle].urtartalom
                    );
                    datum = theTime();
                    state.pult.push({
                        id: sorokId,
                        nev: sorokNev,
                        kiszerelesId: sorokKiszerelesId,
                        xkimeresnevnev: sorokXkimeresNevNev,
                        xkimeresnevid: sorokXkimeresNevId,
                        xkimeresnevurtartalom: sorokXkimeresNevUrtartalom,
                        db: edb,
                        cl: sorokXkimeresNevUrtartalom,
                        sumcl: state.keszlet[arrayIndex].sumcl,
                        eladottbeszar: sorokEladottBeszar,
                        eladottelar: sorokEladottElar,
                        fizetesmod: "k",
                        transactionnumber: 7,
                        megjegyzes: "megjegyzes",
                        datum: datum,
                    });
                    kosarUjsorIndex = state.pult.length - 1;
                    termekKeszletModositas(
                        state.pult[kosarUjsorIndex],
                        "minus"
                    );
                    renderPult();
                }
            } else {
                eladottElar = state.keszlet[arrayIndex].elar;
                sorokNev = state.keszlet[arrayIndex].nev; //HACK:
                sorokId = state.keszlet[arrayIndex].id; //HACK:
                sorokKiszerelesId = state.keszlet[arrayIndex].kiszereles_id; //HACK:

                sorokEladottBeszar = state.keszlet[arrayIndex].beszar;

                sorokEladottElar = state.keszlet[arrayIndex].elar;
                datum = theTime();
                state.pult.push({
                    id: sorokId,
                    nev: sorokNev,
                    kiszerelesId: sorokKiszerelesId,
                    xkimeresnevnev: " ",
                    xkimeresnevid: -1,
                    xkimeresnevurtartalom: " ",
                    db: edb,
                    cl: state.keszlet[arrayIndex].cl,
                    sumcl: state.keszlet[arrayIndex].sumcl,
                    eladottbeszar: sorokEladottBeszar,
                    eladottelar: sorokEladottElar,
                    fizetesmod: "c",
                    transactionnumber: 21,
                    megjegyzes: "info",
                    datum: datum,
                });
                kosarUjsorIndex = state.pult.length - 1;
                termekKeszletModositas(state.pult[kosarUjsorIndex], "minus");
                renderPult();
            }
            /* HACK: now */
            document.getElementById("csoportnevKijelzo").innerHTML =
                state.csoportkategoria[
                    state.keszlet[arrayIndex].csoport_id - 1
                ].nev;
        });
    });
}

/* TODO:TODO:TODO: RENDERPRODUCT TODO:TODO:TODO: */
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

/* TODO:TODO:TODO: RENDERPULT TODO:TODO:TODO: */
function renderPult() {
    //FIXME: FIXME: FIXME:
    var tetelSorokHTML = "";
    var mindosszesen = 0;
    var mindosszesenElar = 0;
    var mindosszesenBeszar = 0;
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
        mindosszesenBeszar += sorok.eladottbeszar * sorok.db;
    }
    document.getElementById("pult").innerHTML = tetelSorokHTML;
    document.getElementById("summa").innerHTML = mindosszesen;
    mindosszesenTransaction = mindosszesen;
    mindosszesenTransactionBeszar = mindosszesenBeszar;
    $(".insert-db").click(function (event) {
        //HACK:HACK:HACK:HACK:HACK:
        let pultTombIndex = this.id;
        state.pult[pultTombIndex].db++;
        termekKeszletModositas(state.pult[pultTombIndex], "minus");
        renderPult();
        //HACK:HACK:HACK:HACK:HACK:
    });
    $(".remove-db").click(function (event) {
        let pultTombIndex = this.id;
        state.pult[pultTombIndex].db--;
        termekKeszletModositas(state.pult[pultTombIndex], "plus");
        renderPult();
    });
    $(".delete-db").click(function (event) {
        let pultTombIndex = this.id;
        termekKeszletModositas(state.pult[pultTombIndex], "reset");
        state.pult.splice(pultTombIndex, 1);
        renderPult();
    });
    foundPult = tetelSorokHTML == "" ? false : true;
}

/* TODO:TODO:TODO: TERMEK KESZLET MODOSITAS TODO:TODO:TODO: */
function termekKeszletModositas(sendData, muvelet) {
    if (sendData.kiszerelesId == 1) {
        for (let index = 0; index < state.kevert.length; index++) {
            if (sendData.id == state.kevert[index].termek_id) {
                for (let i = 0; i < state.keszlet.length; i++) {
                    if (state.kevert[index].adalek_id == state.keszlet[i].id) {
                        for (let ii = 0; ii < state.xkimeresnev.length; ii++) {
                            if (
                                state.kevert[index].xkimeresnev_id ==
                                state.xkimeresnev[ii].id
                            ) {
                                if (muvelet == "minus") {
                                    state.keszlet[i].sumcl =
                                        state.keszlet[i].sumcl -
                                        state.xkimeresnev[ii].urtartalom;
                                }
                                if (muvelet == "plus") {
                                    state.keszlet[i].sumcl =
                                        state.keszlet[i].sumcl +
                                        state.xkimeresnev[ii].urtartalom;
                                }
                                if (muvelet == "reset") {
                                    state.keszlet[i].sumcl =
                                        state.keszlet[i].sumcl +
                                        state.xkimeresnev[ii].urtartalom *
                                            sendData.db;
                                }
                                tarolj(
                                    state.keszlet[i].id,
                                    state.keszlet[i].sumcl
                                );
                            }
                        }
                    }
                }
            }
        }
    } else {
        if (muvelet == "minus") {
            sendData.sumcl = sendData.sumcl - sendData.cl;
        }
        if (muvelet == "plus") {
            sendData.sumcl = sendData.sumcl + sendData.cl;
        }
        if (muvelet == "reset") {
            sendData.sumcl = sendData.sumcl + sendData.cl * sendData.db;
        }
        tarolj(sendData.id, sendData.sumcl);
    }
}

/* TODO:TODO:TODO: TAROLJ TODO:TODO:TODO: */
function tarolj(id, sumcl) {
    try {
        updateMySQL();
    } catch (e) {}
    async function updateMySQL() {
        const response = await fetch("/keszletmodositas/", {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ id: id, sumcl: sumcl }),
        });
    }
}

/* TODO:TODO:TODO: UJ KOSARBA TESSZUK TODO:TODO:TODO: */
//FIXME: FIXME: FIXME:
function naTegyukEgyUjKosarba() {
    if (foundPult) {
        if (kosarbolVisszatoltott) {
            state.kosarak[kosarbolVisszatoltottId] = state.pult;
            state.pult = [];
            renderPult();
            kosarbolVisszatoltott = false;
            kosarbolVisszatoltottId = -1;
        } else {
            document.querySelector("#kosarMegnevezesId").value = "";
            kosarMegnevezes = "";
            $("#kosarMegnevezesModal").modal();
            //FIXME:
            document.getElementById("keyboardTemplateKosar").innerHTML =
                keyboardTemplateHTML;
            //FIXME:
            $(".keyboard").off("click");
            $(".keyboard").on("click", function () {
                inputKey = "";
                inputKey = this.id;
                inputKey = this.value;
                kosarMegnevezes += inputKey;
                document.querySelector("#kosarMegnevezesId").value =
                    kosarMegnevezes;
            });
        }
    }
    //BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:
    foundKosar = state.kosarak.length > 0 ? true : false;
}
//FIXME: FIXME: FIXME:

/* TODO:TODO:TODO: KOSAR NEVET KAP ES TAROL TODO:TODO:TODO: */
function kosarNevSzerintiTarolas() {
    state.kosarak.push(state.pult);
    state.kosarNevek.push({
        kosarMegnevezes: kosarMegnevezes,
        kosarMegnevezesIndex: state.kosarak.length,
    });

    state.pult = [];
    renderPult();
    //$(".keyboard").off("click");
}

/* TODO:TODO:TODO: KILEPES TODO:TODO:TODO: */
$(".kilepes").click(function () {
    if (state.kosarak > "" || state.pult > "") {
        alert("Előbb a kosarakat és a pultot üríteni kell !!!");
    } else {
        /* INFO:HACK:HACK:HACK: modosit HACK:HACK:HACK:INFO: */
        //window.location.href = "http://localhost:7777";
        //window.location.href = "http://photovegh.synology.me:7777/";
        window.location.href = "/";
        /* INFO:HACK:HACK:HACK: modosit HACK:HACK:HACK:INFO: */
    }
});

/* TODO:TODO:TODO: KOSARAK TODO:TODO:TODO: */
$(".kosarak").click(function () {
    if (foundPult) {
        alert(
            "Előbb a pulton lévő termékeket vagy fizettesd ki, vagy tedd a kosárba, de a pultnak üresnek kell lenni, hogy visszatölts egy kosarat!"
        );
    } else {
        foundKosar = state.kosarak.length > 0 ? true : false;
        if (foundKosar) {
            $("#kosarakModal").modal();
            var kosarSorokHTML = "";
            for (let index = 0; index < state.kosarak.length; index++) {
                kosarSorokHTML += `<button type="button" class="btn btn-info m-2 zzzzz zizitoast" id=${index}> ${state.kosarNevek[index].kosarMegnevezes} - ${state.kosarNevek[index].kosarMegnevezesIndex}</button><br>`;
                /* INFO:INFO:INFO:INFO: itt van a kosarnev INFO:INFO:INFO:INFO: */
                /* INFO:INFO:INFO:INFO: meg a kosarindex   INFO:INFO:INFO:INFO: */
            }

            document.getElementById("kosarakFelsorolasa").innerHTML =
                kosarSorokHTML;

            /* TODO:TODO:TODO: KOSAR KLIKK FIGYELES TODO:TODO:TODO: */
            $(".zzzzz").click(function () {
                if (state.kosarak[this.id].length == 0) {
                    alert("Ezt most törlöm mert üres kosár!");
                    state.kosarak.splice(this.id, 1);
                    state.kosarNevek.splice(this.id, 1);
                    kosarbolVisszatoltott = false;
                    foundKosar = state.kosarak.length > 0 ? true : false;
                    $("#kosarakModal .close").click();
                } else {
                    kosarbolVisszatoltott = true;
                    kosarbolVisszatoltottId = this.id;
                    state.pult = state.kosarak[this.id];
                    $("#kosarakModal .close").click();
                }
                //BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:
                foundKosar = state.kosarak.length > 0 ? true : false;
                renderPult();
            });
        }
    }
    foundKosar = state.kosarak.length > 0 ? true : false;
});

/* TODO:TODO:TODO: TR KP TODO:TODO:TODO: */
function trKp() {
    let trFizetesMod = "k";
    trNumber = createTrNumber();
    let megjegyzes = "*";
    createTranactionData(
        trNumber,
        trFizetesMod,
        megjegyzes,
        mindosszesenTransaction,
        mindosszesenTransactionBeszar
    );
    if (mindosszesenTransaction > 0) {
        visszajaro();
    }
}

function visszajaro() {
    $("#visszajaroModal").modal();
    let cimletek = [500, 1000, 2000, 5000, 10000, 20000];
    let visszajaroCimlet = "";
    for (cimlet of cimletek) {
        if (mindosszesenTransaction < cimlet) {
            visszajaroCimlet += `<h4><kbd>${cimlet}</kbd> cimletből visszajár: <span class="font-weight-bold"> ${
                cimlet - mindosszesenTransaction
            },- </span> Ft</h4>`;
        }
    }

    document.getElementById("cimletFelsorolas").innerHTML = visszajaroCimlet;
}

/* TODO:TODO:TODO: TR KP 2 😁 TODO:TODO:TODO: */
function trKp2() {
    let trFizetesMod = "m";
    trNumber = createTrNumber();
    let megjegyzes = "*";
    createTranactionData(
        trNumber,
        trFizetesMod,
        megjegyzes,
        mindosszesenTransaction,
        mindosszesenTransactionBeszar
    );
    if (mindosszesenTransaction > 0) {
        visszajaro();
    }
}
/* TODO:TODO:TODO: TR CARD TODO:TODO:TODO: */
function trCard() {
    let trFizetesMod = "c";
    trNumber = createTrNumber();
    let megjegyzes = "+";
    createTranactionData(
        trNumber,
        trFizetesMod,
        megjegyzes,
        mindosszesenTransaction,
        mindosszesenTransactionBeszar
    );
    //mindosszesenTransaction = -1
}
//BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:
/* TODO:TODO:TODO: TR HITEL TODO:TODO:TODO: */
function nevesitettHitel() {
    trFizetesMod = "h";
    trNumber = createTrNumber();
    megjegyzes = "";

    document.querySelector("#hitelMegnevezesId").value = "";
    hitelMegnevezes = "";

    if (kosarbolVisszatoltott) {
        megjegyzes = state.kosarNevek[kosarbolVisszatoltottId].kosarMegnevezes;
        trHitel();
    } else {
        if (foundPult) {
            $("#hitelMegnevezesModal").modal();
            //FIXME:
            document.getElementById("keyboardTemplateHitel").innerHTML =
                keyboardTemplateHTML;
            //FIXME:
            $(".keyboard").off("click");
            $(".keyboard").on("click", function () {
                inputKey = "";
                inputKey = this.id;
                inputKey = this.value;
                hitelMegnevezes += inputKey;
                document.querySelector("#hitelMegnevezesId").value =
                    hitelMegnevezes;
                megjegyzes = hitelMegnevezes;
            });
        }
    }
}
//BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:
function trHitel() {
    createTranactionData(
        trNumber,
        trFizetesMod,
        megjegyzes,
        mindosszesenTransaction,
        mindosszesenTransactionBeszar
    );
    //$(".keyboard").off("click");
}

/* TODO:TODO:TODO: TRANSACTIONS TODO:TODO:TODO: */
function createTranactionData(
    trNumber,
    trFizetesMod,
    megjegyzes,
    osszeg,
    ossegBeszar
) {
    try {
        updateMySQL();
        updateLastId();
    } catch (e) {}
    async function updateMySQL() {
        datum = theTime();
        const response = await fetch("/inserttransactions/", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                trnumber: trNumber,
                trdate: datum,
                trfizetesmod: trFizetesMod,
                megjegyzes: megjegyzes,
                pultos: pultos,
                kibeosszeg: osszeg,
                kibeosszegbeszar: ossegBeszar,
            }),
        });
        /* HACK:HACK:HACK:HACK:HACK: Hmmm... */
        renderGetdata();
        hitelStateRender();
    }
    async function updateLastId() {
        var response = await fetch("/lasttransactionid");
        lastTransactionId = await response.json();
        lastTransactionId = lastTransactionId[0]["max(id)"];
        for (let pultItem of state.pult) {
            insertForgalomData(
                lastTransactionId,
                pultItem.id,
                pultItem.db,
                pultItem.eladottbeszar,
                pultItem.eladottelar,
                pultItem.datum,
                pultItem.xkimeresnevid
            );
        }
    }
}

/* TODO:TODO:TODO: FORGALOM TODO:TODO:TODO: */
function trKivet() {
    osszeg = osszeg * -1;
    alert("Irány levonni a forgalomból ...");
    //FIXME:
    let trFizetesMod = "b";
    trNumber = createTrNumber();
    let megjegyzes = kivet;
    let trKivetNincsBeszar = 0;
    createTranactionData(
        trNumber,
        trFizetesMod,
        megjegyzes,
        osszeg,
        trKivetNincsBeszar
    );
}

/* TODO:TODO:TODO: FORGALOM TODO:TODO:TODO: */
async function insertForgalomData(
    lastTransactionId,
    id,
    db,
    eladottbeszar,
    eladottelar,
    xDatum,
    xkimeresnevid
) {
    const response = await fetch("/insertforgalom/", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            transaction_id: lastTransactionId,
            termekid: id,
            db: db,
            eladottbeszar: eladottbeszar,
            eladottelar: eladottelar,
            eladottdate: xDatum,
            xkimeresnevid: xkimeresnevid,
        }),
    });
    //INFO:INFO:INFO: leellenorizni !!!!!!! INFO:INFO:INFO:
    foundPult = false;
    if (kosarbolVisszatoltott) {
        kosarbolVisszatoltott = false;
        state.kosarak.splice(kosarbolVisszatoltottId, 1);
        state.kosarNevek.splice(kosarbolVisszatoltottId, 1);
        kosarbolVisszatoltottId = -1;
    }
    if (foundKosar.length == 0) {
        foundKosar = false;
    }
    state.pult = [];
    renderPult();
    //INFO:INFO:INFO: leellenorizni !!!!!!! INFO:INFO:INFO:
}

/* TODO:TODO:TODO: KP KIVET TODO:TODO:TODO: */
$(".kpKivet").click(function () {
    //$("#myModalKivet").modal();
    $("#kivetMegnevezesModal").modal();
    //FIXME:
    document.getElementById("keyboardTemplateKivet").innerHTML =
        keyboardTemplateHTML;
    //FIXME:
    $(".keyboard").off("click");
    document.querySelector("#kivetMegnevezesId").value = "";
    $(".keyboard").on("click", function () {
        inputKey = "";
        inputKey = this.id;
        inputKey = this.value;
        kivetMegnevezes += inputKey;
        document.querySelector("#kivetMegnevezesId").value = kivetMegnevezes;
        kivet = kivetMegnevezes;
    });
});

function kivetOsszegNumber() {
    $("#osszegModal").modal();
    $(".calc").off("click");
    document.querySelector("#osszegKivetId").value = "";
    $(".calc").on("click", function () {
        inputKey = "";
        inputKey = this.id;
        inputKey = this.value;
        osszegKivet += inputKey;
        document.querySelector("#osszegKivetId").value = osszegKivet;
        osszeg = parseInt(osszegKivet);
    });
    osszegKivet = "";
}

let datumHTML = datum;
/* let datumHTML =
    trNumberDatum.getFullYear() +
    " - " +
    (trNumberDatum.getMonth() + 1) +
    " - " +
    trNumberDatum.getDate(); */
document.getElementById("datum").innerHTML = datumHTML;

/* TODO:TODO:TODO: CREATE TR NUMBER TODO:TODO:TODO: */
function createTrNumber() {
    trNumberDatum = new Date();
    trNumber =
        trNumberDatum.getFullYear() +
        "." +
        (trNumberDatum.getMonth() + 1) +
        "." +
        trNumberDatum.getDate() +
        "." +
        trNumberDatum.getHours() +
        "." +
        trNumberDatum.getMinutes() +
        "." +
        trNumberDatum.getSeconds() +
        "." +
        trNumberDatum.getMilliseconds();
    return trNumber;
}
/* TODO:TODO:TODO: theTime TODO:TODO:TODO: */
function theTime() {
    var xDatum = new Date().toLocaleString();
    return xDatum;
}

/* TODO:TODO:TODO: HITELRENDEZES MOD TODO:TODO:TODO: */
function hitelFizetesKp() {
    let id = fizetoHitelesId;
    trFizetesMod = "k";
    let hitelTrDatum = new Date().toLocaleString();
    let megjegyzes =
        "x " + fizetoHitelesMegjegyzes + " rendezve: " + hitelTrDatum;
    modifyTranactionData(id, trFizetesMod, megjegyzes);
    state.fullTransactionsHitel[fizetoHitelesIndex].trFizetesMod = trFizetesMod;
    state.fullTransactionsHitel.splice(fizetoHitelesIndex, 1);
    fizetoHitelesId = -1;
    fizetoHitelesMegjegyzes = "";
    fizetoHitelesIndex = -1;
    trFizetesMod = "";
}
function hitelFizetesCard() {
    let id = fizetoHitelesId;
    trFizetesMod = "c";
    let hitelTrDatum = new Date().toLocaleString();
    let megjegyzes =
        "x " + fizetoHitelesMegjegyzes + " rendezve: " + hitelTrDatum;
    modifyTranactionData(id, trFizetesMod, megjegyzes);
    state.fullTransactionsHitel[fizetoHitelesIndex].trFizetesMod = trFizetesMod;
    state.fullTransactionsHitel.splice(fizetoHitelesIndex, 1);
    fizetoHitelesId = -1;
    fizetoHitelesMegjegyzes = "";
    fizetoHitelesIndex = -1;
    trFizetesMod = "";
}
/* TODO:TODO:TODO: HITELRENDEZESTRANSACTION TODO:TODO:TODO: */
function modifyTranactionData(id, trFizetesMod, megjegyzes) {
    try {
        updateMySQL();
    } catch (e) {}
    async function updateMySQL() {
        //datum = theTime();
        const response = await fetch("/modifytransactions/", {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                id: id,
                trfizetesmod: trFizetesMod,
                megjegyzes: megjegyzes,
            }),
        });
        /* HACK:HACK:HACK:HACK:HACK: Hmmm... */
        renderGetdata();
        hitelStateRender();
    }
}

function fullTransactionsHitel() {
    let hitelListHTML = "";
    $("#hitelRendezesModal").modal();
    hitelListHTML = hitelStateRender();

    document.getElementById("hitelList").innerHTML = hitelListHTML;
    $(".hitelListRendez").off("click");

    //document.querySelector("#osszegKivetId").value = "";
    $(".hitelListRendez").on("click", function (e) {
        fizetoHitelesId = this.id;
        fizetoHitelesMegjegyzes = e.target.dataset.megjegyzes;
        fizetoHitelesIndex = e.target.dataset.index;
        $("#hitelRendezesModal .close").click();
        $("#fizetoHitelesModModal").modal();
    });
}
function hitelStateRender() {
    let hitelListHTML = "";
    let index = 0;
    for (hitel of state.fullTransactionsHitel) {
        hitelListHTML += `<h5 class='card hitelListRendez' data-megjegyzes=${hitel.megjegyzes} data-index=${index} id='${hitel.id}'>${hitel.megjegyzes} összeg: ${hitel.kibeosszeg} * ${hitel.id}</h5>`;
        index++;
    }
    return hitelListHTML;
}

window.onload = renderPult();

function keyboardTemplateRender() {
    return `
    <div class="vKeyboard-container d-flex row">

                            <div class=" vKeyboard-letters " id="vKeyboard-letters">
                                <div class="row vKeyboardRow vKeyboard-offsetRow1 justify-content-center m-1">
                                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                id="keyboard-Q" value="Q">Q</button>
                                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                id="keyboard-W" value="W">W</button>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-E" value="E">E</button>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-R" value="R">R</button>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-T" value="T">T</button>
                                        <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-Z" value="Z">Z</button>
                                    
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-U" value="U">U</button>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-I" value="I">I</button>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-O" value="O">O</button>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-P" value="P">P</button>
                                </div>
                                <div class="row vKeyboardRow vKeyboard-offsetRow2 justify-content-center">
                                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-A" value="A">A</button>
                                    
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-S" value="S">S</button>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-D" value="D">D</button>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-F" value="F">F</button>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-G" value="G">G</button>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-H" value="H">H</button>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-J" value="J">J</button>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-K" value="K">K</button>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-L" value="L">L</button>
                                    
                                </div>
                                <div class="row vKeyboardRow vKeyboard-offsetRow3 justify-content-center">
                                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-Y" value="Y">Y</button>
                                    
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-X" value="X">X</button>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-C" value="C">C</button>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-V" value="V">V</button>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-B" value="B">B</button>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-N" value="N">N</button>
                                        <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                                        id="keyboard-M" value="M">M</button>
                                    <span class="vKeyboard-spacer"></span>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-symbol m-1"
                                        id="keyboard-tiret" value="-">-</button>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-symbol m-1"
                                        id="keyboard-underscore" value="_">_</button>
                                    <button type="button col" class="btn keyboard btn-primary vKeyboard-symbol m-1"
                                        id="keyboard-@" value="@">@</button>
                                </div>
                                <div class="row vKeyboardRow justify-content-center">
                                    
                                    <button type="button col"
                                        class="btn keyboard btn-primary vKeyboard-symbol vKeyboard-space"
                                        id="keyboard-space" value=".">
                                        <span class="vKeyboard-space-character">┗━━━━━━━━━━━┛</span>
                                    </button>
                                </div>
                            </div>

                        </div>
    `;
}

/* INFO: másodlagos STATE bekérés INFO: */
/* TODO:TODO:TODO: RENDER GETDATA TODO:TODO:TODO: */
async function renderGetdata() {
    /* NOTE: get gettransactionshitel RENDER*/
    var id = "h";
    var response = await fetch(`/gettransactionshitel/${id}`);
    //var response = await fetch("/gettransactionshitel");
    state.fullTransactionsHitel = await response.json();
}
