import SibApiV3Sdk from "sib-api-v3-sdk";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const client = SibApiV3Sdk.ApiClient.instance;

    client.authentications["api-key"].apiKey =
      process.env.BREVO_API_KEY;

    const api = new SibApiV3Sdk.TransactionalEmailsApi();

    const response = await api.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME
      },
      to: [{ email: to }],
      replyTo: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME
      },
      subject,
      htmlContent: html
    });

    console.log("Brevo response:", response);
    return true;
  } catch (error) {
    console.error(
      "Brevo email error:",
      error.response?.body || error.message
    );
    return false;
  }
};
