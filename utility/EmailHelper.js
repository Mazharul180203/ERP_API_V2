import nodemailer from "nodemailer";
const EmailSend=async (EmailTo,EmailText,EmailSubject)=>{
    let transporter = nodemailer.createTransport({
        host: 'live.smtp.mailtrap.io',
        port: 587,
        secure: false,
        auth: {
            user: '1a2b3c4d5e6f7g',
            pass: '1a2b3c4d5e6f7g',
        },tls: {
            rejectUnauthorized: false
        },
    });
    let mailOptions = {
        from: 'mazharul.saurav255@gmail.com>',
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText
    };
    return  await transporter.sendMail(mailOptions)
}
export  default  EmailSend;