//Elemente auslesen
let submitLoginButton: HTMLElement = document.getElementById('login-btn');
let submitRegisterButton: HTMLElement = document.getElementById('register-btn');

//login
let loginUserNameField: HTMLInputElement = document.getElementById('username')as HTMLInputElement;
let passwordField: HTMLInputElement = document.getElementById('password')as HTMLInputElement;

//register
let registerUsernameField: HTMLInputElement = document.getElementById('register-username')as HTMLInputElement;
let registerPasswordField: HTMLInputElement = document.getElementById('register-password')as HTMLInputElement;
let registerPwRepeatField: HTMLInputElement = document.getElementById('password-repeat')as HTMLInputElement;
let registerFullnameField: HTMLInputElement = document.getElementById('fullname')as HTMLInputElement;
let registerSemesterField: HTMLInputElement = document.getElementById('semester')as HTMLInputElement;
let registerStudiengangField: HTMLInputElement = document.getElementById('studiengang')as HTMLInputElement;

submitLoginButton.addEventListener('click', submitLogin);
submitRegisterButton.addEventListener('click', submitRegister);

async function submitRegister(evt: MouseEvent){
    evt.preventDefault();
    let username = registerUsernameField.value;
    let password = registerPasswordField.value;
    let passwordRepeat = registerPwRepeatField.value;
    let fullname = registerFullnameField.value;
    let semester = registerSemesterField.value;
    let studiengang = registerStudiengangField.value;
    if(!username || !password || !passwordRepeat || !fullname || !semester || !studiengang){
        displayStatus(false, "Es wurden nicht alle Pflichtfelder ausgefüllt.");
        return;
    }

    if(password !== passwordRepeat){
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
    if(response.success){
        localStorage.setItem('username', response.username);
        window.location.assign('main.html');
    }
    else{
        displayStatus(false, "Du konntest dich nicht registrieren.");
    }
}

async function submitLogin(evt: MouseEvent){
    evt.preventDefault();
    let username = loginUserNameField.value;
    let password = passwordField.value;

    if(!username || !password){
        displayStatus(false, "Es wurden nicht alle Pflichtfelder ausgefüllt");
        return;
    }

    let params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    let request = await fetch(BASEURL + "/login?" + params.toString());
    let response = await request.json();
    if(response.success){
        localStorage.setItem('username', response.username);
        window.location.assign('main.html');
    }
    else{
        displayStatus(false, "Benutzername/Passwort-Kombination ist falsch.");
    }
}