import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Debug environment variables
  console.log('SMTP Config:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_EMAIL,
  });

  // Create a transporter with explicit configuration
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    secure: false,
    auth: {
      user: '9022b0df3e43f9',
      pass: 'd45fe2e6fb49a6',
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Define email options
  const mailOptions = {
    from: `CAMSHOP <noreply@gmail.com>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info);
  } catch (error) {
    console.error('Detailed email error:', error);
    throw error;
  }
};

export default sendEmail;
