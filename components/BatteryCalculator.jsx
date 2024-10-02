'use client';

import React, { useState } from 'react';
import BatteryForm from './BatteryForm';
import BatteryResults from './BatteryResults';

const BatteryCalculator = () => {
  const [bill, setBill] = useState(null);
  const [size, setSize] = useState(null);
  const [days, setDays] = useState(null);

  return (
    <>
      <BatteryForm setBill={setBill} setSize={setSize} setDays={setDays} />
      {bill && size && <BatteryResults size={size} bill={bill} days={days} />}
    </>
  );
};

export default BatteryCalculator;
