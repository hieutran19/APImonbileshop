const nodemailer = require("nodemailer");
const config = require("config");
const transporter = nodemailer.createTransport({
  host: config.get("mail.host"),
  port: config.get("mail.port"),
  secure: false,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: config.get("mail.user"),
    pass: config.get("mail.pass"),
  },
});
module.exports = transporter;