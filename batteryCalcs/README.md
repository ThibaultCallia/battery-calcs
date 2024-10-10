**Set up**

The functions file has the main calcs.

For simplicity, the google API fallback calculations for solar production are used (= 1kW installed equals 4kWh produced per day in Sydney). On the platform, the google input would be used if available.

Out of the reference table, certain variables are calculated (export, import, bill, ... ). These are compared to the user's input and closest match is used to advise on battery size.

**Files**

demo.js

    Logs two outputs of the demo

functions.js

    Given the bill and solar system size, the calculate advice function will return the estimated export, import, self consumption rate.

    These calculations are done based on a reference table representing the average self consumption rate of a family with X avg daily usage and Y solar system size.

    The optimal battery size is used to find the advised battery size - after which the costs are calculated.

referenceData.js

    GENERAL NOTE: The excel version of the tables should be used. The objects in the referenceData.js file are possibly older versions.

    EnergyData:
        energyPrice: /
        feedInTariff: Feed in tariff for exported energy
        supplyCharge: Daily supply charge of grid connection
        productionConservatism: A % conservatism we use in the Google API fallback calcs

    batteryRebatesData:
        BRCNLF: net loss factor (needed for rebate calc)
        BRCConstant: constant (needed for rebate calc)
        BRCValue: spot price of one rebate


    selfConsumptionArray:
        This 2D array represents the reference data we're using as a basis for the calcs.

    batterySizeTable:
        This is an object representing the reference table for optimal battery size vs advised size
        NOTE: in the shared excel a  more recent version has been created.

    self consumption jSON:
        Non-used JSON representing the same data
