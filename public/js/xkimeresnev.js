var lastTransaction = -1;
// NOTE: Ez definiálja a bekért //ok ojektum tömbjét 😎
const state = {
    xkimeresnev: [],
};
// NOTE: Ezek kellenek a forgalom //okhoz
var xid = 1;

getdata();

/* INFO: termék //ok bekérése START INFO: */
async function getdata() {
    /* NOTE: get xkimeresnev INFO: INFO: INFO:*/
    var response = await fetch("/datareadxkimeresnev");
    state.xkimeresnev = await response.json();

    renderXkimeresnev();
    /* NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: */

    $(document).ready(function () {
        $("#newdata").click(function () {
            $("#nev").change(function () {
                let nevInput = $("#nev");
                let v = $(this).val();

                let urtartalomInput = document.querySelector("#urtartalom");
                console.log("nevInput.value");
                console.log(v);
                console.log("urtartalomInput.value");
                console.log(urtartalomInput.value);

                if (v !== null) {
                    console.log("************************************");
                }
            });
            insertMySQL();

            async function insertMySQL() {
                const nevInput = document.querySelector("#nev");
                const nev = nevInput.value;
                nevInput.value = "";
                const urtartalomInput = document.querySelector("#urtartalom");
                const urtartalom = urtartalomInput.value;
                var id = xid + 1;
                urtartalomInput.value = 0;
                /* INFO: insertxkimeresnev  INFO: INFO: INFO: INFO: INFO: INFO: INFO:*/
                await fetch("/insertxkimeresnev/", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ nev: nev, urtartalom: urtartalom }),
                });
                /* INFO: insertxkimeresnev  INFO: INFO: INFO: INFO: INFO: INFO: INFO:*/
                xkimeresnevHTML += `<tr >
                <td>${id}</td>
                <td>${nev}</td>
                <td>${urtartalom}</td>
                </tr>
                `;
                id++;
                xid++;
                document.getElementById("xkimeresdata").innerHTML =
                    xkimeresnevHTML;
            }
        });
    });
}

function renderXkimeresnev() {
    let index = 0;
    xkimeresnevHTML = "";
    console.log(state.xkimeresnev[0].nev);
    for (let vKimeresnev of state.xkimeresnev) {
        xkimeresnevHTML += `<tr >
                <td>${vKimeresnev.id}</td>
                <td>${vKimeresnev.nev}</td>
                <td>${vKimeresnev.urtartalom}</td>
                </tr>

     `;
        index++;
        xid = vKimeresnev.id; /* BUG: */
    }
    document.getElementById("xkimeresdata").innerHTML = xkimeresnevHTML;
}
