/* 
selfConsumptionArray represents a reference table we will use for battery calculations. 
This will be available in CMS - and will be fine-tuned in the future
*/

/* 
-- IF BILL SIZE FALLS OUTSIDE OF OUR RANGE --
If user bill falls outside of what our model offers, the largest or smallest daily consumption is chosen by default. 

*/

import {
  selfConsumptionArray,
  energyData,
  solarSystemSizes,
  consumptionRanges,
  batterySizeTable,
  batteryCostData,
  batteryRebatesData,
} from './referenceData.js';

export const calculateAdvice = (billMonth, hasSolar, size) => {
  // Energy data (feed in, prices, charges will be available in CMS.)
  const {
    energyPrice,
    feedInTariffBattery,
    supplyCharge,
    productionConservatism,
  } = energyData;

  // Round system size and find index
  const roundedSize = Math.round(size);
  // Handle cases where the roundedSize is not in the solarSystemSizes array
  let solarIndex;
  if (roundedSize < solarSystemSizes[0]) {
    throw new Error('System size is too small and not supported.');
  } else if (roundedSize > solarSystemSizes[solarSystemSizes.length - 1]) {
    solarIndex = solarSystemSizes.length - 1; // Default to the last index
  } else {
    solarIndex = solarSystemSizes.indexOf(roundedSize);
  }

  let bestMatch = null;
  let smallestDifference = Infinity;

  // Fallback solar production calculation
  const solarProductionPerDay = roundedSize * 4 * productionConservatism;

  if (hasSolar) {
    // If the customer has solar,  iterate through the possible consumption ranges to find the best match
    for (let i = 0; i < consumptionRanges.length; i++) {
      const currentDailyConsumption = consumptionRanges[i];
      const selfConsumptionPercentage = selfConsumptionArray[solarIndex][i];

      // Calculate self-consumption, export, and import
      const selfConsumption =
        solarProductionPerDay * (selfConsumptionPercentage / 100);
      const energyExported = solarProductionPerDay - selfConsumption;
      const energyImported = currentDailyConsumption - selfConsumption;

      // Estimate the bill
      const estimatedBill =
        (energyImported * energyPrice - energyExported * feedInTariffBattery) *
          30 +
        supplyCharge * 30;

      const billDifference = Math.abs(billMonth - estimatedBill);

      if (billDifference < smallestDifference) {
        smallestDifference = billDifference;
        bestMatch = {
          estimatedConsumption: currentDailyConsumption,
          estimatedSelfConsumption: selfConsumptionPercentage,
          estimatedExport: parseFloat(energyExported.toFixed(2)),
          estimatedImport: parseFloat(energyImported.toFixed(2)),
          optimalBatterySize: parseFloat(
            Math.min(energyExported, energyImported).toFixed(2)
          ),
          estimatedBill: parseFloat(estimatedBill.toFixed(2)),
        };
      } else {
        break; // Break when the smallest difference is found
      }
    }
  } else {
    // If the customer doesn't have solar
    const calculatedDailyConsumption =
      (billMonth / 30 - supplyCharge) / energyPrice;

    // Find the closest consumption range from the consumptionRanges array
    let closestConsumption = consumptionRanges[0];
    let closestDifference = Math.abs(
      calculatedDailyConsumption - closestConsumption
    );

    for (let i = 1; i < consumptionRanges.length; i++) {
      const currentDifference = Math.abs(
        calculatedDailyConsumption - consumptionRanges[i]
      );
      if (currentDifference < closestDifference) {
        closestConsumption = consumptionRanges[i];
        closestDifference = currentDifference;
      }
    }

    // Use the closest consumption range to calculate the values
    const selfConsumptionPercentage =
      selfConsumptionArray[solarIndex][
        consumptionRanges.indexOf(closestConsumption)
      ];
    const selfConsumption =
      solarProductionPerDay * (selfConsumptionPercentage / 100);
    const energyExported = solarProductionPerDay - selfConsumption;
    const energyImported = closestConsumption - selfConsumption;

    bestMatch = {
      estimatedConsumption: closestConsumption,
      estimatedSelfConsumption: selfConsumptionPercentage,
      estimatedExport: parseFloat(energyExported.toFixed(2)),
      estimatedImport: parseFloat(energyImported.toFixed(2)),
      optimalBatterySize: parseFloat(
        Math.min(energyExported, energyImported).toFixed(2)
      ),
    };
  }

  return bestMatch;
};

// Function to determine battery options based on the optimal battery size
export const getBatterySizes = (optimalBatterySize) => {
  // Round the optimal battery size
  const roundedBatterySize = Math.round(optimalBatterySize);

  // Get all battery sizes in the table
  const batterySizesKeys = Object.keys(batterySizeTable).map(Number);

  // Find the minimum and maximum battery sizes in the ref table
  const minBatterySize = Math.min(...batterySizesKeys);
  const maxBatterySize = Math.max(...batterySizesKeys);

  // If the rounded size is less than the minimum, return the smallest system
  if (roundedBatterySize < minBatterySize) {
    const batterySizes = batterySizeTable[minBatterySize];
    return {
      optimalBatterySize,
      sungrowSize: batterySizes.sungrow,
      teslaSize: batterySizes.tesla,
      default: batterySizes.default,
    };
  }

  // If the rounded size is greater than the maximum, return the largest system
  if (roundedBatterySize > maxBatterySize) {
    const batterySizes = batterySizeTable[maxBatterySize];
    return {
      optimalBatterySize,
      sungrowSize: batterySizes.sungrow,
      teslaSize: batterySizes.tesla,
      default: batterySizes.default,
    };
  }

  // If the size is within the range, return the closest size available in the table
  if (roundedBatterySize in batterySizeTable) {
    const batterySizes = batterySizeTable[roundedBatterySize];
    return {
      optimalBatterySize,
      sungrowSize: batterySizes.sungrow,
      teslaSize: batterySizes.tesla,
      default: batterySizes.default,
    };
  }
};

// Function to calculate battery costs
export const calculateBatteryCost = (batterySizeAdvice, hasSolar) => {
  /*
   This is hard coded Tesla vs Sungrow
   Ideally, the cost calculation would be done according to whether the battery is modular or not and referring to the database
  */
  const { teslaSize, sungrowSize, optimalBatterySize } = batterySizeAdvice;
  const { BRCNLF, BRCConstant, BRCValue } = batteryRebatesData;
  const { energyPrice, feedInTariffBattery } = energyData;

  // Tesla Battery Cost Calculation --------
  const teslaModel = hasSolar ? batteryCostData.PW2 : batteryCostData.PW3; // determine which model will be used
  const teslaBaseUnits = teslaSize / teslaModel.baseCapacity; //Determine how many models will be used
  const teslaRebates = teslaSize * BRCNLF * BRCConstant * BRCValue;
  // install cost is initial install for the first unit and extra install cost per extra unit
  const teslaCost =
    teslaBaseUnits * teslaModel.baseCost +
    teslaModel.initialInstallCost +
    (teslaBaseUnits - 1) * teslaModel.extraInstallCost;
  const teslaTotalCost = teslaCost - teslaRebates;
  // Yearly savings equals the minimum between export, import and the actual advised battery size * gains.
  // You cant save more than what you import, you cant save more than what you export and you cant save more than what your battery is capable of
  const teslaYearlySavings =
    Math.min(optimalBatterySize, teslaSize) *
    (energyPrice - feedInTariffBattery) *
    365;
  const teslaPaybackPeriod = parseFloat(
    (teslaTotalCost / teslaYearlySavings).toFixed(1)
  );

  // Sungrow Battery Cost Calculation -------
  const sungrowModel = batteryCostData.sungrow;
  // How many battery units are needed for advised size
  const sungrowModularUnits = Math.ceil(
    sungrowSize / sungrowModel.baseCapacity
  );
  // Per base unit, a max of "modularUnitsPerBase" can be fitted.
  const sungrowBaseUnits = Math.ceil(
    sungrowModularUnits / sungrowModel.modularUnitsPerBase
  );
  const sungrowRebates = sungrowSize * BRCNLF * BRCConstant * BRCValue;

  const sungrowCost =
    sungrowModularUnits * sungrowModel.modularUnitCost + // Cost of all modular units
    sungrowBaseUnits * sungrowModel.baseCost + // Cost of base units
    sungrowModel.initialInstallCost + // Initial installation cost
    (sungrowBaseUnits - 1) * sungrowModel.extraInstallCost + // Extra install cost for additional base units
    4000; //hybrid inverter price is hardcoded as example here but should be queried from inverter table according to solar system size
  const sungrowTotalCost = sungrowCost - sungrowRebates;

  // Yearly savings equals the minimum between export, import and the actual advised battery size * gains.
  // You cant save more than what you import, you cant save more than what you export and you cant save more than what your battery is capable of
  const sungrowYearlySavings =
    Math.min(optimalBatterySize, sungrowSize) *
    (energyPrice - feedInTariffBattery) *
    365;

  const sungrowPaybackPeriod = parseFloat(
    (sungrowTotalCost / sungrowYearlySavings).toFixed(1)
  );

  return {
    teslaCost,
    teslaRebates,
    teslaTotalCost,
    teslaYearlySavings,
    teslaPaybackPeriod,

    sungrowCost,
    sungrowRebates,
    sungrowTotalCost,
    sungrowYearlySavings,
    sungrowPaybackPeriod,
  };
};

export const generateAdvice = (billMonth, hasSolar, size) => {
  const energyAdvice = calculateAdvice(billMonth, hasSolar, size);
  const batterySizeAdvice = getBatterySizes(energyAdvice.optimalBatterySize);
  const batteryCosts = calculateBatteryCost(batterySizeAdvice, hasSolar);

  return {
    estimatedConsumption: `${energyAdvice.estimatedConsumption} kWh per day`,
    estimatedSelfConsumption: `${energyAdvice.estimatedSelfConsumption}%`,
    estimatedExport: `${energyAdvice.estimatedExport} kWh per day`,
    estimatedImport: `${energyAdvice.estimatedImport} kWh per day`,
    optimalBatterySize: `${energyAdvice.optimalBatterySize} kWh`,
    advisedBattery: {
      premium: {
        brand: hasSolar ? 'Tesla PW2' : 'Tesla PW3',
        size: `${batterySizeAdvice.teslaSize} kWh`,
        baseCost: `${parseFloat(batteryCosts.teslaCost.toFixed(2))} AUD`,
        rebates: `${parseFloat(batteryCosts.teslaRebates.toFixed(2))} AUD`,
        totalCost: `${parseFloat(batteryCosts.teslaTotalCost.toFixed(2))} AUD`,
        estimatedYearlySavings: `${parseFloat(
          batteryCosts.teslaYearlySavings.toFixed(2)
        )} AUD`,
        paybackPeriod: `${batteryCosts.teslaPaybackPeriod} years`, // Already rounded to 1 decimal
      },
      standard: {
        brand: 'Sungrow',
        size: `${batterySizeAdvice.sungrowSize} kWh`,
        baseCost: `${parseFloat(batteryCosts.sungrowCost.toFixed(2))} AUD`,
        rebates: `${parseFloat(batteryCosts.sungrowRebates.toFixed(2))} AUD`,
        totalCost: `${parseFloat(
          batteryCosts.sungrowTotalCost.toFixed(2)
        )} AUD`,
        estimatedYearlySavings: `${parseFloat(
          batteryCosts.sungrowYearlySavings.toFixed(2)
        )} AUD`,
        paybackPeriod: `${batteryCosts.sungrowPaybackPeriod} years`, // Already rounded to 1 decimal
      },
      default: batterySizeAdvice.default === 'tesla' ? 'premium' : 'standard',
    },
  };
};
