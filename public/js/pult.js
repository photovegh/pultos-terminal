const trNumberDatum = new Date();
var datum = new Date().toLocaleString();
//const datum = new Date().toLocaleDateString();
//const ido = new Date().toLocaleDateString("en-CA");
//console.log(datum);
//var lastTransaction = -1;
var trNumber = "";
var pultos = 2;
var lastTransactionId = -1;
var trFizetesMod = "";
var megjegyzes = "";
var kivetMegnevezes = "";
var osszegKivet = "";
var osszeg = -1;
createTrNumber();
//console.log("app trNumber");
//console.log(trNumber);
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
    fullTransactions: [],
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
    var response = await fetch("/gettransactions");
    state.fullTransactions = await response.json();

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
            console.log(state.pult);
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
                                //console.log(state.xkimeresnev[ii].nev);
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
        window.location.href = "http://test:7777";
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
            console.log("state.kosarak.length******************");
            console.log(state.kosarak.length);
            for (let index = 0; index < state.kosarak.length; index++) {
                kosarSorokHTML += `<button type="button" class="btn btn-info m-2 zzzzz zizitoast" id=${index}> ${state.kosarNevek[index].kosarMegnevezes} - ${state.kosarNevek[index].kosarMegnevezesIndex}</button><br>`;
                /* INFO:INFO:INFO:INFO: itt van a kosarnev INFO:INFO:INFO:INFO: */
                /* INFO:INFO:INFO:INFO: meg a kosarindex   INFO:INFO:INFO:INFO: */
            }

            document.getElementById("kosarakFelsorolasa").innerHTML =
                kosarSorokHTML;

            /* TODO:TODO:TODO: KOSAR KLIKK FIGYELES TODO:TODO:TODO: */
            $(".zzzzz").click(function () {
                console.log(state.kosarak[this.id].length);
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
    createTranactionData(trNumber, trFizetesMod, megjegyzes);
}
/* TODO:TODO:TODO: TR CARD TODO:TODO:TODO: */
function trCard() {
    let trFizetesMod = "c";
    trNumber = createTrNumber();
    let megjegyzes = "+";
    createTranactionData(trNumber, trFizetesMod, megjegyzes);
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
        console.log(
            "state.kosarNevek[kosarbolVisszatoltottId].kosarMegnevezes"
        );
        console.log(state.kosarNevek[kosarbolVisszatoltottId].kosarMegnevezes);
        trHitel();
    } else {
        if (foundPult) {
            $("#hitelMegnevezesModal").modal();
            $(".keyboard").off("click");
            $(".keyboard").on("click", function () {
                inputKey = "";
                inputKey = this.id;
                inputKey = this.value;
                hitelMegnevezes += inputKey;
                document.querySelector("#hitelMegnevezesId").value =
                    hitelMegnevezes;
                megjegyzes = hitelMegnevezes;
                console.log(megjegyzes);
            });
        }
    }
}
//BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:
function trHitel() {
    createTranactionData(trNumber, trFizetesMod, megjegyzes);
    //$(".keyboard").off("click");
}

/* TODO:TODO:TODO: TRANSACTIONS TODO:TODO:TODO: */
function createTranactionData(trNumber, trFizetesMod, megjegyzes) {
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
            }),
        });
    }
    async function updateLastId() {
        var response = await fetch("/lasttransactionid");
        lastTransactionId = await response.json();
        lastTransactionId = lastTransactionId[0]["max(id)"];
        //console.log("lastTransactionId OK ");
        //console.log(lastTransactionId);
        for (let pultItem of state.pult) {
            //console.log("lastTransactionId");
            //console.log(lastTransactionId);
            //console.log(pultItem.id);
            //console.log(pultItem.db);
            //console.log(pultItem.eladottbeszar);
            //console.log(pultItem.eladottelar);
            //console.log(datum);
            //console.log(pultItem.xkimeresnevid);
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
    console.log("penztarbol kivet OKKKKKKKK");
    alert("Irány levonni a forgalomból ...");
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
    //console.log("forgalom data ok++++++");
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
    console.log("response ??????????????????");
    console.log(response);
    //INFO:INFO:INFO: leellenorizni !!!!!!! INFO:INFO:INFO:
    console.log("foundPult");
    console.log(foundPult);
    console.log("foundKosar");
    console.log(foundKosar);
    console.log("kosarbolVisszatoltott");
    console.log(kosarbolVisszatoltott);
    console.log("kosarbolVisszatoltottId");
    console.log(kosarbolVisszatoltottId);
    console.log("kosarMegnevezes");
    console.log(kosarMegnevezes);

    console.log("state.kosarak AAAAAAAAAAAAA");
    console.log(state.kosarak);
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
    console.log("state.kosarak XXXXXXXXXXXXXXX");
    console.log(state.kosarak);

    state.pult = [];
    renderPult();
    //INFO:INFO:INFO: leellenorizni !!!!!!! INFO:INFO:INFO:
}

/* TODO:TODO:TODO: KP KIVET TODO:TODO:TODO: */
$(".kpKivet").click(function () {
    //$("#myModalKivet").modal();
    $("#kivetMegnevezesModal").modal();
    $(".keyboard").off("click");
    document.querySelector("#kivetMegnevezesId").value = "";
    $(".keyboard").on("click", function () {
        inputKey = "";
        inputKey = this.id;
        inputKey = this.value;
        kivetMegnevezes += inputKey;
        document.querySelector("#kivetMegnevezesId").value = kivetMegnevezes;
        kivet = kivetMegnevezes;
        console.log("kivet");
        console.log(kivet);
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
        console.log(this.value);
        osszegKivet += inputKey;
        document.querySelector("#osszegKivetId").value = osszegKivet;
        osszeg = parseInt(osszegKivet);
        console.log("osszeg");
        console.log(osszeg);
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
    trNumber =
        trNumberDatum.getFullYear() +
        "." +
        trNumberDatum.getMonth() +
        "." +
        trNumberDatum.getDay() +
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

function getFullTransactions() {
    console.log("Itt rendezzük a hiteleket ... 😉");
}

window.onload = renderPult();
