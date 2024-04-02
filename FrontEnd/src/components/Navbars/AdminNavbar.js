import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Link,
  Stack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArgonLogoDark, ArgonLogoLight, ChakraLogoDark, ChakraLogoLight } from "components/Icons/Icons";
import AdminNavbarLinks from "./AdminNavbarLinks";
import { SidebarResponsive } from "components/Sidebar/Sidebar";
import DashboardRoutes from "DashboardRoutes.js";


export default function AdminNavbar(props) {
  const [scrolled, setScrolled] = useState(false);
  const { colorMode } = useColorMode();
  const routes = DashboardRoutes();
  useEffect(() => {
    const changeNavbar = () => {
      if (window.scrollY > 1) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", changeNavbar);

    return () => {
      window.removeEventListener("scroll", changeNavbar);
    };
  }, []); // Pass an empty dependency array to ensure this effect runs once

  const {
    variant,
    children,
    fixed,
    secondary,
    brandText,
    onOpen,
    ...rest
  } = props;

  let mainText = fixed && scrolled
    ? useColorModeValue("gray.700", "gray.200")
    : useColorModeValue("white", "gray.200");
  let secondaryText = fixed && scrolled
    ? useColorModeValue("gray.700", "gray.200")
    : useColorModeValue("white", "gray.200");
  let navbarPosition = "absolute";
  let navbarFilter = "none";
  let navbarBackdrop = "none";
  let navbarShadow = "none";
  let navbarBg = "none";
  let navbarBorder = "transparent";
  let secondaryMargin = "0px";
  let smLeft = window.innerWidth > 768 ? '' : '4px'
  let smRight = window.innerWidth > 768 ? '30px' : '0px'

  let paddingX = "15px";
  if (props.fixed === true && scrolled === true) {
    navbarPosition = "fixed";
    navbarShadow = useColorModeValue(
      "0px 7px 23px rgba(0, 0, 0, 0.05)",
      "none"
    );
    navbarBg = useColorModeValue(
      "linear-gradient(112.83deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.8) 110.84%)",
      "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
    );
    navbarBorder = useColorModeValue("#FFFFFF", "rgba(255, 255, 255, 0.31)");
    navbarFilter = useColorModeValue(
      "none",
      "drop-shadow(0px 7px 23px rgba(0, 0, 0, 0.05))"
    );
  }
  if (props.secondary) {
    navbarBackdrop = "none";
    navbarPosition = "absolute";
    mainText = "white";
    secondaryText = "white";
    secondaryMargin = "22px";
    if (window.innerWidth > 768) {
      paddingX = "30px";
    } else if (window.innerWidth > 450 && window.innerWidth <= 768) {
      paddingX = "16px";
    } else {
      paddingX = "10px";
    }
  }

  return (
    <Flex
      position={navbarPosition}
      boxShadow={navbarShadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      borderWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration="0.25s, 0.25s, 0.25s, 0s"
      transitionProperty="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={{ xl: "center" }}
      borderRadius="16px"
      display="flex"
      minH="75px"
      justifyContent={{ xl: "center" }}
      lineHeight="25.6px"
      mx="auto"
      mt={secondaryMargin}
      pb="8px"
      left={smLeft}
      right={smRight}
      px={{
        sm: paddingX,
        md: "30px",
        xl: '30px'
      }}
      ps={{
        xl: "12px",
      }}
      pt="8px"
      top={{
        sm: "0px",
        md: "18px",
        xl: '18px'
      }}
      w={{ sm: "calc(100vw - 8px)", xl: "calc(100vw - 75px - 250px)" }}
    >
      <Flex
        w="100%"
        flexDirection={{
          sm: "row",
          md: "row",
        }}
        alignItems={{ xl: "center" }}
      >
        <Box mb={{ sm: "0px", md: "0px" }}
          fontSize={{
            xl: "1.8rem",
            lg: "1.4rem",
            md: "1.2rem",
            sm: "1rem",
          }}
          display="flex"
          gap="10px"
          alignItems="center"
        >
          <SidebarResponsive
            hamburgerColor={"white"}
            logo={
              <Stack direction='row' spacing='12px' align='center' justify='center'>
                {colorMode === "dark" ? (
                  <ArgonLogoLight w='74px' h='27px' />
                ) : (
                  <ArgonLogoDark w='74px' h='27px' />
                )}
                <Box
                  w='1px'
                  h='20px'
                  bg={colorMode === "dark" ? "white" : "gray.700"}
                />
                {colorMode === "dark" ? (
                  <ChakraLogoLight w='82px' h='21px' />
                ) : (
                  <ChakraLogoDark w='82px' h='21px' />
                )}
              </Stack>
            }
            colorMode={colorMode}
            secondary={props.secondary}
            routes={routes}
            {...rest}
          />
          {brandText}
        </Box>
        <Box ms="auto"
          height="100%"
          alignItems="center"
          display="flex"
        >
          <AdminNavbarLinks
            onOpen={props.onOpen}
            logoText={props.logoText}
            secondary={props.secondary}
            fixed={props.fixed}
            scrolled={scrolled}
          />
        </Box>
      </Flex>
    </Flex>
  );
}
