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
import CardBody from 'components/Card/CardBody';
import DataTable from 'react-data-table-component';

function OrderStock() {
    const { getApi } = useApi();
    const dispatch = useDispatch();
    const selected = useSelector((state) => state.selected);
    const pagination = useSelector((state) => state.pagination);
    const [isFetch, setIsFetch] = useState(false);
    const textColor = useColorModeValue("gray.500", "white");
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [ordersId, setOrderId] = useState([]);
    const [seletedOrder, setSeletedOrder] = useState();
    const [designData, setDesignData] = useState([]);
    const [seletedDesign, setSeletedDesignData] = useState();
    const model = {
        btnTitle: "Order Yarn Stock",
        page: "OrderStock",
        fieldData: [
            {
                name: "feeders",
                type: "text",
            },
            {
                name: "Weight",
                type: "text",
            },
        ]
    }

    const initialValues = {
        order: selected?.selectData?.order || '', // Set default initial value for "name"
        design: selected?.selectData?.design || '', // Set default initial value for "pick"
    };

    const validationSchema = Yup.object().shape({
        order: Yup.string().required('Order is required'),
        design: Yup.string().required('Design is required'),
    });


    const fetchData = async () => {
        try {
            const url = `${process.env.REACT_APP_HOST}/api/stock/orderYarnStock?orderNo=${seletedOrder}&design=${seletedDesign}&limit=${pagination?.pageSize}&offset=${pagination?.currentPage - 1}`;

            const headers = {
                'Content-Type': 'application/json' // Assuming you're sending JSON data
            };

            const response = await getApi(url, headers);

            // Optimized pageItems array
            setData(response);
            setIsLoading(false);
            toast.success(response?.message || "New Data ADD successful!");
            setIsFetch(false);
            dispatch(totalRowsCount(response?.total || 0));
        } catch (error) {
            setIsFetch(false);
            setIsError(true);
            setError(error);
            toast.error(error?.message || "Please Try After Sometime");
        }
    };
    const useF = async () => {
        const url = `${process.env.REACT_APP_HOST}/api/stock/listOfOrders?limit=${pagination?.pageSize}&offset=${pagination?.currentPage - 1}`;
        const headers = {
            'Content-Type': 'application/json' // Assuming you're sending JSON data
        };

        const response = await getApi(url, headers);

        // Optimized pageItems array
        setOrderId(response?.pageItems);
        setIsLoading(false);
    }
    useEffect(() => {
        try {
            useF()
        } catch {

        }
    }, []);
    useEffect(() => {
        dispatch(setTableinitialState());
        dispatch(modelData(model));
        setIsLoading(false)
    }, []);

    const handleSelectChange = async (e, form) => {
        try {
            const { name, value } = e.target;
            form.setFieldValue(name, value);
            form.setFieldValue('design', '');
            setSeletedOrder(value);
            const url = `${process.env.REACT_APP_HOST}/api/stock/listOfOrderDesign?orderNo=${value}`;

            const headers = {
                'Content-Type': 'application/json' // Assuming you're sending JSON data
            };
            const response = await getApi(url, headers);
            setDesignData(response?.pageItems);
        } catch (error) {

        }
    }

    const handleSelectChangeDesign = async (e, form) => {
        const { name, value } = e.target;
        form.setFieldValue(name, value);
        setSeletedDesignData(value);
    }

    const handleSubmit = () => {
        fetchData();
    }
    const columns = [
        {
            name: 'Color',
            selector: (row) => row?.color,
            sortable: true,
            id: (row) => row?.color,
        },
        {
            name: 'Required Yarn',
            selector: (row) => row?.requiredYarn,
            sortable: true,
        },
        {
            name: 'Total Stock',
            sortable: true,
            selector: (row) => row?.totalStock,
        },
    ];

    const tableData = Array.isArray(data?.pageItems)
        ? data?.pageItems?.map((item, index) => ({
            id: index + 1,
            ...item,
        }))
        : [];


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
                                                name="Select Order"
                                                render={({ field, form }) => (
                                                    <InputSelectBox
                                                        name="order"
                                                        label="Select Order"
                                                        placeholder={`Enter Select Order`}
                                                        form={form}
                                                        field={field}
                                                        type='text'
                                                        options={ordersId}
                                                        isManual={true}
                                                        handleSelectChange={handleSelectChange}
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
                                                        isManual={true}
                                                        options={designData}
                                                        handleSelectChange={handleSelectChangeDesign}
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
                                                <Button type='submit'>Submit</Button>
                                            </Box>
                                        </Box>
                                    </Flex>
                                </Form>
                            </Formik>
                            <Box mt="25px" className='order-stock'>
                                <Card
                                    overflowX={{ sm: "scroll", xl: "hidden" }}
                                    pb="0px"
                                    className="common-table"
                                >
                                    <CardHeader
                                        p="6px 0px 0px 0px"
                                        display="flex"
                                        justifyContent="space-between"
                                        flexDirection={{ sm: "column", md: "row" }}
                                    >
                                        <Text fontSize="xl" color={textColor} fontWeight="bold">
                                            Order Yarn Stock
                                        </Text>
                                    </CardHeader>
                                    <CardBody>
                                        <DataTable
                                            columns={columns}
                                            data={tableData}
                                            progressPending={isLoading}
                                            highlightOnHover
                                            pointerOnHover
                                            theme={2 === 1 ? "dark" : "default"}
                                            responsive={true}
                                            ThemeContext={{
                                                background: 2 === 1 ? "red" : "green",
                                            }}
                                            paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                        />
                                    </CardBody>
                                </Card>
                            </Box>
                        </Box>
                        <ToastContainer autoClose={2000} />
                    </Card>
                </>
            }
        </Flex>
    )
}

export default OrderStock