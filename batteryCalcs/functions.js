import {
  selfConsumptionArray,
  energyData,
  solarSystemSizes,
  consumptionRanges,
} from './referenceData.js';

export const calculateAdvice = (bill, days, size) => {
  const { energyPrice, feedInTariff, supplyCharge, productionConservatism } =
    energyData;
  const billMonth = (bill / days) * 30;

  // Round system size and find index
  const roundedSize = Math.round(size);
  const solarIndex = solarSystemSizes.indexOf(roundedSize);

  let bestMatch = null;
  let smallestDifference = Infinity;

  const solarProductionPerDay = roundedSize * 4 * productionConservatism;

  for (let i = 0; i < consumptionRanges.length; i++) {
    const dailyConsumption = consumptionRanges[i];
    const selfConsumptionPercentage = selfConsumptionArray[solarIndex][i];

    // Calculate self-consumption
    const selfConsumption =
      solarProductionPerDay * (selfConsumptionPercentage / 100);

    // Calculate export and import
    const energyExported = solarProductionPerDay - selfConsumption;
    const energyImported = dailyConsumption - selfConsumption;

    // Calculate estimated monthly bill
    const estimatedBill =
      (energyImported * energyPrice - energyExported * feedInTariff) * 30 +
      supplyCharge * 30;

    // Compare with the given bill
    const billDifference = Math.abs(billMonth - estimatedBill);

    // Keep track of the best match
    if (billDifference < smallestDifference) {
      smallestDifference = billDifference;
      bestMatch = {
        estimatedConsumption: dailyConsumption,
        estimatedSelfConsumption: selfConsumptionPercentage,
        estimatedExport: parseFloat(energyExported.toFixed(2)),
        estimatedImport: parseFloat(energyImported.toFixed(2)),
        suggestedBatterySize: parseFloat(
          Math.min(energyExported, energyImported).toFixed(2)
        ),
        estimatedBill: parseFloat(estimatedBill.toFixed(2)),
      };
    } else {
      // Break the loop once we're moving farther away
      break;
    }
  }

  return bestMatch;
};

console.log(calculateAdvice(300, 30, 10));
