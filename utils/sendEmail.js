import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = await nodemailer.createTransport({
    // service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_SERVICE,
    port: 587,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  await transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

export default sendEmail;
