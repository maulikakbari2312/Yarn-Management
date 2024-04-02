import React from "react";
// Chakra imports
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import signInImage from "../../assets/img/signInImage.png";
import { InputField } from "components/InputFiled";
import ParticleComponent from "assets/particles/ParticleComponent";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { userLogin } from "redux/action";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, cssTransition } from "react-toastify";
import { userRole } from "redux/action";
import Cookies from 'js-cookie';
import { useApi } from "network/api";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

function SignIn() {
  const { postApi } = useApi();

  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const bgForm = useColorModeValue("white", "navy.800");
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
  };

  return (
    <Flex position='relative' mb='40px'>
      <Flex
        minH={{ xl: '100vh', lg: '600px', md: "600px", sm: "500px" }}
        h={{ sm: "100vh", md: "100vh", lg: "100vh" }}
        w='100%'
        maxW='1044px'
        mx='auto'
        justifyContent='space-between'
        mb='30px'
        pt={{ md: "0px" }}>
        <Flex
          w='100%'
          h='100%'
          alignItems='center'
          justifyContent='center'
          mb='60px'
          mt={{ base: "50px", md: "20px" }}>
          <Flex
            zIndex='2'
            direction='column'
            w='445px'
            background='transparent'
            borderRadius='15px'
            p='40px'
            mx={{ base: "100px" }}
            m={{ base: "20px", md: "auto" }}
            bg={bgForm}
            boxShadow={useColorModeValue(
              "0px 5px 14px rgba(0, 0, 0, 0.05)",
              "unset"
            )}>
            <Text
              fontSize='xl'
              color={textColor}
              fontWeight='bold'
              textAlign='center'
              mb='22px'>
              Login
            </Text>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                try {
                  const apiUrl = `${process.env.REACT_APP_HOST}/api/user/logIn`;
                  const body = { ...values };

                  // Make the callback function inside .then() async
                  postApi(apiUrl, body, {})
                    .then(async (response) => {
                      // Cookies.set('user', JSON.stringify(response));
                      // Cookies.set('token', response.token);
                      // Cookies.set('isAdmin', response.isAdmin);
                      localStorage.setItem('user', JSON.stringify(response));
                      localStorage.setItem('token', response.token);
                      localStorage.setItem('isAdmin', response.isAdmin);
                      toast.success(response?.message || "Login successful!");
                      dispatch(userLogin());
                      dispatch(userRole(response?.isAdmin));
                    })
                    .catch((error) => {
                      toast.error(error?.message || "Please Try After Sometime");
                    });
                } catch (error) {
                  toast.error(error?.message || "Please Try After Sometime");
                }
                setSubmitting(false);
              }}
            >
              <Form>
                <Field
                  name="email"
                  render={({ field, form }) => (
                    <InputField
                      name="email"
                      label="Email"
                      placeholder="Enter Email"
                      form={form}
                      field={field}
                    />
                  )}
                />

                <Field
                  name="password"
                  render={({ field, form }) => (
                    <InputField
                      name="password"
                      label="Password"
                      placeholder="Your password"
                      inputType="password"
                      form={form}
                      field={field}
                      type="password"
                    />
                  )}
                />
                <Button
                  type="submit"
                  fontSize='16px'
                  variant='dark'
                  fontWeight='bold'
                  w='100%'
                  h='45'
                  mt="6px"
                  mb='24px'>
                  SING IN
                </Button>
              </Form>
            </Formik>
          </Flex>
        </Flex>
        <Box
          overflowX='hidden'
          h='100%'
          w='100%'
          left='0px'
          position='absolute'
          bgRepeat="no-repeat"
          bgSize="cover"
          bgImage={signInImage}>
          <Box
            w='100%'
            h='100%'
            bgSize='cover'
            bg='blue.600'
            opacity='0.8'>
            <ParticleComponent particals={80} />
          </Box>
        </Box>
      </Flex>
      <ToastContainer autoClose={2000} />
    </Flex>
  );
}

export default SignIn;
