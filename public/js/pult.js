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
//var pultIndex = 0;
var productsHTML = "";
//var productsHTMLdrop = "";
var foundPult = false;
var foundKosar = false;
var kosarbolVisszatoltott = false;
var kosarbolVisszatoltottId = -1;
var kosarMegnevezes = "*";

//async function getLastTransaction() {//INFO: kivenni a getdata()-ból
/* NOTE: get last-transaction */
//    var response = await fetch("/lasttransaction");
//    state.lastTransaction = await response.json();
//}

//getLastTransaction();
getdata();

/* INFO: termék //ok bekérése START INFO: */
/* TODO:TODO:TODO: GETDATA TODO:TODO:TODO: */
/*  */
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
    /* BUG:                        BUG: mit akarsz a pulthoz adni BUG: */
    $(document).ready(function () {
        let arrayIndex = -1;
        let arrayIndextoggle = -1;
        let eladottElar = -1;
        let sorokNev;
        let kosarUjsorIndex = -1;
        localStorage.setItem("eladottElar", eladottElar);
        let summa = 0;
        let xxx = "";
        /* BUG: dropdown-item figyelése BUG: mit akarsz a pulthoz adni BUG: */
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
                    sorokKiszerelesId = state.keszlet[arrayIndex].kiszereles_id; //HACK:

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
                    /* console.log("beszar");
                    console.log(state.keszlet[arrayIndex].beszar);
                    console.log(state.keszlet[arrayIndex].cl);
                    console.log(state.xkimeresnev[arrayIndextoggle].urtartalom); */

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
                    //alert("Szalad készletet módosítani, *** EZT NEM KELL *** és lastTransactiont! 🚀");
                    /* console.log("Összkészlet módosítás: ");
                    console.log("Új sor INDEXE:");
                    console.log(kosarUjsorIndex); */
                    kosarUjsorIndex = state.pult.length - 1;
                    termekKeszletModositas(
                        state.pult[kosarUjsorIndex],
                        "minus"
                    );
                    renderPult();
                }
            } else {
                /* HACK: cl????????  HACK: */
                //arrayIndextoggle = this.id; //HACK:

                eladottElar = state.keszlet[arrayIndex].elar;
                sorokNev = state.keszlet[arrayIndex].nev; //HACK:
                sorokId = state.keszlet[arrayIndex].id; //HACK:
                sorokKiszerelesId = state.keszlet[arrayIndex].kiszereles_id; //HACK:

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
                //pultRender(arrayIndex); //BUG:BUG:BUG:BUG:BUG:BUG:BUG: state
                //alert("Szalad készletet módosítani, és *** EZT NEM KELL *** lastTransactiont! 🚀");
                /* console.log("Összkészlet módosítás: ");
                console.log("Új sor INDEXE:");
                console.log(kosarUjsorIndex); */
                kosarUjsorIndex = state.pult.length - 1;
                termekKeszletModositas(state.pult[kosarUjsorIndex], "minus");
                renderPult();
            }
        });
    });
}
/* BUG:                        BUG: mit akarsz a pulthoz adni BUG: */

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
    //var kosarMegnevezes = "*";
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
        //alert("Szalad készletet módosítani! 🚀");
        console.log("Összkészlet módosítás: .insert-db");
        //console.log(state.pult[pultTombIndex].nev);
        //console.log(state.pult[pultTombIndex].id);
        //console.log("state.pult[pultTombIndex].kiszerelesId");
        //console.log(state.pult[pultTombIndex].kiszerelesId);
        //console.log(state.pult[pultTombIndex]);
        termekKeszletModositas(state.pult[pultTombIndex], "minus");
        renderPult();
        //HACK:HACK:HACK:HACK:HACK:
    });
    $(".remove-db").click(function (event) {
        let pultTombIndex = this.id;
        state.pult[pultTombIndex].db--;
        console.log("Összkészlet módosítás: .remove-db");
        termekKeszletModositas(state.pult[pultTombIndex], "plus");
        renderPult();
    });
    $(".delete-db").click(function (event) {
        let pultTombIndex = this.id;
        console.log("Összkészlet módosítás: .delete-db");
        termekKeszletModositas(state.pult[pultTombIndex], "reset");
        /* BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:
Naon vigyázz itt undefined lesz a state.pult a splice()-nyel
BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG: */
        state.pult.splice(pultTombIndex, 1);
        //termekKeszletModositas(state.pult[pultTombIndex]);
        renderPult();
    });
    //foundKosar = tetelSorokHTML == "" ? false : true;
    foundPult = tetelSorokHTML == "" ? false : true;
}

/* TODO:TODO:TODO: TERMEK KESZLET MODOSITAS TODO:TODO:TODO: */
/* 
- ha új sor kerül a kosárba, a komplett kosár state objectumot küldöm, tehát a last sor kell módosítani a termék készleten!!!
- ha meglévő sorba módosítom a db-t csak a konkrét termék objektumát küldöm
*/
function termekKeszletModositas(sendData, muvelet) {
    console.log("termekKeszletModositas()");
    console.log(sendData);
    console.log(muvelet);
    if (sendData.kiszerelesId == 1) {
        console.log("kiszerelesId OK state.kevert.length");
        for (let index = 0; index < state.kevert.length; index++) {
            if (sendData.id == state.kevert[index].termek_id) {
                console.log("-----------------------");
                console.log(state.kevert[index].adalek_id);
                for (let i = 0; i < state.keszlet.length; i++) {
                    if (state.kevert[index].adalek_id == state.keszlet[i].id) {
                        console.log("ok");
                        console.log(state.keszlet[i].nev);
                        //console.log("sumcl !!!!!!!!!!!!!!!!!!!");
                        //console.log(state.keszlet[i].sumcl);
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
        //let sumcl = -1;
        console.log("egyeeeeeeeeb");
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
    console.log("tarolj");
    console.log(id);
    console.log(sumcl);
    console.log("*************************");

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
        //console.log(response);
    }
}

/* TODO:TODO:TODO: UJ KOSARBA TESSZUK TODO:TODO:TODO: */
//FIXME: FIXME: FIXME:
function naTegyukEgyUjKosarba() {
    //console.log("kapdBe");
    if (foundPult) {
        if (kosarbolVisszatoltott) {
            //console.log("😁🦉😊🤔😁😁😁");
            /* state.kosarak.push(state.pult);
            state.kosarNevek.push({
            kosarMegnevezes: kosarMegnevezes,
            kosarMegnevezesIndex: state.kosarak.length,
           }); */
            /* state.pult = state.kosarak[this.id]; */
            //console.log("eeeeeees ez megy vissza ======================");
            state.kosarak[kosarbolVisszatoltottId] = state.pult;
            //console.log(state.kosarak[kosarbolVisszatoltottId]);
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
                /* console.log("keyboard************this.id*******************");
            console.log(this.id); */
                inputKey = this.id;
                //console.log("this.value");
                inputKey = this.value;
                /* console.log("*******************************");
            console.log("inputKey");
            console.log(inputKey); */
                kosarMegnevezes += inputKey;
                /* console.log("***************kosarMegnevezes****************");
            console.log("document.querySelector(#inputKey)");
            console.log(kosarMegnevezes); */
                document.querySelector("#kosarMegnevezesId").value =
                    kosarMegnevezes;

                //$(".keyboard").off("click");
            });
        }
    }

    foundKosar = state.kosarak.length >= 0 ? true : false;
    //console.log(state.kosarak.length);
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

    //console.log("state.kosarak--------😎😎😎😎😎😎😋------------------");

    /* for (let i = 0; i < state.kosarak.length; i++) {
        for (let sorok of state.kosarak[i]) {
            console.log(sorok.nev);
        }
    } */

    /* console.log(state.kosarak);
    console.log(state.kosarNevek);

    console.log("state.kosarak.length");
    console.log(state.kosarak.length); */

    // kosarMegnevezes = "jani";
    /* console.log("document.querySelector(#kosarMegnevezesId");
    console.log(document.querySelector("#kosarMegnevezesId").value);
    kosarMegnevezes = document.querySelector("#kosarMegnevezesId").value; */
    /* state.pult.push({
        kosarMegnevezes: kosarMegnevezes,
        kosarMegnevezesIndex: state.kosarak.length,
    }); */

    /* state.kosarak.push(
        "state.kosarak.length",
        state.kosarak.length,
        state.pult
    ); */
}

/* $(".kosarBtn").click(function () {BUG: megszunt
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
}); */

/* TODO:TODO:TODO: KOSARAK TODO:TODO:TODO: */
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
                /* kosarSorokHTML += `<div class="card m-3" id=${index} ><h3>${state.kosarak[index][1].kosarMegnevezes} - ${state.kosarak[index][1].kosarMegnevezesIndex}</h3></div>`; */

                kosarSorokHTML += `<button type="button" class="btn btn-info m-2 zzzzz" id=${index}> ${state.kosarNevek[index].kosarMegnevezes} - ${state.kosarNevek[index].kosarMegnevezesIndex}</button><br>`;

                /* INFO:INFO:INFO:INFO: itt van a kosarnev INFO:INFO:INFO:INFO: */
                /* INFO:INFO:INFO:INFO: meg a kosarindex   INFO:INFO:INFO:INFO: */
                /* console.log("kosarSor 🤔");
                console.log(state.kosarNevek[index].kosarMegnevezes);
                console.log("state.kosarNevek.lenght");
                console.log(state.kosarNevek.length);
                console.log("state.kosarak");
                console.log(state.kosarak); */
                /* console.log("state.kosarak[index][0].nev");
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

            /* TODO:TODO:TODO: KOSAR KLIKK FIGYELES TODO:TODO:TODO: */
            $(".zzzzz").click(function () {
                /* for (let index = 0; index < state.kosarak.length; index++) {
                    console.log(this.id);
                    tetelIndex = parseInt(this.id);
                    for (sorok of state.kosarak[tetelIndex]) {
                        console.log(sorok.nev);
                    }
                } */
                //let thisid = parseInt(this.id);
                //thisid = thisid + 1;
                //BUG:
                //console.log("this.id");
                //console.log(
                //    this.id
                /* document.querySelector("#kosarakFelsorolasa").value */
                //);
                //BUG:
                //console.log(state.kosarak[thisid + 1][0].nev);
                /* let sorIndex = 0;
                for (let tetelek of state.kosarak) {
                    console.log(tetelek);
                    console.log(tetelek[sorIndex]);
                    sorIndex++;
                } */
                //console.log("state.kosarak[this.id]😋😋😋😋😋😋😎");
                //console.log("ha ezt bejárom, megkapom a kosártételeket");
                //console.log(state.kosarak[this.id]); //INFO: és ha ezt bejárom, megkapom a kosártételeket😋😋😋😋😋😋😎
                kosarbolVisszatoltott = true;
                kosarbolVisszatoltottId = this.id;

                state.pult = state.kosarak[this.id];
                renderPult();
            });
        }
    }
});

window.onload = renderPult();
