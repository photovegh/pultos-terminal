const datum = new Date();
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
    kosarNevek: [],
    kevert: [],
};

// NOTE: Ezek kellenek a forgalom adatokhoz
/*
 termék (transaction) :HACK:
 - id
 - transaction number
 - date
 - pultos
 - fizetés: kp, kártya, hitel, leltár, beszállító kifizetés ?????
 - info
 ======================================================================
 termék (transaction item) :HACK:
 - név id
 - db
 - adott eladási kiszereles beszar
 - adott eladási kiszereles elar
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
    /* NOTE: get kevert */
    var response = await fetch("/datareadkevert");
    state.kevert = await response.json();
    console.log("/datareadkevert");
    console.log(state.kevert);

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
                state.pult.push({
                    id: sorokId,
                    nev: sorokNev,
                    kiszerelesId: sorokKiszerelesId,
                    xkimeresnevnev: " ",
                    xkimeresnevid: " ",
                    xkimeresnevurtartalom: " ",
                    db: edb,
                    cl: state.keszlet[arrayIndex].cl,
                    sumcl: state.keszlet[arrayIndex].sumcl,
                    eladottbeszar: sorokEladottBeszar,
                    eladottelar: sorokEladottElar,
                    fizetesmod: "c",
                    transactionnumber: 21,
                    megjegyzes: "info",
                });
                kosarUjsorIndex = state.pult.length - 1;
                termekKeszletModositas(state.pult[kosarUjsorIndex], "minus");
                renderPult();
            }
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
                                console.log(state.xkimeresnev[ii].nev);
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
    $(".keyboard").off("click");
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

$(".kpKivet").click(function () {
    $("#myModalKivet").modal();
});
let datumHTML =
    datum.getFullYear() +
    " - " +
    (datum.getMonth() + 1) +
    " - " +
    datum.getDate();
document.getElementById("datum").innerHTML = datumHTML;

window.onload = renderPult();
