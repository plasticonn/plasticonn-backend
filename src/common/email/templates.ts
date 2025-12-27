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
