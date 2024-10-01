import React from 'react';
import { Box, Text, Stack } from '@chakra-ui/react';
import { calculateAdvice } from '@/batteryCalcs/functions';

const BatteryResults = ({ bill, size }) => {
  const {
    estimatedConsumption,
    estimatedSelfConsumption,
    estimatedExport,
    estimatedImport,
    suggestedBatterySize,
    batteryCost,
    roi,
  } = calculateAdvice(bill, size);

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      maxW="md"
      mx="auto"
      mt={8}
      bg="gray.100"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Battery Calculation Results
      </Text>
      <Stack spacing={3}>
        <Text>
          <strong>Estimated Self-Consumption:</strong>{' '}
          {estimatedSelfConsumption}
        </Text>
        <Text>
          <strong>Estimated Consumption:</strong> {estimatedConsumption}
        </Text>
        <Text>
          <strong>Estimated Export:</strong> {estimatedExport}
        </Text>
        <Text>
          <strong>Estimated Import:</strong> {estimatedImport}
        </Text>
        <Text>
          <strong>Suggested Battery Size:</strong> {suggestedBatterySize}
        </Text>
        <Text>
          <strong>Battery Cost:</strong> {batteryCost}
        </Text>
        <Text>
          <strong>Return on Investment (ROI):</strong> {roi}
        </Text>
      </Stack>
    </Box>
  );
};

export default BatteryResults;
