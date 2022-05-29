const state = {
    termekek: [],
};
var productsAreaHTML = "";
getdata();

/* const element = document.getElementById("myBtn"); */
var keszlet = 0;
var nev = "";
var valtoztatas = 0;
document.getElementById("nevSzukit").value = "";
var szukit = document.getElementById("nevSzukit").value;
console.log("szukit");
console.log(szukit);
var keresValue = "";

const szukitBtn = document.querySelector("#szukit-btn");
szukitBtn.onclick = function () {
    keresValue = document.querySelector("#nevSzukit").value;
    renderTermekek();
    productsButtonRender();
};

function productsButtonRender() {
    $(".productsButton").click(function (e) {
        if (e.target.nodeName == "BUTTON") {
            for (product of state.termekek) {
                if (product.id == this.id) {
                    nev = product.nev;
                    keszlet = product.keszlet;
                }
            }
            addStockQuantity(this.id, nev, keszlet);
        }
    });
}

async function getdata() {
    var response = await fetch("/datareadtermekek");
    state.termekek = await response.json();
    console.log("getdata function is OK");
    console.log(state.termekek[0]);

    renderTermekek();

    $(document).ready(function () {
        productsButtonRender();
    });
}

function addStockQuantity(id, nev, keszlet) {
    console.log("addEventListener(click), addStockQuantity)");
    console.log(id);
    console.log(nev);

    $("#addStockQuantityModal").modal();
    document.getElementById("addStockQuantityName").innerHTML = nev + "<br>";
    document.getElementById("addStockQuantityKeszlet").innerHTML = keszlet;
}

function renderTermekek() {
    console.log("renderTermekek function is OK");
    console.log("szukit");
    console.log(szukit);
    productsAreaHTML = "";

    for (product of state.termekek) {
        if (product.nev.search(keresValue) >= 0) {
            console.log("true 😋😋🥰🥰🥰");
            productsAreaHTML += `<button type="button" class="btn btn-primary m-2 p-2 productsButton" id=${product.id} data-nev=${product.nev}>${product.nev} - ${product.id}</button>`;
            console.log(product.nev);
        }
    }
    document.getElementById("productArea").innerHTML = productsAreaHTML;
}

function keszletValtozas() {
    valtoztatas = document.getElementById("addQuantity").value;
    console.log("valtoztatas");
    console.log(valtoztatas);
    document.getElementById("addQuantity").value = "";
    valtoztatas = 0;
}

/* NOTE: INPUT NotNull !!!! NOTE: */

/* NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: */

console.log("Ez az adminisztációs Js ami pl figyeli az input mezőket");
console.log("🤔😋😋😋😋😋🤔😎😎😎");
/* console.log("Hol a fenebe vagyok? 😂😂😂");
alert("The URL of this page is: " + window.location.href);
var adminURL = window.location.href;
localStorage.setItem("adminLocal", adminURL);
console.log(adminURL); */

/* function figyel() {
    if (document.getElementById("nev") == "*") {
        console.log("******* mezo URES *******");
    }
} */

/* HACK: fv() hívás HACK: */
//renderProducts();
/* NOTE: A button click funkciójának figyelése */
/*   $(document).ready(function () {
        let arrayIndex = -1;
        let arrayIndextoggle = -1;
        let vElar = -1;
        let vNev;
        localStorage.setItem("vElar", vElar);
        let summa = 0;
        let xxx = "";

        $(".btnKeszlet, .dropdown-item, .dropdown-toggle").click(function (e) {
            if (e.target.nodeName == "BUTTON") {
                arrayIndex = this.id;
            }
            
            let xButtonOrP = "";
            console.log("click 😊");
            console.log("arrayIndex");
            console.log(arrayIndex);
            console.log("arrayIndextoggle");
            console.log(arrayIndextoggle);
            xButtonOrP = e.target.nodeName;
            console.log(xButtonOrP);

            if (state.keszlet[arrayIndex].kiszereles_id == 2) {
                if (e.target.nodeName == "P") {
                    arrayIndextoggle = this.id;

                    vNev = state.keszlet[arrayIndex].nev;
                    vElar =
                        (state.keszlet[arrayIndex].elar /
                            state.keszlet[arrayIndex].cl) *
                        state.xkimeresnev[arrayIndextoggle].urtartalom;

                    arrayPultNev.push(state.keszlet[arrayIndex].nev);
                    arrayPultElar.push(vElar);
                }
               
                console.log("vNev");
                console.log(vNev);
                console.log("vElar");
                console.log(vElar);
              
            } else {
             
                arrayPultNev.push(state.keszlet[arrayIndex].nev);
                arrayPultElar.push(state.keszlet[arrayIndex].elar);
                vElar = state.keszlet[arrayIndex].elar;
               
                vNev = state.keszlet[arrayIndex].nev;
                vElar = state.keszlet[arrayIndex].elar;
            }
        });
    }); */

/* INFO: termék //ok bekérése END INFO: */
