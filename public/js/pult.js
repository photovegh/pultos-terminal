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

console.log(
    "localStroage data:::::::::::: " + localStorage.getItem("password")
);
console.log("localStroage USER:::::::::::: " + localStorage.getItem("user"));

//
//
//
//
//
$(document).ready(function () {
    $("p").click(function () {
        console.log(this.id);
        //alert(this.id);
        $(this).hide();
    });
});

/* console.log("pult console is OK !!!!!!!!!!!");
console.log(
    "localStroage data:::::::::::: " + localStorage.getItem("password")
);

console.log("***********😊******************");
document.cookie = "name = sususoft; expires= Mon, 28 Feb 2022 12:00:00 UTC";
document.cookie =
    "name3 = developer PIN; expires= 22 02 2022 12:00:00 UTC; path=/";
document.cookie =
    "name2 = developer PIN; expires=" + new Date(9999, 02, 28).toUTCString;
document.cookie = "rname=John Doe; expires=Thu, 18 Dec 2023 12:00:00 UTC";

console.log(document.cookie);
 */
