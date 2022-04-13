const state = {
    forgalom: [],
};

var xid = 1;
var origId = -1;
console.log("mi a tokom van😋");
getdata();

/* INFO: forgalom adatok bekérése START INFO: */
async function getdata() {
    /* NOTE: get forgalom INFO: INFO: INFO:*/
    var response = await fetch("/datareadforgalom");
    state.forgalom = await response.json();

    renderforgalom();

    /* NOTE:NOTE:NOTE:NOTE:NOTE:NOTE:NOTE:NOTE:NOTE:NOTE:NOTE: */
    /* $(document).ready(function () {
        $("#newdata").click(function () {
            try {
                insertMySQL();
            } catch (e) {
                alert("catch vizsgálata!!!");
            }
            async function insertMySQL() {
                const nevInput = document.querySelector("#nev");
                const nev = nevInput.value;
                nevInput.value = "*";
                var id = xid + 1;
                await fetch("/insertcsoportok/", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ nev: nev }),
                });
                csoportokHTML += `<tr >
                <td>${nev}</td>
                </tr>
                `;
                id++;
                xid++;
                document.getElementById("xkimeresdata").innerHTML =
                    csoportokHTML;
            }
        });
    });*/
}

document.addEventListener("keypress", function (e) {
    if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
    }
});

//BUG:BUG:BUG:BUG:BUG:BUG:BUG:
function renderforgalom() {
    console.log("mi a tokom van");
    let index = 0;
    forgalomHTML = "";
    for (let vForgalom of state.forgalom) {
        forgalomHTML += `<tr >
        <td>${vForgalom.id}</td><td>${vForgalom.transaction_id}</td><td>${vForgalom.termekid}</td><td>${vForgalom.db}</td><td>${vForgalom.eladottbeszar}</td><td>${vForgalom.eladottelar}</td><td>${vForgalom.eladottdate}</td><td>${vForgalom.transaction_id}</td>
        <td><button class="updateBtn" id=${vForgalom.xkimeresnevid}>Edit</td>
        </tr>
        `;
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
/* function updatecsoportok() {
    const nev = document.getElementById("newNev").value;
    try {
        updateMySQL();
    } catch (e) {}
    async function updateMySQL() {
        id = origId;

        const response = await fetch("/updatecsoportok/", {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ nev: nev, id: id }),
        });
        console.log(response);
        let arrowIndex = -1;
        for (let i = 0; i < state.csoportok.length; i++) {
            if (state.csoportok[i].id == id) {
                arrowIndex = i;
            }
        }
        state.csoportok[arrowIndex].nev = nev;
        rendercsoportok();
    }
} */
/* TODO:TODO:TODO:TODO:TODO:TODO:TODO: */
