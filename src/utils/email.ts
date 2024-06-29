import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendResetPasswordEmail = async (to: string, token: string) => {
  const url = `https://yourdomain.com/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject: 'Reset Password',
    html: `<p>Click <a href="${url}">here</a> to reset your password</p>`,
  });
};
