var lastTransaction = -1;
// NOTE: Ez definiálja a bekért //ok ojektum tömbjét 😎
const state = {
    csoportok: [],
};
// NOTE: Ezek kellenek a forgalom //okhoz
var xid = 1;
var origId = -1;

getdata();

/* INFO: termék //ok bekérése START INFO: */
async function getdata() {
    /* NOTE: get csoportok INFO: INFO: INFO:*/
    var response = await fetch("/datareadcsoport");
    state.csoportok = await response.json();
    console.log("state.csoportok");
    console.log(state.csoportok);

    rendercsoportok();
    /* NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: */

    $(document).ready(function () {
        $("#newdata").click(function () {
            /* INFO: TODO: try TODO: INFO: */
            try {
                insertMySQL();
                //console.log("try OK **********");
            } catch (e) {
                //console.log({ name: e.name, message: e.message });
                //console.log("catch OK **********");
            }
            //console.log("try-catch OK ********** átjutottunk😎😎😎");
            alert("try-catch vizsgálata!!!");
            /* INFO: TODO: catch TODO: INFO: */
            async function insertMySQL() {
                const nevInput = document.querySelector("#nev");
                const nev = nevInput.value;
                nevInput.value = "*";
                var id = xid + 1;
                /* INFO: insertcsoportok START  INFO: INFO: INFO: INFO: INFO: INFO: INFO:*/
                await fetch("/insertcsoportok/", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ nev: nev }),
                });
                /* INFO: insertcsoportok END INFO: INFO: INFO: INFO: INFO: INFO: INFO:*/
                csoportokHTML += `<tr >
                <td>${nev}</td>
                </tr>
                `;
                id++;
                xid++;
                document.getElementById("xkimeresdata").innerHTML =
                    csoportokHTML;
            } //INFO: async function END  INFO:
        });
    });
}
/* TODO:TODO:TODO:TODO:TODO:TODO:TODO: */
function updatecsoportok() {
    console.log("Fetch update csoport");
    const nev = document.getElementById("newNev").value;
    console.log(nev);
    try {
        updateMySQL();
    } catch (e) {}
    async function updateMySQL() {
        id = origId;
        console.log("nev - id 😁😁😁");
        console.log(nev);
        console.log(id);
        await fetch("/updatecsoportok/", {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ nev: nev, id: id }),
        });
        let arrowIndex = -1;
        for (let i = 0; i < state.csoportok.length; i++) {
            if (state.csoportok[i].id == id) {
                arrowIndex = i;
            }
        }
        state.csoportok[arrowIndex].nev = nev;
        rendercsoportok();
    }
}
/* TODO:TODO:TODO:TODO:TODO:TODO:TODO: */

document.addEventListener("keypress", function (e) {
    if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
    }
});

//BUG:BUG:BUG:BUG:BUG:BUG:BUG:
function rendercsoportok() {
    let index = 0;
    csoportokHTML = "";
    //console.log(state.csoportok[0].nev);
    for (let vKimeresnev of state.csoportok) {
        csoportokHTML += `<tr >
        <td>${vKimeresnev.nev}</td><td>${vKimeresnev.id}</td>
        <td><button class="updateBtn" id=${vKimeresnev.id}>Edit</td>
        </tr>
        
        `;
        index++;
        xid = vKimeresnev.id; /* BUG: */
        console.log(vKimeresnev.id);
    }
    document.getElementById("xkimeresdata").innerHTML = csoportokHTML;
    $(".updateBtn").click(function () {
        let arrowIndex = -1;
        for (let i = 0; i < state.csoportok.length; i++) {
            if (state.csoportok[i].id == this.id) {
                arrowIndex = i;
            }
        }

        console.log("this.id");
        console.log(this.id);
        console.log(state.csoportok[arrowIndex].nev);
        var origNev = state.csoportok[arrowIndex].nev;
        origId = state.csoportok[arrowIndex].id;
        $("#myModal").modal();
        document.getElementById("newNev").value = origNev;
    });
}
//BUG:BUG:BUG:BUG:BUG:BUG:BUG:
/*  $("#nev").change(function () {
            let nevInput = $("#nev");
            let v = $(this).val();
            console.log("nevInput.value");
            console.log(v);
            if (v !== null) {
                console.log("************************************");
            }
        }); */
/* BUG: BUG: BUG: hibát dob rossz primary kulcs miatt BUG: BUG: BUG: */
