"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountDeletionTemplate = exports.accountRecoveryTemplate = exports.accountSuspensionTemplate = exports.newEventTemplate = exports.passwordResetTemplate = exports.changePasswordTemplate = exports.adminInviteTemplate = void 0;
const baseTemplate = (content) => `
  <div style="background:#f4f4f7;padding:20px;font-family:Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;">
      
      <!-- Header -->
      <div style="background:#005C3D;padding:20px;text-align:center;">
        <img src="https://res.cloudinary.com/debacodes/image/upload/v1775666603/logo_la6fac.png" width="50" />
        <h1 style="color:#ffffff;margin:10px 0 0;font-size:20px;">
          Plasticonn
        </h1>
      </div>

      <!-- Content -->
      <div style="padding:30px;">
        ${content}
      </div>

      <!-- Footer -->
      <div style="background:#f4f4f7;padding:15px;text-align:center;">
        <p style="font-size:12px;color:#888;">
          © ${new Date().getFullYear()} Plasticonn
        </p>
      </div>

    </div>
  </div>
`;
const adminInviteTemplate = (data) => baseTemplate(`
    <h2 style="color:#005C3D;">Hello ${data.name}</h2>
    <p>You’ve been added as an <strong>admin</strong> on Plasticonn.</p>

    <p>Your temporary password:</p>
    <div style="background:#f4f4f7;padding:10px;border-radius:6px;font-weight:bold;">
      ${data.password}
    </div>

    <p style="margin-top:15px;">
      Please change it immediately after login.
    </p>
  `);
exports.adminInviteTemplate = adminInviteTemplate;
const changePasswordTemplate = (data) => baseTemplate(`
    <h2 style="color:#005C3D;">Hello</h2>

    <p>Use the OTP below to confirm your password change:</p>

    <div style="font-size:22px;font-weight:bold;color:#00C281;margin:20px 0;">
      ${data.otp}
    </div>

    <p>This OTP expires in <strong>5 minutes</strong>.</p>
  `);
exports.changePasswordTemplate = changePasswordTemplate;
const passwordResetTemplate = (link) => baseTemplate(`
    <h2 style="color:#005C3D;">Password Reset</h2>

    <p>Click the button below to reset your password:</p>

    <div style="text-align:center;margin:20px 0;">
      <a href="${link}" style="
        background:#00C281;
        color:#ffffff;
        padding:12px 20px;
        border-radius:6px;
        text-decoration:none;
        font-weight:bold;
      ">
        Reset Password
      </a>
    </div>

    <p>This link expires in <strong>15 minutes</strong>.</p>
  `);
exports.passwordResetTemplate = passwordResetTemplate;
const newEventTemplate = (event) => baseTemplate(`
    <h2 style="color:#005C3D;">New Event 🎉</h2>

    <p><strong>${event.title}</strong></p>
    <p>${event.description}</p>

    <p style="margin-top:10px;">
      <strong>Date:</strong> ${event.date}
    </p>
  `);
exports.newEventTemplate = newEventTemplate;
const accountSuspensionTemplate = (data) => baseTemplate(`
    <h2 style="color:#d32f2f;">Account Suspended</h2>

    <p>Hello ${data.name},</p>

    <p>Your account has been <strong>suspended</strong>.</p>

    ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ""}

    <p>You currently cannot access some features.</p>

    <p>If this is a mistake, contact support.</p>
  `);
exports.accountSuspensionTemplate = accountSuspensionTemplate;
const accountRecoveryTemplate = (name) => baseTemplate(`
    <h2 style="color:#00C281;">Account Restored</h2>

    <p>Hello ${name},</p>

    <p>Your account has been successfully restored.</p>

    <p>You can now log in and continue using the platform.</p>
  `);
exports.accountRecoveryTemplate = accountRecoveryTemplate;
const accountDeletionTemplate = (data) => baseTemplate(`
    <h2 style="color:#005C3D;">Account Deleted</h2>

    <p>Hello ${data.name},</p>

    <p>Your account has been permanently deleted.</p>

    <p><strong>Date:</strong> ${data.deletionDate}</p>

    <p>All associated data has been removed.</p>

    <p>If this was not you, contact support immediately.</p>
  `);
exports.accountDeletionTemplate = accountDeletionTemplate;
