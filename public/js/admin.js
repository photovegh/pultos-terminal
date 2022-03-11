/* NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: */

/* HACK: fv() hívás HACK: */
//renderProducts();
/* NOTE: A button click funkciójának figyelése */
/*   $(document).ready(function () {
        let arrayIndex = -1;
        let arrayIndextoggle = -1;
        let vElar = -1;
        let vNev;
        localStorage.setItem("vElar", vElar);
        let summa = 0;
        let xxx = "";

        $(".btnKeszlet, .dropdown-item, .dropdown-toggle").click(function (e) {
            if (e.target.nodeName == "BUTTON") {
                arrayIndex = this.id;
            }
            
            let xButtonOrP = "";
            console.log("click 😊");
            console.log("arrayIndex");
            console.log(arrayIndex);
            console.log("arrayIndextoggle");
            console.log(arrayIndextoggle);
            xButtonOrP = e.target.nodeName;
            console.log(xButtonOrP);

            if (state.keszlet[arrayIndex].kiszereles_id == 2) {
                if (e.target.nodeName == "P") {
                    arrayIndextoggle = this.id;

                    vNev = state.keszlet[arrayIndex].nev;
                    vElar =
                        (state.keszlet[arrayIndex].elar /
                            state.keszlet[arrayIndex].cl) *
                        state.xkimeresnev[arrayIndextoggle].urtartalom;

                    arrayPultNev.push(state.keszlet[arrayIndex].nev);
                    arrayPultElar.push(vElar);
                }
               
                console.log("vNev");
                console.log(vNev);
                console.log("vElar");
                console.log(vElar);
              
            } else {
             
                arrayPultNev.push(state.keszlet[arrayIndex].nev);
                arrayPultElar.push(state.keszlet[arrayIndex].elar);
                vElar = state.keszlet[arrayIndex].elar;
               
                vNev = state.keszlet[arrayIndex].nev;
                vElar = state.keszlet[arrayIndex].elar;
            }
        });
    }); */

/* INFO: termék //ok bekérése END INFO: */
