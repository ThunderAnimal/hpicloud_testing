module.exports = {
    client: {
        webAppUrl:  process.env.WEB_APP_URL
    },
    server:{
        adresse: process.env.ADRESSE ,
        port: process.env.PORT,
        secret: process.env.SECRET
    },
    oauth:{
        gesundheitscloud: {
            client_id: process.env.GESUNDHEITSCLOUD_CLIENT_ID,
            client_secret: process.env.GESUNDHEITSCLOUD_CLIENT_SECRET,
        }
    }
};