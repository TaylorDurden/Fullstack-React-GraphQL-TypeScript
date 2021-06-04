import { Box, Flex, Link, } from '@chakra-ui/react';
import React from 'react'
import NextLink from "next/link";
import { useMeQuery } from '../generated/graphql';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
  const [{ data, fetching }] = useMeQuery();
  let body = null;

  // data is fetching
  if (fetching) {
    // user not logged in
  }
  else if (!data?.me) {
    // user is not logged in
    body = (
      <>
        <NextLink href="/login">
          <Link color="white" mr={2}>Login</Link>
        </NextLink>
        <Link color="white" mr={2}>|</Link>
        <NextLink href="/register">
          <Link color="white">Register</Link>
        </NextLink>
      </>
    );
  }
  else {
    body = (
      <Box>{data.me.username}</Box>
    );
  }

  return (
    <Flex bg="tomato" p={4}>
      <Box ml='auto'>
        {body}
      </Box>
    </Flex>
  );
}