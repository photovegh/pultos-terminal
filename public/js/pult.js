// NOTE: Ez definiálja a bekért adatok ojektum tömbjét 😎
const state = {
    keszlet: [],
    csoportkategoria: [],
};

var productsHTML = "";
getdata();

/* INFO: termék adatok bekérése START INFO: */
async function getdata() {
    /* NOTE: get keszlet */
    var response = await fetch("/dataread");
    var products;
    state.keszlet = await response.json();
    console.log(state.keszlet[0].nev);

    /* NOTE: get csoport */
    var response = await fetch("/datareadcsoport");
    var products;
    state.csoportkategoria = await response.json();
    console.log(state.csoportkategoria[0].nev);

    renderProducts();
    /* NOTE: A button click funkciójának figyelése */
    $(document).ready(function () {
        $("button").click(function () {
            console.log(this.id);
            alert(this.id);
            $(this).hide();
        });
    });
}
/* INFO: termék adatok bekérése END INFO: */

/* HACK: termék button-ok felrajzolása STAR HACK: */
function renderProducts() {
    for (const csoport of state.csoportkategoria) {
        console.log(csoport.nev + "**********");

        productsHTML += `<p class="bg-dark text-white mb-0">${csoport.nev}</p>`;

        for (const product of state.keszlet) {
            //console.log(product);
            //productsHTML += `${product.csoport_nev} <br>`;
            //console.log(csoport.nev + "*********" + product.csoport_nev);
            if (csoport.nev == product.csoport_nev) {
                productsHTML += `<button type='button' class='btn btn-danger  m-1' id = ${product.id}>${product.nev}</button>`;
            }
        }
        productsHTML += `<br>`;
    }

    document.getElementById("termek").innerHTML = productsHTML;
}
/* HACK: termék button-ok felrajzolása END HACK: */

/* ####### FRONTEND SEND get REQUEST INFO: START INFO:*/
/* ####### FRONTEND SEND get REQUEST  INFO: */
/* ####### FRONTEND SEND get REQUEST INFO: END INFO:*/
