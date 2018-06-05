
window.clientId = '778';
window.clientURL = 'http://localhost:3000';
document.addEventListener("DOMContentLoaded", function() {
    const userId = GC.SDK.getCurrentUserId();
    const appId = GC.SDK.getCurrentAppId();

    console.log(userId);
    console.log(appId);

    /* LOGIN over HPI Auth */

    /* SETUP Authentification */
    // TODO Implement OAuth Client, kein Plan wie die API da funktionert....
    // fehlenden Routes , /login, /gctoken, /gckeys
    /*GC.AUTH.config({
        clientId: window.clientId,
        clientURL: window.clientURL,
    });
    GC.AUTH.loggedIn.then((isLoggedIn) => {
        if(!isLoggedIn){
            GC.AUTH.login();
        }
    });*/


    /*  */
    showKeys(localStorage.getItem('publicKey'), localStorage.getItem('privateKey'));

    document.getElementById("btnSetupSdk").addEventListener("click", function () {
        setupSdk();
    });
});

function setupSdk() {
    GC.SDK.createCAP().then((keys) => {
        localStorage.setItem('publicKey', keys.publicKey);
        localStorage.setItem('privateKey',keys.privateKey);
        showKeys(keys.publicKey, keys.privateKey);

        const promise = GC.SDK.setup(
            window.clientId,
            keys.privateKey,
            function(){
                return new Promise(function(resolve){
                    //imporiert
                    resolve("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvd25lcjo0ODZiODZjZS0wODIzLTQxYjAtYmFjNy1jNDliYTdkN2Y2ZTgiLCJpc3MiOiJ1cm46Z2hjIiwiZXhwIjoxNTI4MjEzNzkyLCJuYmYiOjE1MjgyMTAwNzIsImlhdCI6MTUyODIxMDEzMiwianRpIjoiNDYwMmRjMGYtYWQ2Yi00NmJmLTkxOTUtODY5NWQ5YTgwMWViIiwiZ2hjOmFpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImdoYzpjaWQiOiIyIiwiZ2hjOnVpZCI6IjQ4NmI4NmNlLTA4MjMtNDFiMC1iYWM3LWM0OWJhN2Q3ZjZlOCIsImdoYzpzY29wZSI6ImV4YyBwZXJtOnIgcGVybTp3IHJlYzpyIHJlYzp3IGF0dGFjaG1lbnQ6ciBhdHRhY2htZW50OncgdXNlcjpyIHVzZXI6dyB1c2VyOnEifQ.Qhf4J5Xxy0OaqBN-bwcj8-HgKJ91gQh7-hacS94craH0FR6prx2HTZzVt6KVQtAu9kOCCUCZcIXDpAPfOkrsKwAtvxfBCLN54SoJNiXwrUG1bbAgm445HkHJZmPrdlfXnzw12VppfA3xB7-zzpdU3ULqL4nRRF5AQLBE4eRdztgzixNMUxewzUyNUwUy1_XMm5DnrbFD6Jcf2TrwOqlE55PwQHrBBeLbmq6U--pZfvGKHImtWURCfSmxq3SuApZHbGAMrNrt6etz8nnA1Pg41j_7110V2UvYVhJlg31wKGupdP8PAHo9aZzwRE7mibthduip0U_iZvO8WaFTuIO338hXQy00hAO_fOML3V_ecu6zS1IQrrYtpgzYOBAUcazbhKI_layYUG0ioPySHyDGAZ7Qu9ILm8wpbGepOrd0dk3qcB1MbVKI0-qE_TkpJWhfqi3-KaYporA2miOC35SO6guiNmSlKAH7vbssAjjjo88MxKi1sXHOb5xIHB2gB7SHnfAFhlcY06rH0mRSPGdMvaLjrJU_t4BQNWScChDEAYJhRUPeTC2sCR28_kJ1FLWqIOwtpLMPiokSCFktCMcsqJGBRaywcADrkP9jDfA7UdrOCIWzSarUfhPycbKbHbEUT-7wxVkbmWYKwPgfIS0_Btko9f7viQ4NGV_4XNgy3X4");
                })
            }
        );
        console.log(promise);
    })
}

function showKeys(publicKey, privateKey){
    document.getElementById("publicKey").textContent = publicKey;
    document.getElementById("privateKey").textContent = privateKey;
}
