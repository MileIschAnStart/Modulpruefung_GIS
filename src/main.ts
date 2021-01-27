let loggedIn = localStorage.getItem("username");

let logoutBtn = document.getElementById("logout");
let postsElem = document.getElementById("posts");
let postBtn = document.getElementById("post");
let postInput: HTMLInputElement = document.getElementById("post-text") as HTMLInputElement;

logoutBtn.addEventListener('click', logout);
postBtn.addEventListener('click', post);

async function main(){
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
                elem.innerHTML = `von: ${post.fromUser}, um ${new Date(post.date).toLocaleString()}, Nachricht: ${post.text}`;
                postsElem.appendChild(elem);
            });
        }
        else{
            console.log("failed");
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
        console.log("not logged in");
        return;
    }

    let postText = postInput.value;
    if(!postText){
        console.log("no post text there")
        return;
    }
    let params = new URLSearchParams();
    params.append("posttext", postText);
    params.append("username", loggedIn);

    let request = await fetch(BASEURL + "/post?" + params.toString());
    let response = await request.json();
    if(response.success){
        window.location.reload();
    }
    else{
        //TODO: error zeigen
        console.log(response);
    }
}

interface Post {
    text: string;
     fromUser: string;
      date: Date;
}


