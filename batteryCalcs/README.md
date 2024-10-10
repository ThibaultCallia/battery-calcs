**Set up**

The functions file has the main calcs.

For simplicity, the google API fallback calculations for solar production are used (= 1kW installed equals 4kWh produced per day in Sydney). On the platform, the google input would be used if available.

Out of the reference table, certain variables are calculated (export, import, bill, ... ). These are compared to the user's input and closest match is used to advise on battery size.

**Files**

functions.js

    Given the bill, period of bill (number of days) and solar system size, the calculate advice function will return the estimated export, import, self consumption rate. The period of bill is purely added for us to use in this demo platform - to test out cases and verify real examples.

    These calculations are done based on a reference table representing the average self consumption rate of a family with X avg daily usage and Y solar system size.

    These variables are needed to calculate the advised battery size. For now the battery size is the min between the export and import. This will be fine-tuned soon.

    The cost of the battery - and thus the ROI of the advised setup - will also follow but is a result of the advised battery size.

referenceData.js

    EnergyData:
        energyPrice: /
        feedInTariff: Feed in tariff for exported energy
        supplyCharge: Daily supply charge of grid connection
        productionConservatism: A % conservatism we use in the Google API fallback calcs

    selfConsumptionArray:
        This 2D array represents the reference data we're using as a basis for the calcs.

    self consumption jSON:
        Non-used JSON representing the same data
