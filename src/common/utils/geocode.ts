import axios from "axios";
import { HttpError } from "./HttpError";

export const geocodeAddress = async (address: string) => {
  const url = "https://nominatim.openstreetmap.org/search";

  try {
    const response = await axios.get(url, {
      params: {
        q: address,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "Plasticonn/1.0",
      },
    });

    if (!response.data.length) {
      throw new HttpError(400, `Unable to geocode address: ${address}`);
    }

    const location = response.data[0];

    return {
      lat: Number(location.lat),
      lng: Number(location.lon),
    };
  } catch (err) {
    console.log(err);
    throw new HttpError(400, "Failed to fetch GPS coordinates");
  }
};
