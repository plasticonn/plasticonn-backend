import SibApiV3Sdk from "sib-api-v3-sdk";
import { Logger } from "../logger/logger";

const log = new Logger("EmailService");

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const transactionalApi = new SibApiV3Sdk.TransactionalEmailsApi();

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
      await transactionalApi.sendTransacEmail({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL!,
          name: process.env.BREVO_SENDER_NAME!,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      });

      log.info(`Email sent to ${to}`);
    } catch (err: any) {
      log.error(err.message);
      throw err;
    }
  }
}
