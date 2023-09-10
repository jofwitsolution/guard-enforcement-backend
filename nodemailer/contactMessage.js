const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const filePath = path.join(__dirname, "../views", "contact-message.html");
const htmlFile = fs.readFileSync(filePath, "utf-8");

const userEmail = process.env.SMTP_MAIL;
const pass = process.env.SMTP_PASSWORD;
const port = process.env.SMTP_PORT;
const host = process.env.SMTP_HOST;

const sendMessage = async ({ fullName, email, phone, message }) => {
  // Replace placeholders with values from the request body
  const html = htmlFile
    .replace(/{{fullName}}/g, fullName)
    .replace(/{{email}}/g, email)
    .replace(/{{phone}}/g, phone)
    .replace(/{{message}}/g, message);

  const transporter = nodemailer.createTransport({
    host,
    port,
    auth: {
      user: userEmail,
      pass,
    },
  });

  const mailOptions = {
    from: `Guard Enforcement Security and Patrol <mediaguardenforcement@gmail.com>`,
    to: ["info@guardenforcement.com"],
    subject: "Service Enquiry",
    html,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports.sendMessage = sendMessage;
