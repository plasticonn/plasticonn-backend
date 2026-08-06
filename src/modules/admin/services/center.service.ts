import { CenterModel } from "../../centers/centers.model";
import { Logger } from "../../../common/logger/logger";
import { Roles } from "../../../common/enum/roles.enum";
import { HttpError } from "../../../common/utils/HttpError";
import { passwordServices } from "../../../common/utils/password";
import { parse } from "csv-parse/sync";
import { generateCenterId } from "../../../common/utils/generateCode";
import { geocodeAddress } from "../../../common/utils/geocode";
import { addLog } from "../../activity_logs/Logs.service";

const log = new Logger("CenterManagement");

interface CenterCsvRow {
  ID?: string;
  Center_Name: string;
  Type: string;
  Address: string;
  LGA?: string;
  Latitude: string | number;
  Longitude: string | number;
  Contact_Person?: string;
  Contact_Phone?: string;
  Contact_Email?: string;
  Accepted_Plastic_Types?: string;
  Date_Added?: string;
  Image_URL?: string;
  Center_Type?: string;
  Capacity?: string;
  Operating_Hours?: string;
  Price?: string;
  Formal?: string;
}

const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

export const bulkAddCenters = async (file: Express.Multer.File) => {
  const records = parse(file.buffer.toString("utf-8"), {
    columns: (header) => header.map((h: string) => h.trim()),
    skip_empty_lines: true,
  }) as CenterCsvRow[];

  const inserted = [];
  let skipped = 0;

  for (const row of records) {
    try {
      if (!row.Latitude || !row.Longitude) {
        skipped++;
        console.error("Skipped row (missing coordinates):", row.Center_Name);
        continue;
      }

      const center = {
        centerId: generateCenterId(),
        name: row.Center_Name,
        address: row.Address,

        gps: {
          type: "Point" as const,
          coordinates: [Number(row.Longitude), Number(row.Latitude)],
        },

        contactPerson: row.Contact_Person,
        contactPhone: row.Contact_Phone,
        contactEmail: row.Contact_Email,

        materialsAccepted: row.Accepted_Plastic_Types
          ? row.Accepted_Plastic_Types.split(",").map((m: string) => m.trim())
          : [],

        centerType: row.Center_Type || undefined,
        capacity: row.Capacity || undefined,
        operatingHours: row.Operating_Hours || undefined,
        price: row.Price || undefined,
        formal: row.Formal?.toLowerCase() === "true",

        verified: true,
        status: "active" as const,

        image: {
          url: row.Image_URL || null,
          public_id: null,
        },

        password: await passwordServices.hashPassword(generatePassword()),
      };

      const doc = await CenterModel.create(center);

      inserted.push(doc);
    } catch (err) {
      skipped++;
      console.error("Skipped row:", row.Center_Name, err);
    }
  }

  await addLog({
    type: "CSV upload",
    admin: "Admin",
    action: `${inserted.length} centers have been uploaded and verified`,
  });

  return {
    totalRows: records.length,
    inserted: inserted.length,
    skipped,
  };
};

const getCenter = async (centerId: string) => {
  log.info("Fetching center profile");

  const center = await CenterModel.findById(centerId).select("-password");

  if (!center) throw new HttpError(404, "Center not found");

  return { center };
};

const updateCenter = async (centerId: string, payload: any) => {
  log.info("Updating center profile");

  const center = await CenterModel.findById(centerId);

  if (!center) throw new HttpError(404, "Center not found");

  Object.assign(center, payload);

  await center.save();

  return { center };
};

const updateStatus = async (centerId: string, status: string) => {
  log.info("Updating center status");

  const center = await CenterModel.findById(centerId);

  if (!center) throw new HttpError(404, "Center not found");

  Object.assign(center, status);

  await addLog({
    type: "Status update",
    admin: "Super admin",
    action: `Center status has been updated to ${status}`,
    userId: centerId,
  });

  await center.save();

  return { center };
};

const verifyCenter = async (centerId: string, formal: boolean) => {
  log.info("Updating center status");

  const center = await CenterModel.findById(centerId);

  if (!center) throw new HttpError(404, "Center not found");

  Object.assign(center, { verified: true, formal: Boolean(formal) });

  await addLog({
    type: "Center Verified",
    admin: "Super admin",
    action: `A center has just been verified.`,
    userId: centerId,
  });

  await center.save();

  return { center };
};

const deleteCenter = async (centerId: string) => {
  log.info("Deleting center");

  const center = await CenterModel.findByIdAndDelete(centerId);

  if (!center) {
    throw new HttpError(404, "Center not found");
  }

  await addLog({
    type: "Account deletion",
    admin: "Admin",
    action: `Center account has been deleted by admin`,
    userId: centerId,
  });

  return { message: "Center deleted successfully" };
};

const getCenters = async () => {
  log.info("Getting all centers");

  const centers = await CenterModel.find().select("-password");

  if (centers.length <= 0) throw new HttpError(404, "No centers found");

  return { centers };
};

export const CenterManagement = {
  bulkAddCenters,
  getCenter,
  updateCenter,
  updateStatus,
  verifyCenter,
  deleteCenter,
};
