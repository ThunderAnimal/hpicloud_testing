window.clientURL = 'http://localhost:3000/auth';
window.clientId = 'tmcc-aid-local';

window.userIdScience = '60ab5be4-ec26-4ee5-ba54-f261b6659134'; //ma.weber@student.htw-berlin.de
window.appIdScience = 'd6d5747e-c59e-4435-b7bd-b4c30b824d10';
window.userTherapeuth = '85fc9899-35ef-4e64-b040-4b8171058506'; //martinweber.9393@gmx.de

window.loadedData = undefined; //for test array size after load

const dummyFile = createDummyFile();

document.addEventListener("DOMContentLoaded", function () {
    init();

    showKeys("", "");

    document.getElementById("btnLogin").addEventListener("click", login);
    document.getElementById("btnLogout").addEventListener("click", logout);
    document.getElementById("btnLoadData").addEventListener("click", loadData);
    document.getElementById("btnUploadData").addEventListener("click", uploadData);
    document.getElementById("btnGrantPersmission").addEventListener("click", grantPermissionScience);

});

function httpGetAsync(theUrl, callback) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4)
            callback(xmlHttp.response);
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function httpPostAsync(theUrl, data, callback) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4)
            callback(xmlHttp.status);
    };
    xmlHttp.open("POST", theUrl, true); // true for asynchronous
    xmlHttp.send(JSON.stringify(data));
}

function init() {
    GC.AUTH.config({
        clientId: window.clientId,
        clientURL: window.clientURL,
    });

    GC.AUTH.loggedIn.then((isLoggedIn) => {
        drawLoginState();
    });

    // httpGetAsync('auth/token', (data) =>{
    //     if(data.Token){
    //         GC.SDK.setup(clientId, data.PrivateKey, () => {
    //             return new Promise(function (resolve) {
    //                 resolve(data.Token);
    //             })
    //         }).then(() =>{
    //             drawLoginState();
    //         });
    //     } else {
    //         drawLoginState();
    //     }
    // });
}

function login() {
    // GC.SDK.createCAP().then((keys) => {
    //     showKeys(keys.publicKey, keys.privateKey);
    //     httpPostAsync('auth/keys', {
    //         public_key: keys.publicKey,
    //         private_key: keys.privateKey
    //     }, () => {});
    //
    //     window.location.href = clientURL + '/gclogin?public_key=' + keys.publicKey;
    // });

    GC.AUTH.login();
}

function logout() {
    GC.SDK.reset();
    httpGetAsync('/auth/logout', () => {
        init();
    });
}


function loadData() {
    const userId = GC.SDK.getCurrentUserId();

    console.log("LOAD DATA");
    console.log("==========");

    const timeStart = Date.now();
    GC.SDK.getDocuments(userId, {}).then((data) => {
        console.log("Finished Load Documents:", (Date.now() - timeStart) + " ms");
        console.log(data);
        window.loadedData = data;
        renderData(data.records)
    })
}

function renderData(data) {
    const temp = document.getElementById('tempListData');
    const ul = document.getElementById('listData');

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    for (let i = 0; i < data.length; i++) {
        const clonedTemplate = temp.content.cloneNode(true);
        clonedTemplate.querySelector('li').setAttribute('data-id', data[i].id);
        clonedTemplate.querySelector('.title').innerText = data[i].title;
        clonedTemplate.querySelector('.text').innerText = data[i].creationDate;
        clonedTemplate.querySelector('a.detail').addEventListener("click", function () {
            const userId = GC.SDK.getCurrentUserId();
            const documentId = this.parentNode.getAttribute('data-id');

            console.log("DOWNLOAD DOCUMENT");
            console.log("==========");

            const timeStart = Date.now();
            GC.SDK.downloadDocument(userId, documentId)
                .then((document) => {
                    console.log("Finished Download Document:", (Date.now() - timeStart) + " ms");
                    console.log(document);

                    const r = new FileReader();
                    r.onloadend = function () {
                        console.log("File Information: ", JSON.parse(r.result));
                        alert(r.result);
                    };
                    r.readAsText(document.attachments[0].file);
                });
        });
        clonedTemplate.querySelector('a.delete').addEventListener("click", function () {
            const that = this;
            const userId = GC.SDK.getCurrentUserId();
            const documentId = this.parentNode.getAttribute('data-id');


            console.log("DELETE DATA");
            console.log("==========");
            console.log("Document:", documentId);

            GC.SDK.deleteDocument(userId, documentId)
                .then(() => {
                    that.parentNode.style.display = "none";
                });
        });
        clonedTemplate.querySelector('a.update').addEventListener("click", function () {
            const userId = GC.SDK.getCurrentUserId();
            const documentId = this.parentNode.getAttribute('data-id');
            GC.SDK.downloadDocument(userId, documentId)
                .then((document) => {
                    const r = new FileReader();
                    r.onloadend = function () {
                        const dataAttachment = JSON.parse(r.result);

                        const newTitle = window.prompt('SA Title', document.title);
                        const newDescription = window.prompt('SA Description', dataAttachment.erhebungsphase.beschreibung);

                        dataAttachment.erhebungsphase.beschreibung = newDescription;

                        const json = JSON.stringify(dataAttachment);
                        const blob = new Blob([json], {type: "application/json"});
                        const file = new File([blob], "SA.json", {type: "text/json;charset=utf-8", lastModified: Date.now()});

                        document.title = newTitle;

                        const attachment = new GC.SDK.models.HCAttachment({file});
                        document.attachments = [attachment];

                        console.log("UPDATE DATA");
                        console.log("==========");

                        console.log("Document: ", document);

                        GC.SDK.updateDocument(userId, document)
                            .then((response) => {
                                console.log("Result Document: ", response);
                                const r = new FileReader();
                                r.onloadend = function () {
                                    console.log("File Information: ", JSON.parse(r.result));
                                };
                                r.readAsText(response.attachments[0].file);
                            });

                    };
                    r.readAsText(document.attachments[0].file);
                });
        });
        ul.appendChild(clonedTemplate);
    }
}

function init100Records() {

}

function uploadData() {
    const userId = GC.SDK.getCurrentUserId();

    console.log("UPLAOD DATA");
    console.log("==========");

    const files = [dummyFile];

    //TODO ist die Struktur so korrek, in der DOUK gibt es unterschiedliche Angaben
    const document = new GC.SDK.models.HCDocument({
        files,
        title: "Title der SA",
        author: new GC.SDK.models.HCAuthor({firstName: "Max", lastName: "Mustermann"}),
        type: "application/json",
        creationDate: new Date(),
        annotations: ["Situationsanalyse"] //fuer spätere Filterung
    });

    console.log("Document: ", document);

    GC.SDK.uploadDocument(userId, document)
        .then((response) => {
            console.log("Result Document: ", response);
            const r = new FileReader();
            r.onloadend = function () {
                console.log("File Information: ", JSON.parse(r.result));
            };
            r.readAsText(response.attachments[0].file);
        });
}

function grantPermissionScience() {
    GC.SDK.grantPermission(window.appIdScience)
        .then(() => {

        });
}


function createDummyFile() {
    const data = {
        erhebungsphase: {
            beschreibung: "Ich bin mit einer Freundin ausgegangen, habe " +
            "sie heimgebracht und sagte ihr an der Tür gute " +
            "Nacht.",
            interpretation: [
                "Mir gelingt nichts.",
                "Sie hätte mich sicher nicht hineingelassen."
            ],
            verhalten: "Ich unterhielt mich mit ihr, sagte ihr gute Nacht und ging.",
            kiesler_kreis: "",
            ergebnis_real: "Ich verabschiedete mich und ging.",
            ergebnis_wunsch: "Ich frage sie, ob ich hineinkommen darf.",
            ziel_erreicht: false,
            ziel_nicht_erreicht_grund: "Ich habe mich nicht getraut zu fragen."
        },
        loesungsphase: {
            revision: [
                "Wenn ich sie nicht frage, weiß sie vielleicht nicht, dass " +
                "ich mit hineinkommen will.",
                "Ich will sie fragen, ob ich mit hinein darf."
            ],
            schlachtrufe: [],
            zielfuehrendes_verhalten: "Ich würde sagen: »Darf ich noch kurz mit hinein kommen?«",
            take_home_message: [
                "Ich sollte meine Wünsche aussprechen, riskiere dabei aber einen Korb."
            ],
            transfer: [
                "Ich werde meinem Freund morgen sagen, welchen Film ich im Kino am liebsten mit ihm sehen würde."
            ]
        }
    };
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

function drawLoginState() {
    const userId = GC.SDK.getCurrentUserId();
    if (userId) {
        document.getElementById("login").style.display = 'none';
        document.getElementById("logout").style.display = 'block';
        document.getElementById("userId").textContent = userId;

    } else {
        document.getElementById("login").style.display = 'block';
        document.getElementById("logout").style.display = 'none';
    }
}
