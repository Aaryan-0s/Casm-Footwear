//Send a mail to user for reset password in the form of token

const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
   
    service: process.env.SMPT_SERVICE,
    auth: {
      user: "aaryanbasnet16@gmail.com",
      pass: "wheaitcvbxnzdusb",
    },
  });

  const mailOptions = {
    from: "aaryanbasnet16@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
