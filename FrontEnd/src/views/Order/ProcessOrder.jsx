import { Box, Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner } from '@chakra-ui/react';
import * as Yup from 'yup';
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
import { modelEdit } from 'redux/action';
import { InputField } from 'components/InputFiled';
import { Field, Form, Formik } from 'formik';
const ProcessOrder = () => {
    const { getApi, putApi } = useApi();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const postUrl = "/api/order/makeOrderComplete"
    const deleteUrl = "/api/order/deleteProcessOrder"
    const selected = useSelector((state) => state.selected);
    const pagination = useSelector((state) => state.pagination);
    const [isFetch, setIsFetch] = useState(false);
    const [isDialogOpen, setIsDialogOpenProcess] = useState(false);
    const [btnDisable, setBtnDisable] = useState(false);
    const model = {
        btnTitle: "Process Order",
        page: "ProcessOrder",
        fieldData: [
            {
                name: "Date",
                type: "date",
            },
            {
                name: "Order No",
                type: "text",
            },
            {
                name: "Machine No",
                type: "number",
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
                name: "Pcs On Machine",
                type: "number",
            },
        ]
    }

    const fetchData = async () => {
        try {
            const url = `${process.env.REACT_APP_HOST}/api/order/getAllProcessOrder?limit=${pagination?.pageSize}&offset=${pagination?.currentPage - 1}`
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
        if (isFetch == true) {
            setIsFetch(false);
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
        setIsDialogOpenProcess(false);
    }
    const initialValues = {
        pcsOnMachine: selected?.isEdit ? selected?.selectData?.user?.pcsOnMachine : ''
    }
    const validationSchema = Yup.object().shape({
        pcsOnMachine: Yup.string().required('Pcs On Machine is required'),
    });
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
        try {
            const body = optimizeKeys(values);
            let headers = {};
            // Make the callback function inside .then() async

            putApi(`${process.env.REACT_APP_HOST}/api/order/editProcessOrder/${selected?.selectData?.user?.orderId}/${selected?.selectData?.user?.tokenId}/${selected?.selectData?.user?.machineId}`, body, headers)
                .then(async (response) => {
                    // You can access the response data using apiOtpResponse in your component
                    toast.success(response?.message || "Data Update successful!");
                    setSubmitting(false);
                    setBtnDisable(false);
                    dispatch(modelEdit(false));
                    setIsDialogOpenProcess(false);
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
    }
    return (
        <Flex direction="column" pt={["120px", "75px", "90px"]} className="ProcessOrder-wrapper">
            {isLoading == true ?
                <Flex justifyContent="center" alignItems="center" textAlign="center" w="100%" mt={{ "xl": "40px", "sm": "10px" }}>
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color=' #5eaba2'
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
                            page="ProcessOrder"
                            tableTitle="Process Orders"
                            url={postUrl}
                            deleteUrl={deleteUrl}
                            setIsFetch={setIsFetch}
                            toast={toast}
                            setIsDialogOpenProcess={setIsDialogOpenProcess}
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
                                        <Flex direction="column">
                                            <Box>
                                                <Field
                                                    name="pcsOnMachine"
                                                    render={({ field, form }) => (
                                                        <InputField
                                                            name='pcsOnMachine'
                                                            label='Pcs On Machine'
                                                            placeholder='Enter Pcs On Machine'
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
                                        <Button colorScheme='gray' mr={3} onClick={handleDialogClose} disabled={btnDisable}>
                                            Close
                                        </Button>
                                        <Button colorScheme='blue' type='submit' disabled={btnDisable}>Edit Process Order</Button>
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

export default ProcessOrder