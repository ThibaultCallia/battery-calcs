export const calculateAdvice = (bill, size) => {
  const estimatedSelfConsumption = `${(size / 10) * 50}%`; // Example logic
  const estimatedConsumption = `${bill * 0.2} kWh/day`; // Example logic
  const estimatedExport = `${bill * 0.3} kWh/day`; // Example logic
  const estimatedImport = `${bill * 0.1} kWh/day`; // Example logic
  const suggestedBatterySize = `${Math.min(size * 0.5, bill * 0.2)} kWh`; // Example logic
  const batteryCost = `$${suggestedBatterySize * 1000}`; // Example cost logic
  const roi = `${(batteryCost / bill) * 0.5} years`; // Example ROI logic

  return {
    estimatedConsumption,
    estimatedSelfConsumption,
    estimatedExport,
    estimatedImport,
    suggestedBatterySize,
    batteryCost,
    roi,
  };
};
