const BASEURL: string = "http://localhost:8100";

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