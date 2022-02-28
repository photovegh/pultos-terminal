for (i = 0; i < 10; i++) {
    document.getElementById(
        "termek"
    ).innerHTML += `<button type='button' class='btn btn-danger mt-3 m-1' id=${i}>JavaScript</button>`;
    /* document.getElementById("termek").innerHTML +=
        "<button type='button' class='btn btn-danger mt-3 m-1'>JavaScript</button>"; */
}

document.getElementById("ezaz").addEventListener("click", displayDate);

function displayDate() {
    document.getElementById("demo").innerHTML = Date();
}

$(document).ready(function () {
    $("button").click(function () {
        console.log(this.id);
        //alert(this.id);
        $(this).hide();
    });
});

$(document).ready(function () {
    $("p").click(function () {
        console.log(this.id);
        //alert(this.id);
        $(this).hide();
    });
});

/* ####### FRONTEND SEND get REQUEST INFO: START INFO:*/
console.log("dataread is ok ............");
const state = {
    keszlet: [],
};
var personsHTML = "";
/* ####### FRONTEND SEND get REQUEST  INFO: */
async function getdata() {
    const response = await fetch("/dataread");
    document.getElementById("ucso").innerHTML = "";
    let persons;
    state.keszlet = await response.json();
    console.log(state.keszlet[0].nev);
    renderPersons();
}
function renderPersons() {
    //let personsHTML = "";
    for (const person of state.keszlet) {
        personsHTML += `
    <tr>
    <td>${person.nev}</td>
    <td>${person.beszar}</td>
    
    </tr>
    `;
    }
    document.getElementById("ucso").innerHTML = personsHTML;
    document.getElementById("ucso2").innerHTML = personsHTML;
}
getdata();

/* ####### FRONTEND SEND get REQUEST INFO: END INFO:*/
