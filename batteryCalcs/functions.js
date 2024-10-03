/* 
selfConsumptionArray represents a reference table we will use for battery calculations. 
This will be available in CMS - and will be fine-tuned in the future
*/

/* 
IF BILL SIZE FALLS OUTSIDE OF OUR RANGE
If user bill falls outside of what our model offers, the largest system possible if chosen by default. 
*/

/* 
BATTERY COSTS
Exact logic behind which battery will be fine-tuned. The logic on how much that setup costs (and thus what ROI will be) also has to be created. 
These will not be more complex than following calcs:
*/

import {
  selfConsumptionArray,
  energyData,
  solarSystemSizes,
  consumptionRanges,
} from './referenceData.js';

export const calculateAdvice = (bill, days, size) => {
  // Energy data (feed in, prices, charges will be available in CMS.)
  const { energyPrice, feedInTariff, supplyCharge, productionConservatism } =
    energyData;
  const billMonth = (bill / days) * 30;

  // Round system size and find index
  const roundedSize = Math.round(size);
  const solarIndex = solarSystemSizes.indexOf(roundedSize);

  let bestMatch = null;
  let smallestDifference = Infinity;

  const solarProductionPerDay = roundedSize * 4 * productionConservatism;

  //   Calculation will loop through the values of daily consumption linked to specific solar system size.
  // It will calculate the bill given the daily consumption of current iteration and stop the loop once it has found the user's bill.
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
      // Break the loop once we've found the smallest diff (= customer daily consumption)
      break;
    }
  }

  return bestMatch;
};

// console.log(calculateAdvice(300, 30, 10));
