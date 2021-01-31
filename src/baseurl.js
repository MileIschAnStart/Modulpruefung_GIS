"use strict";
const BASEURL = "https://modulpruefung.herokuapp.com";
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