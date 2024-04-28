import { Box, Button, Flex, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner } from "@chakra-ui/react"
import axios from "axios";
import AddButton from "components/AddButton/AddButton"
import CommonTable from "components/CommonTable"
import { useApi } from "network/api";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modelData } from "redux/action";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, cssTransition } from "react-toastify";
import { totalRowsCount } from "redux/action";
import { setTableinitialState } from "redux/action";
import { Field, Form, Formik } from "formik";
import { InputField } from "components/InputFiled";
import { modelEdit } from "redux/action";
import { modelDelete } from "redux/action";
import * as Yup from "yup";

const DeliveredOrders = () => {
    const { getApi, putApi } = useApi();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsReturnDialogOpen] = useState(false);
    const [btnDisable, setBtnDisable] = useState(false);

    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const putUrl = "/api/company/editCompany"
    const deleteUrl = "/api/company/deleteCompany"
    const selected = useSelector((state) => state.selected);
    const pagination = useSelector((state) => state.pagination);
    const [isFetch, setIsFetch] = useState(false);
    const model = {
        btnTitle: "Delivered Orders",
        page: "DeliveredOrders",
        fieldData: [
            {
                name: "Date",
                type: "date",
            },
            {
                name: "Order Id",
                type: "text",
            },
            {
                name: "Party",
                type: "text",
            },
            {
                name: "Design",
                type: "text",
            },
            {
                name: "Ground Color",
                type: "text",
            },
            {
                name: "Dispatch",
                type: "number",
            },
            {
                name: "Settle Pcs",
                type: "number",
            }
        ]
    }

    const fetchData = async () => {
        try {
            const url = `${process.env.REACT_APP_HOST}/api/order/getDeliveredOrder?limit=${pagination?.pageSize}&offset=${pagination?.currentPage - 1}`
            const response = await getApi(url);
            setData(response?.pageItems);
            setIsLoading(false);
            setIsFetch(false);
            dispatch(totalRowsCount(response?.total || 0));
        } catch (error) {
            setIsFetch(false);
            setIsError(true);
            setError(error);
        }
    };

    useEffect(() => {
        setIsFetch(false);
        if (isFetch == true) {
            fetchData();
        }
    }, [isFetch, selected.isEdit]);

    useEffect(() => {
        dispatch(setTableinitialState());
        dispatch(modelData(model));
    }, []);

    useEffect(() => {
        fetchData();
    }, [pagination?.currentPage, pagination?.pageSize]);
    const handleDialogClose = () => {
        setIsReturnDialogOpen(false);
    }
    const handleSubmit = (values, { setSubmitting }) => {
        setBtnDisable(true);
        try {
            const apiUrl = `${process.env.REACT_APP_HOST}/api/stock/editSareeStock/${selected.selectData?.user?.tokenId}/${selected.selectData?.user?.matchingId}`;
            let body = { ...values };

            let headers = {};
            // Make the callback function inside .then() async
            putApi(apiUrl, body, headers)
                .then(async (response) => {
                    // You can access the response data using apiOtpResponse in your component
                    toast.success(response?.message || "New Data ADD successful!");
                    dispatch(modelEdit(false));
                    dispatch(modelDelete(false));
                    setSubmitting(false);
                    handleDialogClose();
                    setBtnDisable(false);
                    setIsReturnDialogOpen(false);
                    fetchData();
                })
                .catch((error) => {
                    toast.error(error?.message || "Please Try After Sometime");
                    setBtnDisable(false);
                });

        } catch (error) {
            toast.error(error?.message || "Please Try After Sometime");
            setBtnDisable(false);
        }
    };
    const validationSchema = Yup.object().shape({
        returnPcs: Yup.number().required('Return Pieces is required').positive('Return Pieces must be a positive number'),
    });

    const initialValues = {
        returnPcs: "", // Initial value for pieces on machine
    };
    return (
        <Flex direction="column" pt={["120px", "75px", "90px"]}>
            {isLoading == true ?
                <Flex justifyContent="center" alignItems="center" textAlign="center" w="100%" mt={{ "xl": "40px", "sm": "10px" }}>
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
                </Flex>
                :
                <>
                    <Box mt="25px">
                        <CommonTable
                            data={data}
                            isLoading={isLoading}
                            isError={isError}
                            error={error}
                            page="DeliveredOrders"
                            tableTitle="Delivered Orders"
                            url={putUrl}
                            deleteUrl={deleteUrl}
                            setIsFetch={setIsFetch}
                            toast={toast}
                            setIsReturnDialogOpen={setIsReturnDialogOpen}
                        />
                    </Box>
                    <Modal isOpen={isDialogOpen} onClose={handleDialogClose} >
                        <ModalOverlay />
                        <ModalContent >
                            <ModalHeader>Process Data</ModalHeader>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                                enableReinitialize={true}
                            >
                                <Form>
                                    <ModalBody>
                                        <Flex direction="column" >
                                            <Box
                                                w={{
                                                    "2xl": "100%",
                                                    xl: "100%",
                                                    lg: "100%",
                                                    md: "100%",
                                                    sm: "100%",
                                                }}>
                                                <Field
                                                    name="returnPcs"
                                                    render={({ field, form }) => (
                                                        <InputField
                                                            name='returnPcs'
                                                            label='return PCS'
                                                            placeholder={`Enter return PCS`}
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
                                        <Button colorScheme='blue' type='submit' disabled={btnDisable}>Process Order</Button>
                                    </ModalFooter>
                                </Form>
                            </Formik>
                        </ModalContent>
                    </Modal>
                    <ToastContainer autoClose={2000} />
                </>
            }
        </Flex>
    )
}

export default DeliveredOrders