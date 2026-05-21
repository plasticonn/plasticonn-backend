"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geocodeAddress = void 0;
const axios_1 = __importDefault(require("axios"));
const HttpError_1 = require("./HttpError");
const geocodeAddress = async (address) => {
    const url = "https://nominatim.openstreetmap.org/search";
    try {
        const response = await axios_1.default.get(url, {
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
            throw new HttpError_1.HttpError(400, `Unable to geocode address: ${address}`);
        }
        const location = response.data[0];
        return {
            lat: Number(location.lat),
            lng: Number(location.lon),
        };
    }
    catch (err) {
        console.log(err);
        throw new HttpError_1.HttpError(400, "Failed to fetch GPS coordinates");
    }
};
exports.geocodeAddress = geocodeAddress;
