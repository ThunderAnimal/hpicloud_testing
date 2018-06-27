window.clientURL = 'http://localhost:3000';

const dummyFile = createDummyFile();

document.addEventListener("DOMContentLoaded", function () {
    init();

    showKeys("", "");

    document.getElementById("btnLogin").addEventListener("click", login);
    document.getElementById("btnLogout").addEventListener("click", logout);
    document.getElementById("btnLoadData").addEventListener("click", loadData);
    document.getElementById("btnUploadData").addEventListener("click", uploadData);
});

function httpGetAsync(theUrl, callback)
{
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4)
            callback(JSON.parse(xmlHttp.response));
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function httpPostAsync(theUrl,data, callback)
{
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4)
            callback(xmlHttp.status);
    };
    xmlHttp.open("POST", theUrl, true); // true for asynchronous
    xmlHttp.send(JSON.stringify(data));
}

function init() {
    httpGetAsync('auth/token', (data) =>{
        if(data.Token){
            GC.SDK.setup('tmcc-aid-local', data.PrivateKey, () => {
                return new Promise(function (resolve) {
                    resolve(data.Token);
                })
            }).then(() =>{
                drawLoginState();
            });
        } else {
            drawLoginState();
        }
    });
}

function login() {
    GC.SDK.createCAP().then((keys) => {
        showKeys(keys.publicKey, keys.privateKey);
        httpPostAsync('auth/keys', {
            public_key: keys.publicKey,
            private_key: keys.privateKey
        }, () => {});

        window.location.href = clientURL + '/auth/gc?public_key=' + keys.publicKey;
    });
}

function logout() {
    window.location.href = '/logout';
}



function loginOverAuthSdk() {
    /* LOGIN over HPI Auth */

    GC.AUTH.config({
        clientId: window.clientId,
        clientURL: window.clientURL,
    });
    // TODO Implement OAuth Client, kein Plan wie die API da funktionert.... habe ich etwas falsch konfiguriert?
    // fehlenden Routes , /login, /gctoken, /gckeys
    GC.AUTH.loggedIn.then((isLoggedIn) => {
        if (!isLoggedIn) {
            GC.AUTH.login();
        }
    });
}

function loadData() {
    const userId = GC.SDK.getCurrentUserId();

    console.log("LOAD DATA");
    console.log("==========");

    GC.SDK.getDocuments(userId, {}).then((data) => {
        console.log(data);
    })
}

function uploadData() {
    const userId = GC.SDK.getCurrentUserId();

    console.log("UPLAOD DATA");
    console.log("==========");

    console.log(dummyFile instanceof File);

    const files = [dummyFile];

    //TODO ist die Struktur so korrek, in der DOUK gibt es unterschiedliche Angaben
    const document = new GC.SDK.models.HCDocument({
        files,
        title: "SA Test",
        author: new GC.SDK.models.HCAuthor({firstName: "Max", lastName: "Mustermann"}),
        type: "application/json",
        creationDate: new Date(),
        annotations: ["Situationsanalyse"] //fuer spätere Filterung
    });

    console.log("Document: ", document);
    GC.SDK.uploadDocument(userId, document)
        .then((response) => console.log("Result Document: ", response));


}

function createDummyFile() {
    const data = {SA_Text: "Hello World", PHQ_9: 5};
    const json = JSON.stringify(data);
    const blob = new Blob([json], {type: "application/json"});
    const file = new File([blob], "SA.json", {type: "text/json;charset=utf-8", lastModified: Date.now()});
    const url = URL.createObjectURL(blob);

    let a = document.createElement('a');
    a.download = "SA.json";
    a.href = url;
    a.textContent = "Download SA.json";

    document.getElementById("dummyFile").appendChild(a);

    return file;
}


function showKeys(publicKey, privateKey) {
    document.getElementById("publicKey").textContent = publicKey;
    document.getElementById("privateKey").textContent = privateKey;
}

function drawLoginState(){
    const userId = GC.SDK.getCurrentUserId();
    if(userId){
        document.getElementById("login").style.display = 'none';
        document.getElementById("logout").style.display = 'block';
        document.getElementById("userId").textContent = userId;

    } else {
        document.getElementById("login").style.display = 'block';
        document.getElementById("logout").style.display = 'none';
    }
}
