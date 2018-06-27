const config = require("config");
const OAuth2Strategy = require('passport-oauth2').Strategy;

module.exports = function (passport) {
    OAuth2Strategy.prototype.authorizationParams = function(options) {
        return { public_key: options.public_key }
    };

    passport.use(new OAuth2Strategy({
            authorizationURL: config.oauth.gesundheitscloud.authorizationURL,
            tokenURL: config.oauth.gesundheitscloud.tokenURL,
            clientID: config.oauth.gesundheitscloud.client_id,
            clientSecret: config.oauth.gesundheitscloud.client_secret,
            callbackURL: config.oauth.gesundheitscloud.callbackURL
        },
        function(accessToken, refreshToken, profile, cb) {
            return cb(null, {
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        }
    ));
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });
};