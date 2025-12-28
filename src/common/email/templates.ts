export const adminInviteTemplate = (data: {
  name: string;
  password: string;
}) => `
  <h2>Hello ${data.name}</h2>
  <p>You’ve been added as an admin on <strong>Plasticonn</strong>.</p>
  <p>Use this password: ${data.password} for initial login. Make sure to change from settings.</p>
`;

export const passwordResetTemplate = (link: string) => `
  <h3>Password Reset</h3>
  <p>Click the link below to reset your password:</p>
  <a href="${link}">Reset Password</a>
  <p>This link expires in 15 minutes.</p>
`;

export const newEventTemplate = (event: {
  title: string;
  description: string;
  date: string;
}) => `
  <h2>New Event 🎉</h2>
  <p><strong>${event.title}</strong></p>
  <p>${event.description}</p>
  <p>Date: ${event.date}</p>
`;

export const accountSuspensionTemplate = (data: {
  name: string;
  reason?: string;
}) => `
  <h2>Account Suspended</h2>

  <p>Hello ${data.name},</p>

  <p>Your Plasticonn account has been <strong>suspended</strong>.</p>

  ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ""}

  <p>
    During this period, you will not be able to access certain features of the platform.
  </p>

  <p>
    If you believe this was a mistake or need clarification, please contact our support team.
  </p>

  <p>— Plasticonn Team</p>
`;

export const accountRecoveryTemplate = (name: string) => `
  <h2>Account Restored</h2>

  <p>Hello ${name},</p>

  <p>
    Your Plasticonn account has been <strong>successfully restored</strong>.
  </p>

  <p>
    You can now log in and continue using the platform as usual.
  </p>

  <p>Thank you for your patience.</p>

  <p>— Plasticonn Team</p>
`;

export const accountDeactivationTemplate = (data: {
  name: string;
  reactivateLink?: string;
}) => `
  <h2>Account Deactivated</h2>

  <p>Hello ${data.name},</p>

  <p>
    Your Plasticonn account has been <strong>deactivated</strong>.
  </p>

  <p>
    If this action was unintentional, you can reactivate your account using the link below:
  </p>

  ${
    data.reactivateLink
      ? `<a href="${data.reactivateLink}">Reactivate Account</a>`
      : ""
  }

  <p>
    If you did not request this, please contact our support immediately.
  </p>

  <p>— Plasticonn Team</p>
`;

export const accountDeletionTemplate = (data: {
  name: string;
  deletionDate: string;
}) => `
  <h2>Account Deleted</h2>

  <p>Hello ${data.name},</p>

  <p>
    This email confirms that your Plasticonn account was <strong>permanently deleted</strong>.
  </p>

  <p>
    <strong>Date:</strong> ${data.deletionDate}
  </p>

  <p>
    All associated data has been removed in accordance with our data policy.
  </p>

  <p>
    If you believe this was done in error, please contact our support team immediately.
  </p>

  <p>— Plasticonn Team</p>
`;
