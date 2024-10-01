'use client';

import React, { useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const CustomTable = ({ data, name }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const solarSizes = [...Array(20).keys()].map((i) => i + 2); // Solar sizes 2 to 21
  const dailyUsages = Object.keys(data); // Assuming data keys are daily usage values (5 to 101)

  // Toggle row selection
  const toggleRowSelection = (usage) => {
    setSelectedRows((prev) =>
      prev.includes(usage) ? prev.filter((r) => r !== usage) : [...prev, usage]
    );
  };

  // Toggle column selection
  const toggleColumnSelection = (size) => {
    setSelectedColumns((prev) =>
      prev.includes(size) ? prev.filter((c) => c !== size) : [...prev, size]
    );
  };

  return (
    <Box p={0}>
      <Box overflowX="auto" borderWidth="1px" maxH="500px" p={0}>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th fontSize="sm">{name}</Th>
              {solarSizes.map((size) => (
                <Th
                  key={size}
                  fontSize="sm"
                  cursor="pointer"
                  bg={selectedColumns.includes(size) ? 'blue.100' : 'white'}
                  onClick={() => toggleColumnSelection(size)}
                >
                  {size} kW
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {dailyUsages.map((usage) => (
              <Tr
                key={usage}
                cursor="pointer"
                bg={selectedRows.includes(usage) ? 'green.100' : 'white'}
                onClick={() => toggleRowSelection(usage)}
              >
                <Td fontSize="sm">{usage} kWh</Td>
                {solarSizes.map((size) => (
                  <Td
                    key={size}
                    fontSize="sm"
                    bg={
                      selectedRows.includes(usage) ||
                      selectedColumns.includes(size)
                        ? 'yellow.100'
                        : 'white'
                    }
                  >
                    {data[usage][size]}%
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default CustomTable;
