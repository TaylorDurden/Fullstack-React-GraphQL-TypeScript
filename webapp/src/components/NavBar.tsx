import { Box, Flex, Link } from '@chakra-ui/react';
import React from 'react'
import NextLink from "next/link";

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
  return (
    <Flex bg="tomato" p={4}>
      <Box ml='auto'>
        <NextLink href="/login">
          <Link color="white" mr={2}>Login</Link>
        </NextLink>
        <Link color="white" mr={2}>|</Link>
        <NextLink href="/register">
          <Link color="white">Register</Link>
        </NextLink>
      </Box>
    </Flex>
  );
}