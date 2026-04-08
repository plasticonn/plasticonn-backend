import { Resend } from "resend";
import { Logger } from "../logger/logger";

const log = new Logger("EmailService");

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  static async sendEmail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    try {
      const response = await resend.emails.send({
        from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
        to,
        subject,
        html,
      });

      log.info(`Email sent to ${to}`);
      return response;
    } catch (err: any) {
      console.error(err);
      log.error(err.message);
      throw err;
    }
  }

  static async sendBulkEmail({
    to,
    subject,
    message,
  }: {
    to: string[];
    subject: string;
    message: string;
  }) {
    try {
      const response = await resend.emails.send({
        from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
        to,
        subject,
        html: message,
      });

      log.info(`Bulk email sent to ${to.length} recipients`);
      return response;
    } catch (err: any) {
      console.error("Resend send error:", err.message);
      log.error(err.message);
      throw err;
    }
  }
}
