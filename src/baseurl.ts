const BASEURL: string = "https://modulpruefung.herokuapp.com";

function displayStatus(success: boolean, message: string){
    let statusField = document.getElementById('status');
    if(success){
        statusField.setAttribute('class', 'green-success');
    }
    else{
        statusField.setAttribute('class', 'red-error');
    }
    statusField.innerHTML = message;
}