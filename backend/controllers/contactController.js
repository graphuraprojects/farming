import { sendEmail } from "../configs/sendEmail.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Email format
    const html = `
      <div style="font-family: Arial; padding:20px;">
        <h2 style="color:#03a74f;">New Contact Message</h2>

        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject}</p>

        <hr/>

        <p style="margin-top:15px;">
          ${message}
        </p>

        <br/>

        <p style="font-size:12px;color:gray;">
          Sent from Farm Machinery Platform
        </p>
      </div>
    `;

    const sent = await sendEmail({
      to: process.env.ADMIN_EMAIL, // Admin Gmail
      subject: `Contact: ${subject}`,
      html
    });

    if (!sent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send email"
      });
    }

    res.json({
      success: true,
      message: "Message sent successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
