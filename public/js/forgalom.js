const state = {
    forgalom: [],
};

var xid = 1;
var origId = -1;
var startFilterDate = "";
var endFilterDate = "2099. 12. 31.";
getdata();

/* INFO: forgalom adatok bekérése START INFO: */
async function getdata() {
    /* NOTE: get forgalom INFO: INFO: INFO:*/
    var response = await fetch("/datareadforgalom");
    state.forgalom = await response.json();

    renderforgalom();
}

document.addEventListener("keypress", function (e) {
    if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
    }
});

//BUG:BUG:BUG:BUG:BUG:BUG:BUG:
function renderforgalom() {
    let index = 0;
    forgalomHTML = "";
    for (let vForgalom of state.forgalom) {
        if (
            vForgalom.eladottdate >= startFilterDate &&
            vForgalom.eladottdate <= endFilterDate
        ) {
            forgalomHTML += `<tr >
        <td>${vForgalom.id}</td><td>${vForgalom.transaction_id}</td><td>${vForgalom.termekid}</td><td>${vForgalom.db}</td><td>${vForgalom.eladottbeszar}</td><td>${vForgalom.eladottelar}</td><td>${vForgalom.eladottdate}</td><td>${vForgalom.transaction_id}</td>
        <td><button class="updateBtn" id=${vForgalom.xkimeresnevid}>Edit</td>
        </tr>
        `;
        }

        index++;
        xid = vForgalom.id;
    }
    document.getElementById("forgalomdata").innerHTML = forgalomHTML;

    $(".updateBtn").click(function () {
        /* let arrowIndex = -1;
        for (let i = 0; i < state.forgalom.length; i++) {
            if (state.forgalom[i].id == this.id) {
                arrowIndex = i;
            }
        }
        var origNev = state.forgalom[arrowIndex].nev;
        origId = state.forgalom[arrowIndex].id;
        $("#myModal").modal();
        document.getElementById("newNev").value = origNev; */
    });
}

/* TODO:TODO:TODO:TODO:TODO:TODO:TODO: */
function datepicker() {
    let dateCode = "s";
    const startDate = document.getElementById("forgalomStartDate").value;
    startFilterDate = dateConvertPickerToSQL(startDate, dateCode);
    const endDate = document.getElementById("forgalomEndDate").value;
    if (endDate !== "") {
        dateCode = "e";
        endFilterDate = dateConvertPickerToSQL(endDate, dateCode);
    }
    renderforgalom();
}
function dateConvertPickerToSQL(convertDatePicker, dateCode) {
    let convertDateSQL = "";
    let tempDateArray = convertDatePicker.split("-");
    if (tempDateArray.length > 1 && dateCode == "s") {
        convertDateSQL = `${tempDateArray[0]}. ${tempDateArray[1]}. ${tempDateArray[2]}. `;
    }
    if (tempDateArray.length > 1 && dateCode == "e") {
        convertDateSQL = `${tempDateArray[0]}. ${tempDateArray[1]}. ${(
            parseInt(tempDateArray[2]) + 1
        ).toString()}. `;
    }
    return convertDateSQL;
}
