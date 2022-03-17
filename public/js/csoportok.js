var lastTransaction = -1;
// NOTE: Ez definiálja a bekért //ok ojektum tömbjét 😎
const state = {
    csoportok: [],
};
// NOTE: Ezek kellenek a forgalom //okhoz
var xid = 1;

getdata();

/* INFO: termék //ok bekérése START INFO: */
async function getdata() {
    /* NOTE: get csoportok INFO: INFO: INFO:*/
    var response = await fetch("/datareadcsoport");
    state.csoportok = await response.json();

    rendercsoportok();
    /* NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: */

    $(document).ready(function () {
        $("#newdata").click(function () {
            /* INFO: TODO: try TODO: INFO: */
            try {
                insertMySQL();
                console.log("try OK **********");
            } catch (e) {
                console.log({ name: e.name, message: e.message });
                console.log("catch OK **********");
            }
            console.log("try-catch OK ********** átjutottunk😎😎😎");
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

function rendercsoportok() {
    let index = 0;
    csoportokHTML = "";
    console.log(state.csoportok[0].nev);
    for (let vKimeresnev of state.csoportok) {
        csoportokHTML += `<tr >
        <td>${vKimeresnev.nev}</td>
        </tr>
        
        `;
        index++;
        xid = vKimeresnev.id; /* BUG: */
    }
    document.getElementById("xkimeresdata").innerHTML = csoportokHTML;
}

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
