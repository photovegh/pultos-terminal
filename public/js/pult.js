getdata();
/* for (i = 0; i < 10; i++) {
    document.getElementById(
        "termek"
    ).innerHTML += `<button type='button' class='btn btn-danger mt-3 m-1' id=${i}>hmmmm</button>`;
} */
/* INFO: termék button-ok felrajzolása STAR INFO: */
function renderPersons() {
    //let personsHTML = "";
    for (const person of state.keszlet) {
        personsHTML += `<button type='button' class='btn btn-danger mt-3 m-1' id = ${person.id}>${person.nev} ${person.id}</button>`;
    }
    /* for (const person of state.keszlet) {
        personsHTML += `
        <tr>
        <td>${person.nev}</td>
        </tr>
        `;
    } */
    document.getElementById("termek").innerHTML = personsHTML;
    //document.getElementById("ucso2").innerHTML = personsHTML;
}
/* INFO: termék button-ok felrajzolása END INFO: */

/* INFO: termék adatok bekáráse START INFO: */
async function getdata() {
    const response = await fetch("/dataread");
    //document.getElementById("ucso").innerHTML = "";
    let persons;
    state.keszlet = await response.json();
    console.log(state.keszlet[0].nev);
    renderPersons();

    $(document).ready(function () {
        $("button").click(function () {
            console.log(this.id);
            alert(this.id);
            $(this).hide();
        });
    });
}
/* INFO: termék adatok bekáráse END INFO: */

//document.getElementById("ezaz").addEventListener("click", displayDate);

function displayDate() {
    document.getElementById("demo").innerHTML = Date();
}

/* INFO: $(document).ready(function () {
    $("button").click(function () {
        console.log(this.id);
        alert(this.id);
        $(this).hide();
    });
}); */

/* $(document).ready(function () {
    $("p").click(function () {
        console.log(this.id);
        //alert(this.id);
        $(this).hide();
    });
}); */

/* ####### FRONTEND SEND get REQUEST INFO: START INFO:*/
console.log("dataread is ok ............");
const state = {
    keszlet: [],
};
var personsHTML = "";
/* ####### FRONTEND SEND get REQUEST  INFO: */

/* ####### FRONTEND SEND get REQUEST INFO: END INFO:*/
