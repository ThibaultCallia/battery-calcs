'use client';

import React, { useState } from 'react';
import BatteryForm from './BatteryForm';
import BatteryResults from './BatteryResults';

const BatteryCalculator = () => {
  const [bill, setBill] = useState(null);
  const [size, setSize] = useState(null);

  return (
    <>
      <BatteryForm setBill={setBill} setSize={setSize} />
      {bill && size && <BatteryResults size={size} bill={bill} />}
    </>
  );
};

export default BatteryCalculator;
