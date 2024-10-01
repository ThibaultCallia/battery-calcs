import React, { useState } from 'react';
import { Box, Button, Input, Text } from '@chakra-ui/react';

const BatteryForm = ({ setBill, setSize }) => {
  const [billInput, setBillInput] = useState(null);
  const [sizeInput, setSizeInput] = useState(null);
  const [daysInput, setDaysInput] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const monthlyBill = (billInput / daysInput) * 30;
    setBill(billInput);
    setSize(sizeInput);
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      maxW="md"
      mx="auto"
      mt={6}
    >
      <Text mb={2}>Enter your electricity bill (in $):</Text>
      <Input
        placeholder="Electricity Bill"
        value={billInput}
        onChange={(e) => setBillInput(e.target.value)}
        mb={4}
        type="number"
        required
      />
      <Text mb={2}>How many days:</Text>
      <Input
        placeholder="days"
        value={daysInput}
        onChange={(e) => setDaysInput(e.target.value)}
        mb={4}
        type="number"
        required
      />

      <Text mb={2}>Enter your solar system size (in kW):</Text>
      <Input
        placeholder="Solar System Size"
        value={sizeInput}
        onChange={(e) => setSizeInput(e.target.value)}
        mb={4}
        type="number"
        required
      />

      <Button type="submit" colorScheme="blue" width="full">
        Calculate
      </Button>
    </Box>
  );
};

export default BatteryForm;
