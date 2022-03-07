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
    state.keszlet = await response.json();
    console.log(state.keszlet[0].nev);

    /* NOTE: get csoport */
    var response = await fetch("/datareadcsoport");
    state.csoportkategoria = await response.json();
    console.log(state.csoportkategoria[0].nev);

    renderProducts(); /* HACK: fv() hívás HACK: */
    /* NOTE: A button click funkciójának figyelése */
    $(document).ready(function () {
        let arrayIndex = -1;
        let vElar = -1;
        let vKiszereles = -1;
        let summa = 0;
        $(".btnKeszlet").click(function () {
            alert(this.id);
            arrayIndex = this.id;
            /* NOTE: */
            if (state.keszlet[arrayIndex].kiszereles_id == 2) {
                alert(
                    "ez maan a kiszereles 😎" + state.keszlet[arrayIndex].nev
                );
            }
            /* NOTE: */
            vElar = state.keszlet[arrayIndex].elar;
            document.getElementById("pult").innerHTML +=
                state.keszlet[arrayIndex].nev + " Ea: " + +vElar + "<br>";
            summa += vElar;
            document.getElementById("summa").innerHTML = summa;
        });
    });
}
/* INFO: termék adatok bekérése END INFO: */

/* HACK: termék button-ok felrajzolása STAR HACK: */
function renderProducts() {
    for (const csoport of state.csoportkategoria) {
        console.log(csoport.nev + "**********");

        productsHTML += `<p class="bg-dark text-white mb-0">${csoport.nev}</p>`;
        let vIndex = 0;
        for (const product of state.keszlet) {
            if (csoport.nev == product.csoport_nev) {
                productsHTML += `<button type='button' class='btn btn-danger  m-1 btnKeszlet' id = ${vIndex}>${product.nev}</button>`;
            }
            vIndex++;
        }
        productsHTML += `<br>`;
    }

    document.getElementById("termek").innerHTML = productsHTML;
}
/* HACK: termék button-ok felrajzolása END HACK: */

/* ####### FRONTEND SEND get REQUEST INFO: START INFO:*/
/* ####### FRONTEND SEND get REQUEST  INFO: */

/* ####### BUTTON EVENT INFO: variable INFO:*/
/* NOTE: A button click funkciójának figyelése */
/* $(document).ready(function () {
        let arrayIndex = -1;
        let indexId = -1;
        let tempId = -1;
        $(".btnKeszlet").click(function () {
            alert(this.id);
            $(this).hide();
            arrayIndex = this.id;
            console.log("tempId :");
            console.log(tempId);
            indexId = this.id;
            console.log("this.id :");
            console.log(this.id);
            console.log("indexId :");
            console.log(indexId);
            console.log("state.keszlet tombindex :");
            console.log(arrayIndex);
            console.log(state.keszlet[arrayIndex].nev);
            console.log(state.keszlet[arrayIndex].id);
            //document.getElementById("pult").innerHTML = state.keszlet[0].nev;
            document.getElementById("pult").innerHTML =
                state.keszlet[arrayIndex].nev;
        });
    }); */
