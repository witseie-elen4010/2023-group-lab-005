const nodemailer = require("nodemailer");

exports.sendEmail = async (recipientEmail, message) => {
  try {
    const transporter = nodemailer.createTransport({
      // Configure your email transport settings
      service: 'gmail',
      auth: {
        user: 'project.consultify@gmail.com',
        pass: 'vnxaktcpcmkprsxy'
      }
    });

    const mailOptions = {
      from: "project.consultify@gmail.com",
      to: recipientEmail,
      html: message
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Error sending email:", err);
  }
};
