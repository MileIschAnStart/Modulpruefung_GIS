async function mainFollow(): Promise<void> {
    let listElement: HTMLElement = document.getElementById("list");
    listElement.innerHTML = "";
    let username: string = localStorage.getItem("username");
    if (!username) {
        window.location.assign("login.html");
        return;
    }
    let params: URLSearchParams = new URLSearchParams();
    params.append("username", username);
    let request: Response = await fetch(BASEURL + "/getUsers?" + params.toString());
    let response: any = await request.json();
    if (response.success && response.all && response.followed) {
        response.all.forEach((name: string) => {
            let mainDiv: HTMLDivElement = document.createElement("div");
            mainDiv.classList.add("userDiv");
            let li: HTMLLIElement = document.createElement("li");
            let btn: HTMLButtonElement = document.createElement("button");
            li.innerHTML = name;
            if (response.followed.indexOf(name) !== -1) {
                btn.innerHTML = "Unfollow";
                btn.addEventListener("click", () => unfollow(name));
            }
            else{
                btn.innerHTML = "Follow";
                btn.addEventListener("click", () => follow(name));
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

async function follow(user: string): Promise<void> {
    let username: string = localStorage.getItem("username");
    if (!username) {
        window.location.assign("login.html");
        return;
    }
    let params: URLSearchParams = new URLSearchParams();
    params.append("user", username);
    params.append("follows", user);
    let request: Response = await fetch(BASEURL + "/follow?" + params.toString());
    let response: any = await request.json();
    if (response.success) {
        mainFollow();
    }
    else {
        displayStatus(false, "Der User konnte nicht followed werden.");
    }
}

async function unfollow(user: string): Promise <void> {
    let username: string = localStorage.getItem("username");
    if (!username) {
        window.location.assign("login.html");
        return;
    }
    let params: URLSearchParams  = new URLSearchParams();
    params.append("user", username);
    params.append("unfollows", user);
    let request: Response = await fetch(BASEURL + "/unfollow?" + params.toString());
    let response: any = await request.json();
    if (response.success) {
        mainFollow();
    }
    else {
        displayStatus(false, "Der User konnte nicht unfollowed werden.");
    }
}