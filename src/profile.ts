let usernameFeld: HTMLInputElement = document.getElementById("username") as HTMLInputElement;
let fullnameFeld: HTMLInputElement = document.getElementById("fullname")as HTMLInputElement;
let semesterFeld: HTMLInputElement = document.getElementById("semester")as HTMLInputElement;
let studiengangFeld: HTMLInputElement = document.getElementById("studiengang")as HTMLInputElement;
let passwordFeld: HTMLInputElement = document.getElementById("password")as HTMLInputElement;
let password_repeatFeld: HTMLInputElement = document.getElementById("password_repeat")as HTMLInputElement;

let saveBtn: HTMLElement = document.getElementById("save-profile");

saveBtn.addEventListener("click", save);

async function save(evt: MouseEvent): Promise<void> {
    evt.preventDefault();
    let username: string = usernameFeld.value;
    let fullname: string = fullnameFeld.value;
    let semester: string = semesterFeld.value;
    let studiengang: string = studiengangFeld.value;
    let password: string = passwordFeld.value;
    let passwordRepeat: string = password_repeatFeld.value;

    let toSend: URLSearchParams = new URLSearchParams();
    toSend.append("oldUsername", localStorage.getItem("username"));
    if (username) {
        toSend.append("username", username);
    }
    if (fullname) {
        toSend.append("fullname", fullname);
    }
    if (semester) {
        toSend.append("semester", semester);
    }
    if (studiengang) {
        toSend.append("studiengang", studiengang);
    }
    if (password === passwordRepeat && password !== "") {
        toSend.append("password", password);
    }
    else {
        displayStatus(false, "Die Passwörter sind nicht identisch.");
    }
    let request: Response = await fetch(BASEURL + "/editprofile?" + toSend.toString());
    let response: any = await request.json();
    if (response.success) {
        localStorage.setItem("username", response.newUser);
        displayStatus(true, "Das Profil wurde erfolgreich gespeichert!");
        mainProfile();
    }
    else {
        displayStatus(false, "Das Profil konnte nicht geändert werden.");
    }
}

async function mainProfile(): Promise<void> {
    let user: string = localStorage.getItem("username");
    if (!user) {
        window.location.assign("login.html");
    }
    else {
        let params: URLSearchParams = new URLSearchParams();
        params.append("username", user);
        let request: Response = await fetch(BASEURL + "/getprofile?" + params.toString());
        let response: any = await request.json();
        if (response.success && response.user) {
            usernameFeld.value = response.user.username;
            fullnameFeld.value = response.user.fullname;
            semesterFeld.value = response.user.semester;
            studiengangFeld.value = response.user.studiengang;
        }
        else {
            window.location.assign("login.html");
        }
    }
}

mainProfile();

interface User {
    _id: any
    username: string;
    password: string;
    fullname: string;
    semester: string;
    studiengang: string;
}