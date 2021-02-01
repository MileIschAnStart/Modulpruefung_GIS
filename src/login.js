"use strict";
//Elemente auslesen
let submitLoginButton = document.getElementById("login-btn");
let submitRegisterButton = document.getElementById("register-btn");
//login
let loginUserNameField = document.getElementById("username");
let passwordField = document.getElementById("password");
//register
let registerUsernameField = document.getElementById("register-username");
let registerPasswordField = document.getElementById("register-password");
let registerPwRepeatField = document.getElementById("password-repeat");
let registerFullnameField = document.getElementById("fullname");
let registerSemesterField = document.getElementById("semester");
let registerStudiengangField = document.getElementById("studiengang");
submitLoginButton.addEventListener("click", submitLogin);
submitRegisterButton.addEventListener("click", submitRegister);
async function submitRegister(evt) {
    evt.preventDefault();
    let username = registerUsernameField.value;
    let password = registerPasswordField.value;
    let passwordRepeat = registerPwRepeatField.value;
    let fullname = registerFullnameField.value;
    let semester = registerSemesterField.value;
    let studiengang = registerStudiengangField.value;
    if (!username || !password || !passwordRepeat || !fullname || !semester || !studiengang) {
        displayStatus(false, "Es wurden nicht alle Pflichtfelder ausgefüllt.");
        return;
    }
    if (password !== passwordRepeat) {
        displayStatus(false, "Passwörter sind nicht identisch.");
        return;
    }
    let params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    params.append("fullname", fullname);
    params.append("semester", semester);
    params.append("studiengang", studiengang);
    let request = await fetch(BASEURL + "/registrierung?" + params.toString());
    let response = await request.json();
    if (response.success) {
        localStorage.setItem("username", response.username);
        window.location.assign("main.html");
    }
    else {
        displayStatus(false, "Du konntest dich nicht registrieren.");
    }
}
async function submitLogin(evt) {
    evt.preventDefault();
    let username = loginUserNameField.value;
    let password = passwordField.value;
    if (!username || !password) {
        displayStatus(false, "Es wurden nicht alle Pflichtfelder ausgefüllt");
        return;
    }
    let params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    let request = await fetch(BASEURL + "/login?" + params.toString());
    let response = await request.json();
    if (response.success) {
        localStorage.setItem("username", response.username);
        window.location.assign("main.html");
    }
    else {
        displayStatus(false, "Benutzername/Passwort-Kombination ist falsch.");
    }
}
//# sourceMappingURL=login.js.map