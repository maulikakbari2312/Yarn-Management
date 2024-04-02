// Chakra imports
import {
  Box,
  Button,
  Flex,
  HStack,
  Link, Stack, Text, useColorMode, useColorModeValue
} from "@chakra-ui/react";
import {
  ArgonLogoLight,
  ChakraLogoBlue,
} from "components/Icons/Icons";
import React from "react";
export default function AuthNavbar(props) {
  const { logo, logoText, secondary, ...rest } = props;
  // Chakra color mode
  let mainText = "white";
  let navbarBg = "none";
  let navbarBorder = "none";
  let navbarShadow = "initial";
  let navbarFilter = "initial";
  let navbarBackdrop = "none";
  let navbarPosition = "absolute";
  let hamburgerColor = {
    base: useColorModeValue("gray.700", "white"),
    md: "white",
  };
  let brand = (
    <Link
      href={`${process.env.PUBLIC_URL}/#/`}
      target="_blank"
      display="flex"
      lineHeight="100%"
      fontWeight="bold"
      justifyContent="center"
      alignItems="center"
      color={mainText}
    >
      <Stack direction="row" spacing="12px" align="center" justify="center">
        <ArgonLogoLight w="74px" h="27px" />
        <Box w="1px" h="20px" bg={"white"} />
        <ChakraLogoBlue w="82px" h="21px" />
      </Stack>
      <Text fontSize="sm" mt="3px">
        {logoText}
      </Text>
    </Link>
  );
  hamburgerColor = { base: "white" };

  return (
    <Flex
      position={navbarPosition}
      top="16px"
      left="50%"
      transform="translate(-50%, 0px)"
      background={navbarBg}
      border={navbarBorder}
      boxShadow={navbarShadow}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      borderRadius="15px"
      px="16px"
      py="22px"
      mx="auto"
      width="1044px"
      maxW="90%"
      alignItems="center"
      zIndex="3"
    >
      <Flex w="100%" justifyContent={{ sm: "start", lg: "space-between" }}>
        {brand}
      </Flex>
    </Flex>
  );
}
