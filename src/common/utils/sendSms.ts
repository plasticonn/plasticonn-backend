import axios from "axios";

interface CenterCredentialsPayload {
  phone: string;
  centerId: string;
  password: string;
  centerName: string;
}

export const sendCenterCredentialsSMS = async ({
  phone,
  centerId,
  password,
  centerName,
}: CenterCredentialsPayload) => {
  try {
    const cleaned = phone.replace(/\D/g, "");

    const formattedPhone = cleaned.startsWith("0")
      ? `+234${cleaned.slice(1)}`
      : cleaned.startsWith("234")
        ? `+${cleaned}`
        : cleaned;

    const message = `Welcome to Plasticonn, ${centerName}

Your center has been registered.

Center ID: ${centerId}
Password: ${password}

Please log in and change your password.`;

    const response = await axios.post(
      "https://v3.api.termii.com/api/sms/send",
      {
        api_key: process.env.TERMII_API_KEY,
        to: formattedPhone,
        from: "COFLARE", //PLASTICONN
        type: "plain",
        sms: message,
        channel: "generic",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("SMS SENT:", response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (err: any) {
    console.error("SMS ERROR:", err.message);

    return {
      success: false,
      error: err.message,
    };
  }
};
