module.exports = {
    client: {
        webAppUrl: "http://localhost:4200"
    },
    server:{
        adresse: "http://localhost",
        port:  3000,
        secret: "1234secretsupersecret"
    },
    oauth:{
        gesundheitscloud: {
            client_id: 'tmcc-aid-local',
            client_secret: 'tmcctmcctmcc',
            authorizationURL: 'https://api-dev.hpsgc.de/oauth/authorize',
            tokenURL: 'https://api-dev.hpsgc.de/oauth/token',
            callbackURL: 'http://localhost:3000/auth/gc/callback'
        }
    }
};