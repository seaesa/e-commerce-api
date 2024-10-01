import nodemailer from 'nodemailer';
import 'dotenv/config';
import pdf from 'html-pdf';
import emailSettingModel from './../models/email-setting-model.js';

const generatePdfFromHtml = async (html) => {
    const options = {
        format: 'A4' // Set page size to A4
    };

    return new Promise((resolve, reject) => {
        pdf.create(html, options).toBuffer((err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
    });
};

const sendMail = async (mailOptions) => {
    let emailSetting;

    try {
        emailSetting = await emailSettingModel.findOne();
    } catch (err) {
        console.log('Error finding email setting:', err);
    }

    console.log(emailSetting);

    const config = {
        host: (emailSetting && emailSetting.host) ? emailSetting.host : process.env.MAIL_HOST,
        port: (emailSetting && emailSetting.port) ? emailSetting.port : process.env.MAIL_PORT,
        auth: {
            user: (emailSetting && emailSetting.username) ? emailSetting.username : process.env.MAIL_USERNAME,
            pass: (emailSetting && emailSetting.password) ? emailSetting.password : process.env.MAIL_PASSWORD
        }
    };

    const { from, to, subject, message, attachments = [] } = mailOptions;
    const transporter = nodemailer.createTransport(config);

    // Verify connection configuration
    try {
        await transporter.verify();
        console.log('Server is ready to take our messages');

        // Convert each attachment HTML to PDF and add it to the attachments array
        const pdfAttachments = [];

        // Check if attachments is an array and has at least one element
        if (attachments.length > 0) {
            for (const attachment of attachments) {
                const { filename, html } = attachment;
                const pdfBuffer = await generatePdfFromHtml(html);
                pdfAttachments.push({ filename, content: pdfBuffer });
            }
        }

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from, // sender address
            to, // list of receivers
            subject, // Subject line
            html: message, // html body
            attachments: pdfAttachments
        });

        console.log('Message sent: %s', info.messageId);

        return info.messageId;
    } catch (error) {
        console.log('Error sending email:', error);
    }
};

export default sendMail;
