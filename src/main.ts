let loggedIn = localStorage.getItem("username");

let logoutBtn = document.getElementById("logout");
let postsElem = document.getElementById("posts");
let postBtn = document.getElementById("post");
let postInput: HTMLInputElement = document.getElementById("post-text") as HTMLInputElement;
let profileBtn: HTMLButtonElement = document.getElementById("profile") as HTMLButtonElement;

profileBtn.addEventListener('click', profile);
logoutBtn.addEventListener('click', logout);
postBtn.addEventListener('click', post);

function profile(evt: MouseEvent){
    evt.preventDefault();
    window.location.assign('profile.html');
}

async function main(){
    postsElem.innerHTML = "";
    if(!loggedIn){
        let hrefElem = document.createElement('a');
        hrefElem.setAttribute("href", "login.html");
        hrefElem.innerHTML = "Um die Posts zu sehen, loggen Sie sich bitte ein.";
        postsElem.appendChild(hrefElem);
    }
    else{


        let params = new URLSearchParams();
        params.append("username", loggedIn);
        let request = await fetch(BASEURL + "/getposts?" + params.toString());
        let response = await request.json();
        if(response.success){
            response.posts.forEach((post: Post) =>{
                let elem = document.createElement("div");
                elem.classList.add("spacePost");
                elem.innerHTML = `von: ${post.fromUser}, um ${new Date(post.date).toLocaleString()}, Nachricht: ${post.text}`;
                postsElem.appendChild(elem);
            });
        }
        else{
            displayStatus(false, "Es konnten keine Beiträge geladen werden");
        }
    }
}
main();

function logout(){
    localStorage.clear();
    window.location.reload();
}

async function post(){
    if(!loggedIn){
        displayStatus(false, "Du bist nicht eingeloggt.");
        return;
    }

    let postText = postInput.value;
    if(!postText){
        displayStatus(false, "Der Posttext ist leer.");
        return;
    }
    let params = new URLSearchParams();
    params.append("posttext", postText);
    params.append("username", loggedIn);

    let request = await fetch(BASEURL + "/post?" + params.toString());
    let response = await request.json();
    if(response.success){
        main();
    }
    else{
        displayStatus(false, "Du konntest diesen Beitrag leider nicht posten.");
    }
}

interface Post {
    text: string;
     fromUser: string;
      date: Date;
}


