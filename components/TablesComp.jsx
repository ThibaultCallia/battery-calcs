import React from 'react';
import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import data from '@/data.json';
import CustomTable from './CustomTable';

const TablesComp = () => {
  const { selfConsumptionTable } = data;

  return (
    <Box maxW="8xl" mx="auto" p={4}>
      <Heading as="h2" size="lg" mb={4}>
        Energy Data Tables
      </Heading>

      {/* Use SimpleGrid to place two tables side by side */}
      <SimpleGrid columns={[1, 2]} spacing={10}>
        {/* Self-Consumption Table */}
        <Box>
          <Heading as="h3" size="md" mb={2}>
            Self Consumption
          </Heading>
          <CustomTable data={selfConsumptionTable} name={'self consumption'} />
        </Box>

        {/* Bill Table */}
        <Box>
          <Heading as="h3" size="md" mb={2}>
            Bill
          </Heading>
          <CustomTable data={selfConsumptionTable} name={'Monthly bill'} />
        </Box>

        {/* Export Table */}
        <Box>
          <Heading as="h3" size="md" mb={2}>
            Export
          </Heading>
          <CustomTable data={selfConsumptionTable} name={'export'} />
        </Box>

        {/* Import Table */}
        <Box>
          <Heading as="h3" size="md" mb={4}>
            Import
          </Heading>
          <CustomTable data={selfConsumptionTable} name={'import'} />
        </Box>

        {/* Battery Table */}
        <Box>
          <Heading as="h3" size="md" mb={4}>
            Battery
          </Heading>
          <CustomTable data={selfConsumptionTable} name={'battery'} />
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default TablesComp;
