import argon2 from "argon2";

const generatePassword = (length: number): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
};

const hashPassword = async (pin: string): Promise<string> => {
  console.log(pin);
  try {
    const hashedPassword = await argon2.hash(pin);
    return hashedPassword;
  } catch (err) {
    console.error("Error hashing password:", err);
    throw new Error("Failed to hash password.");
  }
};

const verifyPassword = async (
  pin: string,
  hashedPin: string,
): Promise<boolean> => {
  try {
    return await argon2.verify(hashedPin, pin);
  } catch (err) {
    console.error("Error verifying password:", err);
    throw new Error("Failed to verify password.");
  }
};

export const passwordServices = {
  hashPassword,
  verifyPassword,
  generatePassword,
};
