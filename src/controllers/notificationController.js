const Consultation = require("../models/consultationModel")
const { sendEmail} = require("./emailController")

// Function to send emails for consultation at 7am every day
const sendNotificationEmails = async () => {
    try {
        // Get the current day
        const currentDay = new Date().toLocaleDateString("en-US",{
            weekday: "long",
        });

        // Find the consultations with the same day as the current day
        const consultations = await Consultation.find({ day: currentDay });

        // Iterate over each consultation
        for (const consultation of consultations) {
            const lecturerEmail = consultation.lecturerEmail;
            const attendees = consultation.attendees;
            const message = "Hello, this is a scheduled email for the consultation.";

            // Send email to lecturer
            await sendEmail(lecturerEmail, message);

        }

        console.log("Emails sent successfully");
        } catch (error) {
            console.error("Error sending emails:", err);
    }
};

module.exports = {
    sendNotificationEmails,
};