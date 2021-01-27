"use strict";
//Elemente auslesen
let submitLoginButton = document.getElementById('login-btn');
let submitRegisterButton = document.getElementById('register-btn');
//login
let loginUserNameField = document.getElementById('username');
let passwordField = document.getElementById('password');
//register
let registerUsernameField = document.getElementById('register-username');
let registerPasswordField = document.getElementById('register-password');
let registerPwRepeatField = document.getElementById('password-repeat');
let registerFullnameField = document.getElementById('fullname');
let registerSemesterField = document.getElementById('semester');
let registerStudiengangField = document.getElementById('studiengang');
submitLoginButton.addEventListener('click', submitLogin);
submitRegisterButton.addEventListener('click', submitRegister);
async function submitRegister(evt) {
    evt.preventDefault();
    console.log("register");
    let username = registerUsernameField.value;
    let password = registerPasswordField.value;
    let passwordRepeat = registerPwRepeatField.value;
    let fullname = registerFullnameField.value;
    let semester = registerSemesterField.value;
    let studiengang = registerStudiengangField.value;
    if (!username || !password || !passwordRepeat || !fullname || !semester || !studiengang) {
        console.log("error: Pflichtfelder");
        return;
    }
    if (password !== passwordRepeat) {
        console.log("error: Passwörter nicht identisch");
        return;
    }
    let params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    params.append("fullname", password);
    params.append("semester", password);
    params.append("studiengang", password);
    let request = await fetch(BASEURL + "/registrierung?" + params.toString());
    let response = await request.json();
    if (response.success) {
        localStorage.setItem('username', response.username);
        window.location.assign('main.html');
    }
    else {
        //TODO: error zeigen
        console.log(response);
    }
}
async function submitLogin(evt) {
    evt.preventDefault();
    console.log("login");
    let username = loginUserNameField.value;
    let password = passwordField.value;
    if (!username || !password) {
        console.log("error: Pflichtfelder");
        return;
    }
    let params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    let request = await fetch(BASEURL + "/login?" + params.toString());
    let response = await request.json();
    if (response.success) {
        localStorage.setItem('username', response.username);
        window.location.assign('main.html');
    }
    else {
        //TODO: error zeigen
        console.log(response);
    }
}
//# sourceMappingURL=login.js.map