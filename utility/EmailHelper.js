import nodemailer from "nodemailer";
const EmailSend=async (EmailTo,EmailText,EmailSubject)=>{
    let transporter = nodemailer.createTransport({
        host: '192.168.110.12',
        port: 25,
        secure: false,
        auth: {
            user: "info@idlc.com",
            pass: ''
        },tls: {
            rejectUnauthorized: false
        },
    });
    let mailOptions = {
        from: 'IDLC CAREER  <info@idlc.com>',
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText
    };
    return  await transporter.sendMail(mailOptions)
}
export  default  EmailSend;