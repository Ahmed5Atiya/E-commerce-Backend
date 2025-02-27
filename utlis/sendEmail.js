const nodemailer = require("nodemailer");

const sendTheEmail = async (options) => {
  // 1)  create the transeport email
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.SEND_EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  // 2) define the email options likke from , to , subject , email content
  await transporter.sendMail({
    from: "E-commerce App", // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  });

  // 3) send the email
};

module.exports = {
  sendTheEmail,
};
