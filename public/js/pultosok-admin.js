/* INFO: termék adatok bekérése START INFO: */

const state = {
    pultosokPSW: [],
};
var pultosokHTML = "";

getdata();

async function getdata() {
    /* NOTE: get admin INFO: INFO: INFO:*/
    var response = await fetch("/pultosokadminpsw");
    state.pultosokPSW = await response.json();
    var index = 0;
    for (let pultosPSW of state.pultosokPSW) {
        if (index < 4) {
            pultosokHTML += `<div class="card bg-success text-white m-2 p-3" style="width:700px" id=${index}>
            <form>
            <label>Pultos neve :</label>
            <input type="text" value= "${pultosPSW.name}" id=newName${index} >
            <label>PIN kódja :</label>
            <input type="text" value= "${pultosPSW.pin}" id=newPin${index}>
            </form>
            </div>`;
        } else {
            pultosokHTML += `<div class="card bg-danger text-white ml-2 mt-4 p-3" style="width:700px" id=${index}>
            <form>
            <label>Adminisztrátor neve :</label>
            <input type="text" value=  "${pultosPSW.name}" id=newName${index}>
            <label>JELSZAVA :</label>
            <input type="text" value= "${pultosPSW.pin}" id=newPin${index}>
            </form>
            </div>`;
        }

        index++;
    }

    pultosokHTML += `<button type="button" class="btn btn-primary btn-block ml-2 mt-4 p-3 " style="width:700px" onclick="pultosokAdminTarol()">Tárolom</button>`;
    document.getElementById("pultosokList").innerHTML = pultosokHTML;
}
function pultosokAdminTarol() {
    var data = [];
    var newPinData = "";
    var newPinName = "";
    for (let index = 0; index < 5; index++) {
        newPinData = document.getElementById("newPin" + index).value;
        newPinName = document.getElementById("newName" + index).value;
        data.push({ pin: newPinData, name: newPinName });
    }
    updatePultosokFe();

    async function updatePultosokFe() {
        await fetch("/updatepultosok", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ data: data }),
        });
    }
    //alert("Tesztelés alatt!!! 😊");
    //window.location.href = "http://localhost:7766";
    //window.location.href = "http://photovegh.synology.me:7766/";
}
