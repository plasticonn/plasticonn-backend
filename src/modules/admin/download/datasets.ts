import { CenterModel } from "../../centers/centers.model";
import { CollectorsModel } from "../../collectors/collectors.model";
import { DropsModel } from "../../drops/drops.model";

export const fetchDataset = async (dataset: string, filters: any) => {
  switch (dataset) {
    case "centers":
      return CenterModel.find(filters)
        .select(
          "centerId name address gps contactPerson contactPhone contactEmail materialsAccepted capacity operatingHours type createdAt",
        )
        .lean();

    case "collectors":
      return CollectorsModel.find(filters)
        .select("name email phone status co2Saved createdAt")
        .lean();

    case "drops":
      return DropsModel.find(filters)
        .select(
          "collector_id center_id status amount condition location createdAt",
        )
        .lean();

    default:
      throw new Error("Invalid dataset");
  }
};
