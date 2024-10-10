import { generateAdvice } from './functions.js';

// Example of monthly bill of 200, does not have solar and solar advise calculated by 28W platform is 10 kW system)
console.log(generateAdvice(200, true, 10));

// Example of monthly bill of 200, has solar of 10 kW system

console.log(generateAdvice(200, false, 6));
