module.exports = {
    server:{
        adresse: "http://localhost",
        port:  3000,
        secret: "1234secretsupersecret"
    },
    oauth:{
        gesundheitscloud: {
            client_id: 'tmcc-aid-local',
            client_secret: 'charite',
            authorizationURL: 'https://staging.hpihc.de/oauth/authorize',
            tokenURL: 'https://staging.hpihc.de/oauth/token',
            callbackURL: 'http://localhost:3000/auth/gc/callback'
        }
    }
};