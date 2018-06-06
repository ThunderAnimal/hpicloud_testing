window.clientId = '778';
window.clientURL = 'http://localhost:3000';

const ownAccessToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvd25lcjo0ODZiODZjZS0wODIzLTQxYjAtYmFjNy1jNDliYTdkN2Y2ZTgiLCJpc3MiOiJ1cm46Z2hjIiwiZXhwIjoxNTI4Mjc4Mzk4LCJuYmYiOjE1MjgyNzQ2NzgsImlhdCI6MTUyODI3NDczOCwianRpIjoiNjVhZjk4NTUtMTI0OS00OWY5LTljMzktYzZkNzlhNWMwYWIzIiwiZ2hjOmFpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImdoYzpjaWQiOiIyIiwiZ2hjOnVpZCI6IjQ4NmI4NmNlLTA4MjMtNDFiMC1iYWM3LWM0OWJhN2Q3ZjZlOCIsImdoYzpzY29wZSI6ImV4YyBwZXJtOnIgcGVybTp3IHJlYzpyIHJlYzp3IGF0dGFjaG1lbnQ6ciBhdHRhY2htZW50OncgdXNlcjpyIHVzZXI6dyB1c2VyOnEifQ.Q2Mr1zuIlLCoQErsXUjsPWzhPEyS5UZBzb17F-HU15Gr1gpV8EePHhZEheDRyBn8aSo_87yoe0hK2tnMBuzM1eha5ExrGKzY8MQYjex7osTOsL2pIMIs7KDpphJiJlmws51L76vy1v2QgHhUfmuqzAQQEWoPoZG3u4mtCOSzjIZnr_6XSVnQXQVt3pGrD9JkfP6QYQV036euEEfqa0TTStupJ2wpdVE8NE1FhtQaf5ICu20MHw7fsJRaBGFCRH4BADZTyWlC3oytAGej81SKVoMbBPRDQPBkBvrn_VWQLghfmH5rUnZ-MlRCadF41h3Y6tqarA7HiK3mcXtaDx-jvyObDXT9FUbtfJ-9Zo8Q7rgPF5xVoQeLC5E2fjtvsDbEppcZj7FWa0l0e3sK7bZDVzkDf6XoSsiLdWa-i7leNuv9xjWWIBnMQnCqwCv65jD05WTIzYxixM602AsZt9WNaoknOLeKMEuKADcNlm7h7Kzt1kfyd9f3o87pW809hn2uaNSzI6cxLpmpDEZc4iH_oq2HothxXBXwTeIIjyv_zbNEBhlLPoglHZTWkPkOSP9tdIJYSN1cCmLLAUo9KOrooy1xvOs5eJgSveL9FTx1lJ-elGcX8B1ZH1u0vQDxQro2WKngJ8q4zDyntkRPqvZLFHFlG8ophcEQMRwG-Q6oSPg";
const ownUserId = "486b86ce-0823-41b0-bac7-c49ba7d7f6e8";

const dummyFile = createDummyFile();

document.addEventListener("DOMContentLoaded", function () {
    const userId = GC.SDK.getCurrentUserId();
    const appId = GC.SDK.getCurrentAppId();

    console.log(userId);
    console.log(appId);

    /* SETUP Authentification */
    showKeys(localStorage.getItem('publicKey'), localStorage.getItem('privateKey'));

    document.getElementById("btnSetupSdk").addEventListener("click", setupSdk);
    document.getElementById("btnLogin").addEventListener("click", loginOverAuthSdk);
    document.getElementById("btnLoadData").addEventListener("click", loadData);
    document.getElementById("btnUploadData").addEventListener("click", uploadData);
});

function setupSdk() {
    GC.SDK.createCAP().then((keys) => {
        localStorage.setItem('publicKey', keys.publicKey);
        localStorage.setItem('privateKey', keys.privateKey);
        showKeys(keys.publicKey, keys.privateKey);

        // GET ERRRO cant get user ID
        const promise = GC.SDK.setup(
            window.clientId,
            keys.privateKey,
            function () {
                return new Promise(function (resolve) {
                    //imporiert --> wie kann ich den OAuth realisieren?
                    resolve(ownAccessToken);
                })
            }
        );
    })
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
    console.log("LOAD DATA");
    console.log("==========");
    GC.SDK.getDocuments(ownUserId, {}).then((data) => {
        console.log(data);
    })
}

function uploadData() {
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
    GC.SDK.uploadDocument(ownUserId, document)
        .then((response) => console.log(response));


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
