const nodemailer = require('nodemailer');

const sendEmail = async (to, body, subject, html) => {

  const transporter = nodemailer.createTransport({
    host: `${process.env.EMAIL_HOST}`,
    port: 587,
    auth: {
      user: `${process.env.EMAIL_NODEMAILER}`,
      pass: `${process.env.EMAIL_PASSWORD}`
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `NodeMailer ${process.env.EMAIL_NODEMAILER}`,
      to,
      subject,
      text: body,
      html
    })
    return {
      result: "success",
      messageId: info.messageId,
    };
  } catch (e) {
    return {
      result: "error",
      message: e.message,
    };
  }
}



module.exports = sendEmail