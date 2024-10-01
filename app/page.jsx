import { ChakraProvider } from '@chakra-ui/react';
import NavBar from '@/components/Navbar';
import BatteryCalculator from '@/components/BatteryCalculator';

export default function Home() {
  return (
    <ChakraProvider>
      <main className="flex min-h-screen flex-col items-center justify-start">
        <NavBar />
        <BatteryCalculator />
      </main>
    </ChakraProvider>
  );
}
