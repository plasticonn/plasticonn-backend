// Average CO2 saved per kg of recycled plastic vs virgin plastic production
const CO2_PER_KG = 1.5; // kg of CO2 saved per kg of plastic recycled
const AVG_PLASTIC_WEIGHT_KG = 0.01; // average weight of one plastic item (10g)

export const calculateCO2Saved = (plasticsCollected: number): string => {
  const weightKg = plasticsCollected * AVG_PLASTIC_WEIGHT_KG;
  const co2Saved = weightKg * CO2_PER_KG;

  //   if (co2Saved < 1) {
  //     return `${(co2Saved * 1000).toFixed(1)}g`;
  //   }

  return `${co2Saved.toFixed(2)}kg`;
};
