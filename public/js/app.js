const users = [];
const passwords = [];

const state = {
    pultosokPSW: [],
};

getdata();

async function getdata() {
    /* NOTE: get admin INFO: INFO: INFO:*/
    var response = await fetch("/pultosokadminpsw");
    state.pultosokPSW = await response.json();
    for (let pultosPSW of state.pultosokPSW) {
        users.push(pultosPSW.name);
        passwords.push(pultosPSW.pin);
    }
}

$(document).ready(function () {
    const input_value = $("#password");

    //disable input from typing

    $("#password").keypress(function () {
        return false;
    });

    //add password
    $(".calc").click(function () {
        let value = $(this).val();
        field(value);
    });
    function field(value) {
        input_value.val(input_value.val() + value);
    }
    $("#clear").click(function () {
        input_value.val("");
    });

    /* INFO: ENTER */
    $("#enter").click(function () {
        const psw = input_value.val();
        /* NOTE:localStorage */
        localStorage.setItem("password", psw);
        console.log("localStroage data: " + localStorage.getItem("password"));
        /* NOTE: */
        console.log("memory data: " + psw);

        /* INFO: na akkor vizsgáljuk meg a belépőt */
        //console.log("ez most az admin");

        for (let i = 0; i < 4; i++) {
            if (passwords[i] == psw) {
                console.log(users[i]);
                /*                 alert(
                    "KI akar belepni?" +
                        users[i] +
                        " akinek a jelszava : " +
                        passwords[i] +
                        "es belepo paswordja : " +
                        psw
                ); */
                /* INFO: ha OK */
                localStorage.setItem("user", users[i]);
                $("#pswForm").attr("action", "/pult");
            }
        }
    });
});

/* INFO: FIXME: FIXME: FIXME:NA VÉÉÉÉÉÉGRE 😋😋😋😎 */
/* console.log("ide majd a jsont akarom ...");
        alert("A titkos jelszavad: " + input_value.val() + " added"); */
