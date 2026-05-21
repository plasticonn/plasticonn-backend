"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const resend_1 = require("resend");
const logger_1 = require("../logger/logger");
const log = new logger_1.Logger("EmailService");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
class EmailService {
    static async sendEmail({ to, subject, html, }) {
        try {
            const response = await resend.emails.send({
                from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
                to,
                subject,
                html,
            });
            log.info(`Email sent to ${to}`);
            return response;
        }
        catch (err) {
            console.error(err);
            log.error(err.message);
            throw err;
        }
    }
    static async sendBulkEmail({ to, subject, message, }) {
        try {
            const response = await resend.emails.send({
                from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
                to,
                subject,
                html: message,
            });
            log.info(`Bulk email sent to ${to.length} recipients`);
            return response;
        }
        catch (err) {
            console.error("Resend send error:", err.message);
            log.error(err.message);
            throw err;
        }
    }
}
exports.EmailService = EmailService;
