import { Box, Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React from 'react'
import { InputField, InputSelectBox } from 'components/InputFiled';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { modelEdit } from 'redux/action';
import { modelDelete } from 'redux/action';
import { ToastContainer, toast, cssTransition } from "react-toastify";
import { useApi } from 'network/api';
import { InputDateField } from 'components/InputFiled';
function CommonModal({ isDialogOpen, setIsDialogOpen, url, setIsFetch }) {
    const { getApi, postApi, putApi } = useApi();
    const [userData, setUserData] = useState(null); // Local state to store user data
    const [btnDisable, setBtnDisable] = useState(false);
    const modelData = useSelector((state) => state.user.modelData);
    const selected = useSelector((state) => state.selected);
    const dispatch = useDispatch();
    useEffect(() => {
        setUserData(modelData);
    }, [modelData]);

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        dispatch(modelEdit(false));
        dispatch(modelDelete(false));
    };

    if (!Array.isArray(userData?.fieldData) || userData?.fieldData.length === 0) {
        return null; // If userData?.fieldData is not an array or is empty, don't render anything
    }

    // Dynamically create validation schema based on userData?.fieldData
    const validationSchema = Yup.object().shape(
        userData?.fieldData.reduce((acc, field) => {
            if (field?.name === "Mobile" || field?.name === "Phone Number" && field?.name !== "Password" && field?.name !== "Email") {
                acc[field.name.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('')] = Yup.string()
                    .matches(/^[0-9]{10}$/, 'Invalid phone number') // Basic phone number regex
                    .required('A phone number is required');
            } else if (field?.name === "Password" && field?.name !== "Email") {
                acc[field.name.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('')] = Yup.string()
                    .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{8,}$/, 'Password must contain at least one uppercase letter, one number, and one special character')
                    .required(`${field.name} is required`);
            } else if (field?.name === "Email") {
                acc[field.name.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('')] = Yup.string()
                    .matches(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, 'Invalid email format') // Email validation using Yup's email method
                    .required('An email address is required');
            } else {
                acc[field.name.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('')] = Yup.string().required(`${field.name} is required`);
            }
            return acc;
        }, {})
    );

    // Create initialValues object based on userData?.fieldData
    const initialValues = userData?.fieldData.reduce((acc, field) => {
        if (field?.name) {
            acc[field.name.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('')] = selected.isEdit ? selected?.selectData?.user?.[field.name.split(' ')?.map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('').replace(/(\([^)]*\))/g, '')] || '' : '';
        }
        return acc;
    }, {});
    function optimizeKeys(obj) {
        let newObj = {};
        for (let key in obj) {
            let optimizedKey = key.replace(/\([^)]*\)/g, '').trim();
            newObj[optimizedKey] = obj[key];
        }
        return newObj;
    }
    const handleSubmit = (values, { setSubmitting }) => {
        setBtnDisable(true);
        // Handle form submission logic here
        if (modelData?.page === "StockYarn") {
            url = "/api/yarnSales/createYarnSales";
        }
        try {
            const apiUrl = `${process.env.REACT_APP_HOST}${url}`;
            let body = { ...values };
            if (modelData?.page === "Editmatching") {

                body = optimizeKeys(body);
                body.name = selected?.parentSelectedData?.user?.name;
                body.pick = selected?.parentSelectedData?.user?.pick;
                body.ground = body?.[`f${selected?.parentSelectedData?.user?.ground}`];
                body.pallu = body?.[`f${selected?.parentSelectedData?.user?.pallu}`];
                body.feeder = selected?.parentSelectedData?.user?.feeder;
            }
            let headers = {};
            // Make the callback function inside .then() async
            if (url == "/api/user/signUp") {
                headers = {
                    'Content-type': 'application/json',
                    'Access_token': process.env.REACT_APP_MASTER_KEY
                };
            }

            if (!selected.isEdit || modelData?.page === "StockYarn") {
                postApi(apiUrl, body, headers)
                    .then(async (response) => {
                        // You can access the response data using apiOtpResponse in your component
                        toast.success(response?.message || "New Data ADD successful!");
                        dispatch(modelEdit(false));
                        dispatch(modelDelete(false));
                        setSubmitting(false);
                        handleDialogClose();
                        setIsFetch(true);
                        setBtnDisable(false);
                    })
                    .catch((error) => {
                        toast.error(error?.message || "Please Try After Sometime");
                        setBtnDisable(false);
                    });
            } else {
                putApi(`${apiUrl}/${selected.selectData.user.tokenId}`, body, headers)
                    .then(async (response) => {
                        // You can access the response data using apiOtpResponse in your component
                        toast.success(response?.message || "Data Update successful!");
                        dispatch(modelEdit(false));
                        dispatch(modelDelete(false));
                        setSubmitting(false);
                        handleDialogClose();
                        setIsFetch(true);
                        setBtnDisable(false);
                    })
                    .catch((error) => {
                        toast.error(error?.message || "Please Try After Sometime");
                        setBtnDisable(false);
                    });
            }
        } catch (error) {
            toast.error(error?.message || "Please Try After Sometime");
            setBtnDisable(false);
        }
    };
    const isSaleOrPurchaseYarn = modelData?.page === "SaleYarn" || modelData?.page === "PurchaseYarn" || modelData?.page === "StockYarn";


    return (
        <Modal isOpen={isDialogOpen} onClose={handleDialogClose} size={modelData?.page === "SaleYarn" || modelData?.page === "PurchaseYarn" || modelData?.page === "StockYarn" ? "xl" : "md"}>
            <ModalOverlay />
            <ModalContent >
                <ModalHeader>{userData?.btnTitle}</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                >
                    <Form>
                        <ModalBody>
                            <Flex direction={modelData?.page === "SaleYarn" || modelData?.page === "PurchaseYarn" || modelData?.page === "StockYarn" ? "row" : "column"} flexWrap="wrap" >
                                {modelData?.fieldData.map((fieldData, index) => (
                                    fieldData.type == 'date' ?
                                        <Box
                                            mr={{
                                                "2xl": "5px",
                                                xl: "5px",
                                                lg: "4.5px",
                                                md: "4px",
                                                sm: "0px",
                                            }}
                                            w={{
                                                "2xl": isSaleOrPurchaseYarn ? "49%" : "100%",
                                                xl: isSaleOrPurchaseYarn ? "49%" : "100%",
                                                lg: isSaleOrPurchaseYarn ? "49%" : "100%",
                                                md: isSaleOrPurchaseYarn ? "49%" : "100%",
                                                sm: "100%",
                                            }}>
                                            <Field
                                                name={fieldData.name?.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('')}
                                                render={({ field, form }) => (
                                                    <InputDateField
                                                        name={fieldData.name?.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('')}
                                                        label={fieldData.name}
                                                        placeholder={`Enter ${fieldData.name}`}
                                                        form={form}
                                                        field={field}
                                                    />
                                                )}
                                            />
                                        </Box> :
                                        fieldData.type !== 'select' ? (
                                            <Box
                                                mr={{
                                                    "2xl": "5px",
                                                    xl: "5px",
                                                    lg: "4.5px",
                                                    md: "4px",
                                                    sm: "0px",
                                                }}
                                                w={{
                                                    "2xl": isSaleOrPurchaseYarn ? "49%" : "100%",
                                                    xl: isSaleOrPurchaseYarn ? "49%" : "100%",
                                                    lg: isSaleOrPurchaseYarn ? "49%" : "100%",
                                                    md: isSaleOrPurchaseYarn ? "49%" : "100%",
                                                    sm: "100%",
                                                }}>
                                                <Field
                                                    name={fieldData.name?.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('')}
                                                    render={({ field, form }) => (
                                                        <InputField
                                                            name={fieldData.name?.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('')}
                                                            label={fieldData.name}
                                                            placeholder={`Enter ${fieldData.name}`}
                                                            form={form}
                                                            field={field}
                                                            type={fieldData.type}
                                                            disabled={fieldData.disabled || false}
                                                        />
                                                    )}
                                                />
                                            </Box>
                                        ) : fieldData.type === 'select' ? (
                                            <Box
                                                mr={{
                                                    "2xl": "5px",
                                                    xl: "5px",
                                                    lg: "4.5px",
                                                    md: "4px",
                                                    sm: "0px",
                                                }}
                                                w={{
                                                    "2xl": isSaleOrPurchaseYarn ? "49%" : "100%",
                                                    xl: isSaleOrPurchaseYarn ? "49%" : "100%",
                                                    lg: isSaleOrPurchaseYarn ? "49%" : "100%",
                                                    md: isSaleOrPurchaseYarn ? "49%" : "100%",
                                                    sm: "100%",
                                                }}>
                                                <Field
                                                    name={fieldData.name?.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('')}
                                                    render={({ field, form }) => (
                                                        <InputSelectBox
                                                            name={fieldData.name?.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('')}
                                                            label={fieldData.name}
                                                            placeholder={`Enter ${fieldData.name}`}
                                                            form={form}
                                                            options={fieldData.option}
                                                            field={field}
                                                            disabled={fieldData.disabled || false}
                                                            isManual={fieldData.isManual || false}
                                                            handleSelectChange={fieldData.handleSelectChange || ''}
                                                        />
                                                    )}
                                                />
                                            </Box>
                                        ) : null
                                ))}
                            </Flex>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='gray' mr={3} onClick={handleDialogClose}>
                                Close
                            </Button>
                            {
                                selected.isEdit ?
                                    <Button colorScheme='blue' type='submit' disabled={btnDisable}>{modelData?.page == "StockYarn" ? "Sale" : "Edit"}</Button>
                                    :
                                    <Button colorScheme='blue' type='submit' disabled={btnDisable}>{userData?.btnTitle}</Button>
                            }
                        </ModalFooter>
                    </Form>
                </Formik>
            </ModalContent>
        </Modal>
    )
}

export default CommonModal