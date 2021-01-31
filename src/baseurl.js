"use strict";
// const BASEURL: string = "https://modulpruefung.herokuapp.com";
const BASEURL = "http://localhost:8100";
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