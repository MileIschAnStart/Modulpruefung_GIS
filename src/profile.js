"use strict";
let usernameFeld = document.getElementById('username');
let fullnameFeld = document.getElementById('fullname');
let semesterFeld = document.getElementById('semester');
let studiengangFeld = document.getElementById('studiengang');
let passwordFeld = document.getElementById('password');
let password_repeatFeld = document.getElementById('password_repeat');
let saveBtn = document.getElementById('save-profile');
saveBtn.addEventListener('click', save);
async function save(evt) {
    evt.preventDefault();
    let username = usernameFeld.value;
    let fullname = fullnameFeld.value;
    let semester = semesterFeld.value;
    let studiengang = studiengangFeld.value;
    let password = passwordFeld.value;
    let passwordRepeat = password_repeatFeld.value;
    let toSend = new URLSearchParams();
    toSend.append('oldUsername', localStorage.getItem('username'));
    if (username) {
        toSend.append('username', username);
    }
    if (fullname) {
        toSend.append('fullname', fullname);
    }
    if (semester) {
        toSend.append('semester', semester);
    }
    if (studiengang) {
        toSend.append('studiengang', studiengang);
    }
    if (password === passwordRepeat && password !== '') {
        toSend.append('password', password);
    }
    else {
        displayStatus(false, "Die Passwörter sind nicht identisch.");
    }
    let request = await fetch(BASEURL + "/editprofile?" + toSend.toString());
    let response = await request.json();
    if (response.success) {
        localStorage.setItem('username', response.newUser);
        displayStatus(true, "Das Profil wurde erfolgreich gespeichert!");
        main();
    }
    else {
        displayStatus(false, "Das Profil konnte nicht geändert werden.");
    }
}
async function main() {
    let user = localStorage.getItem('username');
    if (!user) {
        window.location.assign('login.html');
    }
    else {
        let params = new URLSearchParams();
        params.append('username', user);
        let request = await fetch(BASEURL + "/getprofile?" + params.toString());
        let response = await request.json();
        if (response.success && response.user) {
            usernameFeld.value = response.user.username;
            fullnameFeld.value = response.user.fullname;
            semesterFeld.value = response.user.semester;
            studiengangFeld.value = response.user.studiengang;
        }
        else {
            window.location.assign('login.html');
        }
    }
}
main();
//# sourceMappingURL=profile.js.map