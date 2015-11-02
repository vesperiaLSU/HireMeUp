(function () {
    module.exports = {
        //google authenticate
        GOOGLE_URL: "https://www.googleapis.com/oauth2/v3/token",
        GOOGLE_API: "https://www.googleapis.com/plus/v1/people/me/openIdConnect",
        GOOGLE_SECRET: "1i-ZVE86crQvzRrvK80x0ZaI",
        //facebook authenticate
        FACEBOOK_URL: "https://graph.facebook.com/v2.5/oauth/access_token",
        FACEBOOK_API: "https://graph.facebook.com/v2.5/me?",
        FACEBOOK_SECRET: "6009b383527a605c8a959f013b5b3a4c",
        //local mongodb
        MONGODB: "mongodb://chen:123@ds039484.mongolab.com:39484/jobfinder",
        //jwt secret
        EMAIL_SECRET: "email",
        LOGIN_SECRET: "login",
        //email verification
        VERIFY_URL: "http://localhost:3000/auth/verifyEmail?token=",
        SEND_PATH: "./views/emailVerification.html",
        SMTP_USER: "postmaster@sandbox84e308c556b84c7cbd01486c1508870e.mailgun.org",
        SMTP_PASS: "dae3f15a722e23f3ffd9b4c354b8a993",
        SMTP_HOST: "smtp.mailgun.org",
        SMTP_EMAIL_FROM: "Accounts <postmaster@sandbox84e308c556b84c7cbd01486c1508870e.mailgun.org>",
        //angular app url
        APP_URL: "http://localhost:9000/"
    };
}());