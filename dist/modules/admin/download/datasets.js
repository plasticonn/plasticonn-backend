"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDataset = void 0;
const centers_model_1 = require("../../centers/centers.model");
const collectors_model_1 = require("../../collectors/collectors.model");
const drops_model_1 = require("../../drops/drops.model");
const fetchDataset = async (dataset, filters) => {
    switch (dataset) {
        case "centers":
            return centers_model_1.CenterModel.find(filters)
                .select("centerId name address gps contactPerson contactPhone contactEmail materialsAccepted capacity operatingHours type createdAt")
                .lean();
        case "collectors":
            return collectors_model_1.CollectorsModel.find(filters)
                .select("name email phone status co2Saved createdAt")
                .lean();
        case "drops":
            return drops_model_1.DropsModel.find(filters)
                .select("collector_id center_id status amount condition location createdAt")
                .lean();
        default:
            throw new Error("Invalid dataset");
    }
};
exports.fetchDataset = fetchDataset;
