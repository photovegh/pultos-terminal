// NOTE: Ez definiálja a bekért adatok ojektum tömbjét 😎
const state = {
    keszlet: [],
};

var personsHTML = "";
getdata();

/* INFO: termék adatok bekérése START INFO: */
async function getdata() {
    const response = await fetch("/dataread");
    let persons;
    state.keszlet = await response.json();
    console.log(state.keszlet[0].nev);
    renderPersons();
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
function renderPersons() {
    for (const person of state.keszlet) {
        personsHTML += `<button type='button' class='btn btn-danger btn-lg mt-3 m-1' id = ${person.id}>${person.nev} ${person.csoportok_id}</button>`;
    }
    document.getElementById("termek").innerHTML = personsHTML;
}
/* HACK: termék button-ok felrajzolása END HACK: */

/* ####### FRONTEND SEND get REQUEST INFO: START INFO:*/
/* ####### FRONTEND SEND get REQUEST  INFO: */
/* ####### FRONTEND SEND get REQUEST INFO: END INFO:*/
