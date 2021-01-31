"use strict";
const BASEURL = "https://modulpruefung.herokuapp.com";
// const BASEURL: string = "http://localhost:8100";
function displayStatus(success, message) {
    let statusField = document.getElementById('status');
    if (success) {
        statusField.setAttribute('class', 'green-success');
    }
    else {
        statusField.setAttribute('class', 'red-error');
    }
    statusField.innerHTML = message;
}
//# sourceMappingURL=baseurl.js.map