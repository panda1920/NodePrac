const sgMail = require('@sendgrid/mail');

const appEmail = 'taskmanagerapp@nodejs.com';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendWelcomeEmail(name, email) {
    sendEmail(
        email,
        'Welcome to the Taskmanager App!',
        `Welcome to the app ${name}! Give us feedback to how the app is turning out!`
    );
}

function sendCancellationEmail(name, email) {
    sendEmail(
        email,
        'Thanks for using the App',
        `What could we have done to keep you on board? Any feedback is welcome! It was good having you, ${name}`
    );
}

function sendEmail(email, subject, text) {
    sgMail.send({
        from: appEmail,
        to: email,
        subject,
        text
    });
}

module.exports = {sendWelcomeEmail, sendCancellationEmail};