// Chakra imports
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import avatar5 from "../../assets/img/avatars/avatar5.png";
import React from "react";
import { LogoutIcon } from "components/Icons/Icons";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "redux/action";

function Profile() {
  const { colorMode } = useColorMode();
  const dispatch = useDispatch();

  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue(" #5eaba2", "white");
  const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
  const borderProfileColor = useColorModeValue("white", "transparent");
  const emailColor = useColorModeValue("gray.400", "gray.300");

  const handleLogout = () => {
    dispatch(userLogout());
  };

  return (
    <Flex direction='column' pt={["120px", "90px", "75px"]}>
      <Flex
        direction={{ sm: "column", md: "row" }}
        mb='24px'
        maxH='330px'
        justifyContent={{ sm: "center", md: "space-between" }}
        align='center'
        backdropFilter='blur(21px)'
        boxShadow='0px 2px 5.5px rgba(0, 0, 0, 0.02)'
        border='1.5px solid'
        borderColor={borderProfileColor}
        bg={bgProfile}
        p='24px'
        borderRadius='20px'
      >
        <Flex
          align='center'
          mb={{ sm: "10px", md: "0px" }}
          direction={{ sm: "column", md: "row" }}
          w={{ sm: "100%" }}
          textAlign={{ sm: "center", md: "start" }}
        >
          <Avatar
            me={{ md: "22px" }}
            src={avatar5}
            w='80px'
            h='80px'
            borderRadius='15px'
          />
          <Flex direction='column' maxWidth='100%' my={{ sm: "14px" }}>
            <Text
              fontSize={{ sm: "lg", lg: "xl" }}
              color={textColor}
              fontWeight='bold'
              ms={{ sm: "8px", md: "0px" }}
            >
              Alec Thompson
            </Text>
            <Text
              fontSize={{ sm: "sm", md: "md" }}
              color={emailColor}
              fontWeight='semibold'
            >
              alec@simmmple.com
            </Text>
          </Flex>
        </Flex>
        <Flex direction={{ sm: "column", lg: "row" }} w={{ sm: "100%", md: "50%", lg: "auto" }}>
          <Button p='0px' bg='transparent' variant='no-effects' onClick={handleLogout}>
            <Flex
              align='center'
              w={{ lg: "135px" }}
              borderRadius='15px'
              justifyContent='center'
              py='10px'
              cursor='pointer'
            >
              <Icon color={textColor} as={LogoutIcon} me='6px' />
              <Text fontSize='xs' color={textColor} fontWeight='bold'>
                LogOut
              </Text>
            </Flex>
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Profile;
