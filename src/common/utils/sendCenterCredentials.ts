import { EmailService } from "../email/email.service";
import { centerCredentialsTemplate } from "../email/templates";
import { sendCenterCredentialsSMS } from "./sendSms";

interface SendCredentialsInput {
  centerId: string;
  password: string;
  email?: string;
  centerName?: string;
  phone?: string;
}

export const sendCenterCredentials = async ({
  centerId,
  password,
  email,
  centerName,
  phone,
}: SendCredentialsInput) => {
  if (!email && !phone) {
    throw new Error("No email or phone provided for credential delivery");
  }

  const results = await Promise.allSettled([
    email
      ? EmailService.sendEmail({
          to: email,
          subject: "Your Plasticonn Center Login Details",
          html: centerCredentialsTemplate({
            name: centerName || "Center Name",
            centerId,
            password,
          }),
        })
      : Promise.reject(new Error("No email provided")),
    phone
      ? sendCenterCredentialsSMS({ phone, centerId, password })
      : Promise.reject(new Error("No phone provided")),
  ]);

  const [emailResult, smsResult] = results;

  if (emailResult.status === "rejected") {
    console.error("Email delivery failed:", emailResult.reason);
  }
  if (smsResult.status === "rejected") {
    console.error("SMS delivery failed:", smsResult.reason);
  }

  // Fail only if BOTH channels failed (or were unavailable)
  if (emailResult.status === "rejected" && smsResult.status === "rejected") {
    throw new Error("Failed to deliver credentials via email and SMS");
  }
};
