import * as Mongo from "mongodb";
import * as Url from "url";
import * as Http from "http";


let mongo: Mongo.MongoClient;

//Datenbank-Connection
async function DbConnect (url: string): Promise<void> {
    mongo = new Mongo.MongoClient(url);
    await mongo.connect();
}

//zu Db verbinden
DbConnect("mongodb+srv://mile:010408@mike.et3um.mongodb.net/pruefung?retryWrites=true&w=majority");

//in http-Server gehen
export namespace A08Server {
    console.log("Starting server..");

    //port aus Umgebungsvariabeln auslesen
    let port: number = Number(process.env.PORT);
    if (!port)                                  //wenn kein Port in den Umgebungsvariabeln gefunden wird, Port: 8100 nehmen
        port = 8100;


    let server: Http.Server = Http.createServer();  //http-Server wird erstellt
    server.addListener("request", onRequest);       //wenn Anfrage reinkommt, Funktion ausführen
    server.addListener("listening", onListen);      //wenn Server gestartet wird
    server.listen(port);



    function onListen(): void {
        console.log("Listening..");
    }

    async function doRegister(request: URLSearchParams): Promise<string> {      //params auslesen
        let username: string | null = request.get("username");                                   //auf Key zugreifen und Value zurückgegeben
        let password: string | null = request.get("password");
        let fullname: string | null = request.get("fullname");
        let semester: string | null = request.get("semester");
        let studiengang: string | null = request.get("studiengang");

        if (!username || !password || !fullname || !semester || !studiengang) {                     //wenn eines der Felder nicht gefüllt ist, dann wird der String zurückgegeben
            return JSON.stringify({success: false});
        }

        let result: string[] = await mongo.db("pruefung").collection("users").find({username}).toArray();      //Datenbankabfrage 
        if (result.length > 0) {                                                                        // Wenn größer null: Es existiert bereits ein User
            return JSON.stringify({success: false});
        }


        await mongo.db("pruefung").collection("users").insertOne({username, password, fullname, semester, studiengang});  //falls User noch nicht existiert, dann lege einen an
        return JSON.stringify({success: true, username});
    }

    async function doLogin(request: URLSearchParams): Promise<string> { 
        let username: string | null = request.get("username");
        let password: string | null = request.get("password");
        if (!username || !password) {
            return JSON.stringify({success: false});
        }
        let result: User[] = await mongo.db("pruefung").collection("users").find({username: username, password: password}).toArray();
        if (result.length > 0) {                                                    
            return JSON.stringify({success: true, username: result[0].username});
        }
        return JSON.stringify({success: false});  
    }

    async function calculateResponseText(url: string | undefined): Promise<string> {    // URL auslesesen
        let antwortText: string = "Die URL konnte nicht gefunden werden.";
        if (!url) {
            console.log("URL ist leer");
            return antwortText;
        }
        

        let urlNew: Url.URL  = new Url.URL(url, "http://localhost:8100");
        

        if (urlNew.pathname === "/registrierung") {
            antwortText = await doRegister(urlNew.searchParams);
        }
        else if (urlNew.pathname === "/login") {
            antwortText = await doLogin(urlNew.searchParams);
        }
        else if (urlNew.pathname === "/editprofile") {
            antwortText = await editProfile(urlNew.searchParams);
        }
        else if (urlNew.pathname === "/post") {
            antwortText = await post(urlNew.searchParams);
        }
        else if (urlNew.pathname === "/getposts") {
            antwortText = await getposts(urlNew.searchParams);
        }
        else if(urlNew.pathname === "/getprofile"){
            antwortText = await getProfile(urlNew.searchParams);
        }
        else if(urlNew.pathname === "/getUsers"){
            antwortText = await getUsers(urlNew.searchParams);
        }
        else if(urlNew.pathname === "/follow"){
            antwortText = await follow(urlNew.searchParams);
        }
        else if(urlNew.pathname === "/unfollow"){
            antwortText = await unfollow(urlNew.searchParams);
        }


        return antwortText;
    }

    async function follow(params: URLSearchParams){
        let username = params.get("user");
        let follow = params.get("follows");
        if(!username || !follow){
            return JSON.stringify({success: false});
        }
        await mongo.db("pruefung").collection("userfollows").insertOne({user: username, follows: follow});
        return JSON.stringify({success: true});
    }

    async function unfollow(params: URLSearchParams){
        let username = params.get("user");
        let unfollow = params.get("unfollows");
        if(!username || !unfollow){
            return JSON.stringify({success: false});
        }
        await mongo.db("pruefung").collection("userfollows").deleteOne({user: username, follows: unfollow});
        return JSON.stringify({success: true});
    }

    async function getUsers(params: URLSearchParams){
        let username = params.get('username');
        if(!username){
            return JSON.stringify({success: false});
        }
        let allUsers: User[] = await mongo.db("pruefung").collection("users").find({}).toArray();  // [{name: "peter", fullname:""}]
        let allUsersNames: string[] = allUsers.map((entry) => entry.username); // ["peter", "test"]
        let followedUsers: UserFollows[] = await mongo.db("pruefung").collection("userfollows").find({user: username}).toArray();
        let followedUsersNames: string[] = followedUsers.map((entry) => entry.follows); // ["test", "test2"]
        let index = allUsersNames.indexOf(username);
        allUsersNames.splice(index, 1);
        return JSON.stringify({success: true, all: allUsersNames, followed: followedUsersNames});
    }

    async function editProfile(params: URLSearchParams){
        let username: string | null = params.get("username");                                   //auf Key zugreifen und Value zurückgegeben
        let password: string | null = params.get("password");
        let fullname: string | null = params.get("fullname");
        let semester: string | null = params.get("semester");
        let studiengang: string | null = params.get("studiengang");
        let oldUsername: string | null = params.get("oldUsername"); 

        if(!oldUsername){
            return JSON.stringify({success: false});
        }
        let setObj: User = {};
        if(username){
            setObj.username = username;
        }
        if(password){
            setObj.password = password;
        }
        if(fullname){
            setObj.fullname = fullname;
        }
        if(semester){
            setObj.semester = semester;
        }
        if(studiengang){
            setObj.studiengang = studiengang;
        }
        await mongo.db("pruefung").collection("users").updateOne({username: oldUsername}, {$set: setObj});
        return JSON.stringify({success: true, newUser: username});
    }

    async function getProfile(params: URLSearchParams){
        let username = params.get("username");
        if(!username){
            return JSON.stringify({success: false});
        }
        let result: User[] = await mongo.db("pruefung").collection("users").find({username: username}).toArray();
        if(!result || result.length === 0){
            return JSON.stringify({success: false});
        }
        let user = result[0];
        return JSON.stringify({success: true, user: {username: user.username, fullname: user.fullname, semester: user.semester, studiengang: user.studiengang}});
    }

    async function getposts(params: URLSearchParams){
        let username = params.get("username");
        if(!username){
            return JSON.stringify({success: false});
        }
        let followedUsers: UserFollows[] = await mongo.db("pruefung").collection("userfollows").find({user: username}).toArray(); // [{name: "peter" , semester:"etc"}...]
        let usernames: string[] = followedUsers.map((entry: UserFollows) => entry.follows); // ["peter", "test"]
        usernames.push(username);
        let posts = await mongo.db("pruefung").collection("posts").find({fromUser: {$in: usernames}}).sort({date: -1}).toArray();
        return JSON.stringify({success: true, posts});
    }

    async function post(params : URLSearchParams){
        let username = params.get("username");
        let postText = params.get("posttext");
        if(!username || !postText){
            return JSON.stringify({success: false});
        }
        await mongo.db("pruefung").collection("posts").insertOne({fromUser: username, text: postText, date: new Date() });
        return JSON.stringify({success: true});
    }

    async function onRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {
        

        let response: string = await calculateResponseText(_request.url);                   //Antwort empfangen

        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");

        _response.write(response);                                                  //Antwort herausgeben

        _response.end();
    }
}

interface User {
    _id?: any
    username?: string;
    password?: string;
    fullname?: string;
    semester?: string;
    studiengang?: string;
}

//interface Post {
//    _id: any;
//    text: string;
 //   fromUser: string;
 //   date: Date;
//}

interface UserFollows{
    _id: any;
    user: string;
    follows: string;
}