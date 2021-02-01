const BASEURL: string = "https://modulpruefung.herokuapp.com";
// const BASEURL: string = "http://localhost:8100";

function displayStatus(success: boolean, message: string): void {
    let statusField: HTMLElement = document.getElementById("status");
    if (success) {
        statusField.setAttribute("class", "green-success");
    }
    else {
        statusField.setAttribute("class", "red-error");
    }
    statusField.innerHTML = message;
}