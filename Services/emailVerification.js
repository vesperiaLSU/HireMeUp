(function () {
    var _ = require("underscore");
    var fs = require("fs");
    var jwt = require("jwt-simple");
    var webConfig = require("../Config/webConfig.js");
    var nodeMailer = require("nodemailer");
    var smtpTransport = require("nodemailer-smtp-transport");
    var User = require("../Models/User.js");
    var messages = require("../Config/messageConfig.js");

    exports.send = function (user) {
        var payload = {
            email: user.email,
            ggId: user.googleId,
            fbId: user.facebookId
        };

        var token = jwt.encode(payload, webConfig.EMAIL_SECRET);

        var transporter = nodeMailer.createTransport(smtpTransport({
            host: webConfig.SMTP_HOST,
            secure: true,
            auth: {
                user: webConfig.SMTP_USER,
                pass: webConfig.SMTP_PASS
            }
        }));

        var mailOptions = {
            from: webConfig.SMTP_EMAIL_FROM,
            to: user.email,
            subject: "JWT Account Verification",
            html: getHtml(token)
        };


        transporter.sendMail(mailOptions, function (err, info) {
            if (err) return console.log(err)

            console.log("email sent " + info.response);
        });
    };

    exports.handler = function (req, res) {
        var token = req.query.token;
        var payload = jwt.decode(token, webConfig.EMAIL_SECRET);
        var email = payload.email;
        var googleId = payload.ggId;
        var facebookId = payload.fbId;
        var search = {};
        if (!email) return handleError(res);

        if (googleId) {
            search = {googleId: googleId};
            handleActivation(res, search);
        } else if (facebookId) {
            search = {facebookId: facebookId};
            handleActivation(res, search);
        } else {
            search = {email: email};
            handleActivation(res, search);
        }
    };

    function getHtml(token) {
        var model = {
            verifyUrl: webConfig.VERIFY_URL,
            title: "JWT",
            subTitle: "Thanks for signing up",
            body: messages.NEED_VERIFY
        };

        var path = "./views/emailVerification.html";
        var html = fs.readFileSync(path, encoding = "utf8");

        var template = _.template(html);

        model.verifyUrl = model.verifyUrl + token;

        return template(model);
    }

    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };

    function handleError(res) {
        return res.status(401).send({
            message: messages.AUTHORIZATION_FAIL
        });
    }

    function handleActivation(res, search) {
        User.findOne(search, function (err, foundUser) {
            if (err) return res.status(500);

            if (!foundUser) return handleError(res);

            if (!foundUser.active) {
                foundUser.active = true;
            }

            foundUser.save(function (err) {
                if (err) return res.status(500);

                return res.redirect(webConfig.APP_URL);
            })
        });
    }
}());


