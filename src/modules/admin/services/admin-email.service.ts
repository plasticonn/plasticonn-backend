import { isValidEmail } from "../../../common/utils/email-validator";
import { EmailService } from "../../../common/email/email.service";
import { HttpError } from "../../../common/utils/HttpError";
import { CenterModel } from "../../centers/centers.model";
import { CollectorsModel } from "../../collectors/collectors.model";
import { AdminModel } from "../admin.model";

export class AdminEmailService {
  static async sendBulkEmail({
    audience,
    subject,
    html,
  }: {
    audience: string;
    subject: string;
    html: string;
  }) {
    let emails: string[] = await this.getEmailsByAudience(audience);

    // 🔹 Remove duplicates
    emails = emails.filter(
      (email, index, self) => self.indexOf(email) === index,
    );

    // 🔹 Split valid & invalid emails
    const validEmails = emails.filter(isValidEmail);
    const invalidEmails = emails.filter((e) => !isValidEmail(e));

    if (!validEmails.length) {
      throw new HttpError(400, "No valid email addresses found");
    }

    const CHUNK_SIZE = 100;
    for (let i = 0; i < validEmails.length; i += CHUNK_SIZE) {
      await EmailService.sendBulkEmail({
        to: validEmails.slice(i, i + CHUNK_SIZE),
        subject,
        html,
      });
    }

    return {
      sent: validEmails.length,
      skipped: invalidEmails.length,
      skippedEmails: invalidEmails,
    };
  }

  private static async getEmailsByAudience(
    audience: string,
  ): Promise<string[]> {
    switch (audience) {
      case "admins":
        return AdminModel.distinct("email");

      case "collectors":
        return CollectorsModel.distinct("email");

      case "centers":
        return CenterModel.distinct("contactEmail");

      case "all":
        const [admins, collectors, centers] = await Promise.all([
          AdminModel.distinct("email"),
          CollectorsModel.distinct("email"),
          CenterModel.distinct("contactEmail"),
        ]);
        return [...admins, ...collectors, ...centers];

      default:
        throw new HttpError(400, "Invalid audience");
    }
  }
}
