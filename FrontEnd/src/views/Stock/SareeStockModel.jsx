import React from 'react'
import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useColorMode, useColorModeValue, Spinner } from "@chakra-ui/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { InputField } from "components/InputFiled";
import { modelEdit } from "redux/action";
import { modelDelete } from "redux/action";
import { InputSelectBox } from "components/InputFiled";
import { useDispatch, useSelector } from 'react-redux';
import { useApi } from 'network/api';
function SareeStockModel({ setIsSareeSaleDialogOpen, isSareeSaleDialogOpen, setIsFetch, fetchData, party, toast }) {
    const { postApi } = useApi();
    const dispatch = useDispatch();
    const selected = useSelector((state) => state.selected);

    const handleDialogClose = () => {
        setIsSareeSaleDialogOpen(false);
    }
    const handleSubmit = (values, { setSubmitting }) => {
        try {
            const headers = {};
            const apiUrl = `${process.env.REACT_APP_HOST}/api/stock/saleSareeStock`;
            postApi(`${apiUrl}/${selected?.selectData?.user?.tokenId}/${selected?.selectData?.user?.matchingId}`, values, headers)
                .then(async (response) => {
                    // You can access the response data using apiOtpResponse in your component
                    toast.success(response?.message || "Data Deleted successful!");
                    dispatch(modelEdit(false));
                    dispatch(modelDelete(false));
                    setIsSareeSaleDialogOpen(false);
                    setIsFetch(true);
                    setSubmitting(false);
                    fetchData();
                })
                .catch((error) => {
                    toast.error(error?.message || "Please Try After Sometime");
                });
        } catch (error) {
            toast.error(error?.message || "Please Try After Sometime");
        }
        setIsSareeSaleDialogOpen(false);
    }
    const validationSchema = Yup.object().shape({
        party: Yup.string().required('Party is required'),
        design: Yup.string().required('Design is required'),
        pallu: Yup.string().required('Pallu is required'),
        groundColor: Yup.string().required('Ground Color is required'),
        stock: Yup.string().required('Stock is required'),
    });

    const initialValues = {
        party: "", // Initial value for color
        design: selected.isEdit ? selected?.selectData?.user?.design || '' : "", // Initial value for item number
        pallu: selected.isEdit ? selected?.selectData?.user?.pallu || '' : "", // Initial value for item number
        groundColor: selected.isEdit ? selected?.selectData?.user?.groundColor || '' : "", // Initial value for item number
        stock: "", // Initial value for item number
    };
    return (

        <Modal isOpen={isSareeSaleDialogOpen} onClose={handleDialogClose} >
            <ModalOverlay />
            <ModalContent >
                <ModalHeader>Sale Saree Stock</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                >
                    <Form>
                        <ModalBody>
                            <Flex direction="column">
                                <Box>
                                    <Field
                                        name="party"
                                        render={({ field, form }) => (
                                            <InputSelectBox
                                                name='party'
                                                label='Party'
                                                placeholder={`Enter Party`}
                                                form={form}
                                                field={field}
                                                options={party}
                                            />
                                        )}
                                    />
                                </Box>
                                <Box>
                                    <Field
                                        name="design"
                                        render={({ field, form }) => (
                                            <InputField
                                                name='design'
                                                label='Design'
                                                placeholder='Design'
                                                form={form}
                                                field={field}
                                                type='text'
                                                disabled={true}
                                            />
                                        )}
                                    />
                                </Box>
                                <Box>
                                    <Field
                                        name="pallu"
                                        render={({ field, form }) => (
                                            <InputField
                                                name='pallu'
                                                label='Pallu'
                                                placeholder='Pallu'
                                                form={form}
                                                field={field}
                                                type='text'
                                                disabled={true}
                                            />
                                        )}
                                    />
                                </Box>
                                <Box>
                                    <Field
                                        name="groundColor"
                                        render={({ field, form }) => (
                                            <InputField
                                                name='groundColor'
                                                label='Ground Color'
                                                placeholder='Ground Color'
                                                form={form}
                                                field={field}
                                                type='text'
                                                disabled={true}
                                            />
                                        )}
                                    />
                                </Box>
                                <Box>
                                    <Field
                                        name="stock"
                                        render={({ field, form }) => (
                                            <InputField
                                                name='stock'
                                                label='Stock'
                                                placeholder='Stock'
                                                form={form}
                                                field={field}
                                                type='number'
                                            />
                                        )}
                                    />
                                </Box>
                            </Flex>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='gray' mr={3} onClick={handleDialogClose}>
                                Close
                            </Button>
                            <Button colorScheme='blue' type='submit'>submit</Button>
                        </ModalFooter>
                    </Form>
                </Formik>
            </ModalContent>
        </Modal>
    )
}

export default SareeStockModel