const state = {
    termekek: [],
};
var productsAreaHTML = "";
getdata();

var keszlet = 0;
var nev = "";
var kiszerelesId = -1;
var valtoztatas = 0;
var idSend = 0;
var cl = 0;
var sumcl = 0;
document.getElementById("nevSzukit").value = "";
var szukit = document.getElementById("nevSzukit").value;
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
                    kiszerelesId = product.kiszereles_id;
                    idSend = this.id;
                    cl = product.cl;
                    sumcl = product.sumcl;
                }
            }
            addStockQuantity(idSend, nev, keszlet);
        }
    });
}

async function getdata() {
    var response = await fetch("/datareadtermekek");
    state.termekek = await response.json();

    renderTermekek();

    $(document).ready(function () {
        productsButtonRender();
    });
}

function addStockQuantity(idSend, nev, keszlet) {
    $("#addStockQuantityModal").modal();
    document.getElementById("addStockQuantityName").innerHTML = nev + "<br>";
    document.getElementById("addStockQuantityKeszlet").innerHTML = keszlet;
}

function renderTermekek() {
    productsAreaHTML = "";
    for (product of state.termekek) {
        if (product.nev.toLowerCase().search(keresValue.toLowerCase()) >= 0) {
            productsAreaHTML += `<button type="button" class="btn btn-primary m-2 p-2 productsButton" id=${product.id} data-nev=${product.nev}>${product.nev} - ${product.id}</button>`;
        }
    }
    document.getElementById("productArea").innerHTML = productsAreaHTML;
}

function keszletValtozas() {
    valtoztatas = document.getElementById("addQuantity").value;
    valtoztatas = parseInt(valtoztatas);
    if (isNaN(valtoztatas)) {
        valtoztatas = 0;
    } else {
        console.log("isNaN 😁");
    }
    document.getElementById("addQuantity").value = "";

    /* TODO:TODO:TODO:TODO:TODO:TODO:TODO: */
    updatetermekekbeszerzes(valtoztatas);
    function updatetermekekbeszerzes(valtoztatas) {
        try {
            updateMySQL(valtoztatas);
        } catch (e) {}
        async function updateMySQL(valtoztatas) {
            let origId = idSend;
            keszlet = parseInt(keszlet) + valtoztatas;
            if (kiszerelesId == 2) {
                cl = parseInt(cl);
                sumcl = parseInt(sumcl) + valtoztatas * cl;
            } else {
                cl = cl;
                sumcl = parseInt(sumcl) + valtoztatas;
            }

            //INFO:
            for (productNew of state.termekek) {
                if ((productNew.id = origId)) {
                    productNew.keszlet = keszlet;
                    productNew.cl = cl;
                    productNew.sumcl = sumcl;
                }
            }

            const response = await fetch("/updatetermekekbeszerzes/", {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    id: idSend,
                    keszlet: keszlet,
                    cl: cl,
                    sumcl: sumcl,
                }),
            });
            console.log(response);
        }
    }

    /* TODO:TODO:TODO:TODO:TODO:TODO:TODO: */
    //INFO:
    //INFO:
    window.location.href = "/";
    //INFO:
    //INFO:
}

/* NOTE: INPUT NotNull !!!! NOTE: */

/* NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: */

console.log("Ez az adminisztációs Js ami pl figyeli az input mezőket");
console.log("🤔😋😋😋😋😋🤔😎😎😎");
