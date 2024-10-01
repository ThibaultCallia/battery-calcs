import { Box, Flex, HStack, Link, Image } from '@chakra-ui/react';

const NavBar = () => {
  return (
    <Box bg="gray.500" px={4} width="100vw">
      <Flex h={16} alignItems="center" justifyContent={'space-between'}>
        <Box>
          <Image src="/28Watt-logo.svg" alt="Company Logo" height={12} />
        </Box>
        <HStack as="nav" spacing={4}>
          <Link href="/" color="white">
            battery Dashboard
          </Link>
          <Link href="/tables" color="white">
            Tables
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default NavBar;
