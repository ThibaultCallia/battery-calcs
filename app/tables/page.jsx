import { ChakraProvider } from '@chakra-ui/react';

import NavBar from '@/components/Navbar';
import TablesComp from '@/components/TablesComp';

export default function Tables() {
  return (
    <ChakraProvider>
      <main className="flex min-h-screen flex-col items-center justify-start">
        <NavBar />
        <TablesComp />
      </main>
    </ChakraProvider>
  );
}
