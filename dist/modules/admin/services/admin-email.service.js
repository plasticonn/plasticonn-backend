"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminEmailService = void 0;
const email_validator_1 = require("../../../common/utils/email-validator");
const email_service_1 = require("../../../common/email/email.service");
const HttpError_1 = require("../../../common/utils/HttpError");
const centers_model_1 = require("../../centers/centers.model");
const collectors_model_1 = require("../../collectors/collectors.model");
const admin_model_1 = require("../admin.model");
class AdminEmailService {
    static async sendBulkEmail({ audience, subject, message, }) {
        let emails = await this.getEmailsByAudience(audience);
        emails = emails.filter((email, index, self) => self.indexOf(email) === index);
        const validEmails = emails.filter(email_validator_1.isValidEmail);
        const invalidEmails = emails.filter((e) => !(0, email_validator_1.isValidEmail)(e));
        if (!validEmails.length) {
            throw new HttpError_1.HttpError(400, "No valid email addresses found");
        }
        const CHUNK_SIZE = 100;
        for (let i = 0; i < validEmails.length; i += CHUNK_SIZE) {
            await email_service_1.EmailService.sendBulkEmail({
                to: validEmails.slice(i, i + CHUNK_SIZE),
                subject,
                message,
            });
        }
        return {
            sent: validEmails.length,
            skipped: invalidEmails.length,
            skippedEmails: invalidEmails,
        };
    }
    static async getEmailsByAudience(audience) {
        switch (audience) {
            case "admins":
                return admin_model_1.AdminModel.distinct("email");
            case "collectors":
                return collectors_model_1.CollectorsModel.distinct("email");
            case "centers":
                return centers_model_1.CenterModel.distinct("contactEmail");
            case "all":
                const [admins, collectors, centers] = await Promise.all([
                    admin_model_1.AdminModel.distinct("email"),
                    collectors_model_1.CollectorsModel.distinct("email"),
                    centers_model_1.CenterModel.distinct("contactEmail"),
                ]);
                return [...admins, ...collectors, ...centers];
            default:
                throw new HttpError_1.HttpError(400, "Invalid audience");
        }
    }
}
exports.AdminEmailService = AdminEmailService;
