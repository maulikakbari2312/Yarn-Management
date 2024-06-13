import { Box, Button, Flex, ModalBody, ModalFooter, Text, useColorModeValue, Spinner } from '@chakra-ui/react'
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import { BackIcon } from 'components/Icons/Icons';
import { InputField } from 'components/InputFiled';
import { Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { modelEdit } from 'redux/action';
import * as Yup from 'yup';
import { modelData } from 'redux/action';
import CommonTable from "components/CommonTable"
import { ToastContainer, toast, cssTransition } from "react-toastify";
import { totalRowsCount } from "redux/action";
import { setTableinitialState } from "redux/action";
import { useApi } from 'network/api';
import { InputSelectBox } from 'components/InputFiled';

function OrderProcessStockReport() {
    const { getApi } = useApi();
    const dispatch = useDispatch();
    const selected = useSelector((state) => state.selected);
    const textColor = useColorModeValue("gray.700", "white");
    const [data, setData] = useState(null);
    const [btnDisable, setBtnDisable] = useState(false);
    const [designData, setDesignData] = useState(null);
    const [party, setParty] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const pagination = useSelector((state) => state.pagination);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const model = {
        btnTitle: "",
        page: "OrderProcessStockReport",
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
                name: "Ground Color",
                type: "text",
            },
            {
                name: "Pallu",
                type: "text",
            },
            {
                name: "Rate",
                type: "text",
            },
            {
                name: "PCS",
                type: "text",
            },
            {
                name: "Pending Pcs",
                type: "text",
            },
            {
                name: "Complete Pcs",
                type: "text",
            },
            {
                name: "Dispatch",
                type: "text",
            },
            {
                name: "Settle Pcs",
                type: "text",
            },
            {
                name: "Machine No",
                type: "text",
            },
            {
                name: "Pcs On Machine",
                type: "text",
            },
        ]
    }

    const initialValues = {
        party: '', // Set default initial value for "name"
        design: '', // Set default initial value for "pick"
    };

    const validationSchema = Yup.object().shape({
        party: Yup.string().required('Party is required'),
        design: Yup.string().required('Design is required'),
    });

    const fetchDataParty = async () => {
        try {
            const url = `${process.env.REACT_APP_HOST}/api/party/findParty?limit=${pagination?.pageSize}&offset=${pagination?.currentPage - 1}`;
            const response = await getApi(url);

            // Extracting object names from response.pageItems
            const partyNames = response?.pageItems.map(item => item.name);
            // Updating state with the extracted names
            setParty(partyNames);
            setData([]);
            setIsLoading(false);
            dispatch(totalRowsCount(response?.total || 0));
        } catch (error) {
            setIsError(true);
            setError(error);
        }
    };

    useEffect(() => {
        dispatch(setTableinitialState());
        dispatch(modelData(model));
        setIsLoading(false);
        fetchDataParty();
    }, []);

    const handlePartyChange = async (e, form) => {
        const { name, value } = e.target;
        form.setFieldValue(name, value);
        const url = `${process.env.REACT_APP_HOST}/api/report/findPartyDesign?party=${value}`;
        const headers = {
            'Content-Type': 'application/json' // Assuming you're sending JSON data
        };
        try {
            await getApi(url, headers).then((res) => {
                setDesignData(res?.pageItems);
                setData([]);
            }).catch((err) => {
                toast.error(err?.message || "Please Try After Sometime");
            })
        } catch (error) {
            toast.error(error?.message || "Please Try After Sometime");
        }
    }
    const handleDesignChange = async (e, form) => {
        const { name, value } = e.target;
        form.setFieldValue(name, value);
        setData([]);
    }
    const handleSubmit = async (values, { setSubmitting }) => {
        setBtnDisable(true);
        try {
            const apiUrl = `${process.env.REACT_APP_HOST}/api/report/getOrderByParty?party=${values?.party}&design=${values?.design}`;
            // Make the callback function inside .then() async
            await getApi(apiUrl)
                .then(async (response) => {
                    console.log('response', response)
                    setData(response)
                    // You can access the response data using apiOtpResponse in your component
                    toast.success(response?.message || "New Data ADD successful!");
                    dispatch(modelEdit(false));
                    setSubmitting(false);
                    setBtnDisable(false);
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

    return (
        <Flex direction="column" pt={["120px", "75px", "90px"]}>
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
                    <Card
                        overflowX={{ sm: "scroll", xl: "hidden" }}
                        p="25px"
                        className="common-table"
                    >
                        <Box>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                <Form>
                                    <Flex
                                        // justifyContent="space-between"
                                        width="100%"
                                        flexWrap={{
                                            "2xl": "6px",
                                            xl: "wrap",
                                            lg: "wrap",
                                            md: "wrap",
                                            sm: "wrap",
                                        }}
                                    >
                                        <Box
                                            mr={{
                                                "2xl": "6px",
                                                xl: "5px",
                                                lg: "4.5px",
                                                md: "4px",
                                                sm: "0px",
                                            }}
                                            w={{
                                                "2xl": "19.5%",
                                                xl: "24%",
                                                lg: "32.5%",
                                                md: "49%",
                                                sm: "100%",
                                            }}
                                        >
                                            <Field
                                                name="Select Party"
                                                render={({ field, form }) => (
                                                    <InputSelectBox
                                                        name="party"
                                                        label="Select Party"
                                                        placeholder={`Enter Select Party`}
                                                        form={form}
                                                        field={field}
                                                        type='text'
                                                        options={party}
                                                        isManual={true}
                                                        handleSelectChange={handlePartyChange}
                                                    />
                                                )}
                                            />
                                        </Box>
                                        <Box
                                            mr={{
                                                "2xl": "6px",
                                                xl: "5px",
                                                lg: "4.5px",
                                                md: "4px",
                                                sm: "0px",
                                            }}
                                            w={{
                                                "2xl": "19.5%",
                                                xl: "24%",
                                                lg: "32.5%",
                                                md: "49%",
                                                sm: "100%",
                                            }}
                                        >
                                            <Field
                                                name="design"
                                                render={({ field, form }) => (
                                                    <InputSelectBox
                                                        name="design"
                                                        label="Select Design"
                                                        placeholder={`Enter Select Design`}
                                                        form={form}
                                                        field={field}
                                                        type='text'
                                                        options={designData}
                                                        isManual={true}
                                                        handleSelectChange={handleDesignChange}
                                                    />
                                                )}
                                            />
                                        </Box>
                                        <Box
                                            mr={{
                                                "2xl": "6px",
                                                xl: "5px",
                                                lg: "4.5px",
                                                md: "4px",
                                                sm: "0px",
                                            }}
                                            w={{
                                                "2xl": "19.5%",
                                                xl: "24%",
                                                lg: "32.5%",
                                                md: "49%",
                                                sm: "100%",
                                            }}
                                        >
                                            <Box
                                                mt={{
                                                    "2xl": "28px",
                                                    xl: "28px",
                                                    lg: "28px",
                                                    md: "0%",
                                                    sm: "0%",
                                                }}>
                                                <Button type='submit' disabled={btnDisable}>Submit</Button>
                                            </Box>
                                        </Box>
                                    </Flex>
                                </Form>
                            </Formik>
                            <Flex>
                                <Box
                                    mr={{
                                        "2xl": "6px",
                                        xl: "5px",
                                        lg: "4.5px",
                                        md: "4px",
                                        sm: "0px",
                                    }}
                                    w={{
                                        "2xl": "19.5%",
                                        xl: "24%",
                                        lg: "32.5%",
                                        md: "49%",
                                        sm: "100%",
                                    }}
                                    className='report-contener'
                                >
                                    <Box sx={{ width: '140px' }}>
                                        Total Pcs
                                    </Box>
                                    <Box>
                                        {data?.totalPcs || 0}
                                    </Box>
                                </Box>
                                <Box
                                    mr={{
                                        "2xl": "6px",
                                        xl: "5px",
                                        lg: "4.5px",
                                        md: "4px",
                                        sm: "0px",
                                    }}
                                    w={{
                                        "2xl": "19.5%",
                                        xl: "24%",
                                        lg: "32.5%",
                                        md: "49%",
                                        sm: "100%",
                                    }}
                                    className='report-contener'
                                >
                                    <Box sx={{ width: '140px' }}>
                                        Total Pending Pcs
                                    </Box>
                                    <Box>
                                        {data?.pendingPcs || 0}
                                    </Box>
                                </Box>
                            </Flex>
                            <Box mt="25px">
                                <CommonTable
                                    data={data?.pageItems}
                                    isLoading={isLoading}
                                    isError={isError}
                                    error={error}
                                    page="OrderProcessStockReport"
                                    tableTitle="Party Process Stock Report"
                                    toast={toast}
                                />
                            </Box>
                        </Box>
                        <ToastContainer autoClose={2000} />
                    </Card>
                </>
            }
        </Flex>
    )
}

export default OrderProcessStockReport