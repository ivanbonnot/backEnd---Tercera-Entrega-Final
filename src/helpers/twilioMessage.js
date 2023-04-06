const twilio = require("twilio");

const sendMessage = async (to, body, sendToWhatsapp) => {
  try {
    const from = sendToWhatsapp ? process.env.WSP_NUMBER : process.env.TWILIO_NUMBER;
    const sendTo = sendToWhatsapp ? `whatsapp:${to}` : `+${to}`;

    const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
    const message = await client.messages.create({
      body,
      from,
      to: sendTo,
    });

    return {
      result: "success",
      messageId: message.sid,
    };
  } catch (e) {
    return {
      result: "error",
      message: e.message,
    };
  }
};

module.exports = sendMessage