const nodemailer = require("nodemailer");
const moment = require("moment-timezone");
const config = require("../config/config");

const transport = nodemailer.createTransport(config.email.SMTP);

transport
  .verify()
  .then(() => console.log("Connected to Email Server"))
  .catch((error) => console.error("Error connecting to email server", error));

const sendEmail = async (to, subject, text) => {
  try {
    const message = { from: config.email.FROM, to, subject, text };
    await transport.sendMail(message);
  } catch (error) {
    console.error("Failed to send email", error);
  }
};

const credentialEmail = async (email, firstName, lastName, phone, password) => {
  const subject = "Login credential"
  const body = `
    Welcome to our platform!
    Dear ${firstName} ${lastName},
    Thank you for signing up with us. Your account details are as follows:
      Email: ${email}
      Phone: ${phone}
      Password: ${password}
    Please make sure to keep your password secure and keep it up-to-date.
    Best regards,
    Ayush
  `;

  await sendEmail(email, subject, body);
}

module.exports = {
    transport,
    sendEmail,
    credentialEmail
};