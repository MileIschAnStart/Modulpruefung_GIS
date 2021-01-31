"use strict";
async function mainFollow() {
    let listElement = document.getElementById('list');
    listElement.innerHTML = "";
    let username = localStorage.getItem('username');
    if (!username) {
        window.location.assign('login.html');
        return;
    }
    let params = new URLSearchParams();
    params.append('username', username);
    let request = await fetch(BASEURL + "/getUsers?" + params.toString());
    let response = await request.json();
    if (response.success && response.all && response.followed) {
        response.all.forEach((name) => {
            let mainDiv = document.createElement('div');
            mainDiv.classList.add("userDiv");
            let li = document.createElement('li');
            let btn = document.createElement('button');
            li.innerHTML = name;
            if (response.followed.indexOf(name) !== -1) {
                btn.innerHTML = "Unfollow";
                btn.addEventListener('click', () => unfollow(name));
            }
            else {
                btn.innerHTML = "Follow";
                btn.addEventListener('click', () => follow(name));
            }
            mainDiv.appendChild(li);
            mainDiv.appendChild(btn);
            listElement.appendChild(mainDiv);
        });
    }
    else {
        displayStatus(false, "Die Liste konnte nicht geladen werden");
    }
}
mainFollow();
async function follow(user) {
    let username = localStorage.getItem('username');
    if (!username) {
        window.location.assign('login.html');
        return;
    }
    let params = new URLSearchParams();
    params.append("user", username);
    params.append("follows", user);
    let request = await fetch(BASEURL + "/follow?" + params.toString());
    let response = await request.json();
    if (response.success) {
        mainFollow();
    }
    else {
        displayStatus(false, "Der User konnte nicht followed werden.");
    }
}
async function unfollow(user) {
    let username = localStorage.getItem('username');
    if (!username) {
        window.location.assign('login.html');
        return;
    }
    let params = new URLSearchParams();
    params.append("user", username);
    params.append("unfollows", user);
    let request = await fetch(BASEURL + "/unfollow?" + params.toString());
    let response = await request.json();
    if (response.success) {
        mainFollow();
    }
    else {
        displayStatus(false, "Der User konnte nicht unfollowed werden.");
    }
}
//# sourceMappingURL=follows.js.map