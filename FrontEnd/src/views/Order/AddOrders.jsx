import { Box, Button, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useColorModeValue } from '@chakra-ui/react'
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import { BackIcon } from 'components/Icons/Icons';
import { InputField } from 'components/InputFiled';
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { modelEdit } from 'redux/action';
import * as Yup from 'yup';
import { modelData } from 'redux/action';
import CommonTable from "components/CommonTable"
import { ToastContainer, toast, cssTransition } from "react-toastify";
import { useApi } from 'network/api';
import { InputSelectBox } from 'components/InputFiled';
import { AddIcon } from '@chakra-ui/icons';
import { modelDelete } from 'redux/action';
import { parentSelectedData } from 'redux/action';
import { InputDateField } from 'components/InputFiled';
import { selectData } from 'redux/action';
import CardBody from 'components/Card/CardBody';
import DataTable from 'react-data-table-component';

function AddOrders({ setIsAddPage, setIsFetch, colorCode, isAddOrder, setIsAddOrder, setIsProcess }) {
    const { getApi, postApi, putApi, patchApi } = useApi();
    const dispatch = useDispatch();
    const selected = useSelector((state) => state.selected);
    const textColor = useColorModeValue("gray.500", "white");
    const [isFetchOrder, setIsFetchOrder] = useState(false);
    const [data, setData] = useState(null);
    const [partyData, setPartyData] = useState(null);
    const [designData, setDesignData] = useState(null);
    const [colorData, setColorData] = useState(null);
    const [isMatchingTable, setIsMatchingTable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [btnDisable, setBtnDisable] = useState(false);
    const [isEditApi, setIsEditApi] = useState(false);
    const putUrl = "/api/order/editOrders";
    const deleteUrl = `/api/order/deleteOrders/${orderId}`;
    const postUrl = `/api/order/createOrders`;

    const initialValues = {
        party: selected.isEdit ? selected?.selectData?.user?.party || '' : '', // Set default initial value for "name"
        design: selected.isEdit ? selected?.selectData?.user?.design || '' : '', // Set default initial value for "pick"
        date: selected.isEdit ? selected?.selectData?.user?.date || '' : '', // Set default initial value for "date"
        rate: selected.isEdit ? selected?.selectData?.user?.rate || '' : '', // Set default initial value for "date"
        groundColor: selected.isEdit ? selected?.selectData?.user?.groundColor || '' : '', // Set default initial value for "pick"
        palluColor: selected.isEdit ? selected?.selectData?.user?.pallu || '' : '', // Set default initial value for "pick"
        pcs: selected.isEdit ? selected?.selectData?.user?.pcs || '' : '', // Set default initial value for "date"
        matchingId: selected.isEdit ? selected?.selectData?.user?.matchingId || '' : '', // Set default initial value for "date"
    };

    const validationSchema = Yup.object().shape({
        party: Yup.string().required('Party is required'),
        design: Yup.string().required('Design is required'),
        date: Yup.string().required('Date is required'),
        rate: Yup.string().required('Rate is required'),
        groundColor: Yup.string().required('Ground Color is required'),
        palluColor: Yup.string().required('Pallu Color is required'),
        pcs: Yup.string().required('PCS is required'),
    });

    const fetchSelectData = async () => {
        try {
            const DesignUrl = `${process.env.REACT_APP_HOST}/api/design/findDesign`;
            const DesignResponse = await getApi(DesignUrl);
            const extractedDesign = DesignResponse?.pageItems?.map(item => item.name);
            setDesignData(extractedDesign);

            const PartyUrl = `${process.env.REACT_APP_HOST}/api/party/findParty`;
            const PartyResponse = await getApi(PartyUrl);
            const extractedParty = PartyResponse?.pageItems?.map(item => item.name);
            setPartyData(extractedParty);

            setIsLoading(false);
        } catch (error) {
            setIsError(true);
            setError(error);
        }
    };

    const fetchData = async () => {
        try {
            const url = `${process.env.REACT_APP_HOST}/api/order/findAllOrders/${orderId}`
            const body = {
                limit: 20,
                offset: 0
            }
            const response = await postApi(url, body);
            setData(response?.pageItems?.orders);
        }
        catch (error) {
            setIsError(true);
            setError(error);
        }
    }

    useEffect(() => {
        if (isFetchOrder == true) {
            setIsFetchOrder(false);
            fetchData();
        }
    }, [isFetchOrder]);

    const fetchOrderId = async () => {
        try {

            const OrderIdurl = `${process.env.REACT_APP_HOST}/api/order/createToken`
            const orderIdResponse = await postApi(OrderIdurl, {}, {});
            setOrderId(orderIdResponse?.data?.orderId);
        } catch (error) {

        }
    }
    useEffect(() => {
        const model = {
            btnTitle: "Add Order",
            page: "EditOrder",
            fieldData: [
                {
                    name: "Design",
                    type: "text",
                },
                {
                    name: "Ground Color",
                    type: "select",
                },
                {
                    name: "Pallu",
                    type: "select",
                },
                {
                    name: "Rate",
                    type: "number",
                },
                {
                    name: "pcs",
                    type: "number",
                }
            ]
        }
        dispatch(modelData(model));
        setIsFetchOrder(false);
        fetchSelectData();
        if (!selected.isEdit) {
            fetchOrderId();
        } else {
            setOrderId(selected?.selectData?.user?.orderId);
            (async () => {
                try {
                    const url = `${process.env.REACT_APP_HOST}/api/order/findAllOrders/${selected?.selectData?.user?.orderId}`
                    const body = {
                        limit: 20,
                        offset: 0
                    }
                    const response = await postApi(url, body);
                    setData(response?.pageItems?.orders);
                    const urlDesign = `${process.env.REACT_APP_HOST}/api/matching/findGroundColor`;
                    const bodyDesign = {
                        design: selected?.selectData?.user?.design
                    }
                    const headers = {
                        'Content-Type': 'application/json' // Assuming you're sending JSON data
                    };
                    const responseDesign = await postApi(urlDesign, bodyDesign, headers);
                    setColorData(responseDesign?.pageItems);
                } catch (error) {
                    setIsError(true);
                    setError(error);
                    setColorData([]);
                }
            })()
        }
    }, []);

    function optimizeKeys(obj) {
        let newObj = {};
        for (let key in obj) {
            let optimizedKey = key.replace(/\([^)]*\)/g, '').trim();
            newObj[optimizedKey] = obj[key];
        }
        return newObj;
    };

    const controlStyles = {
        color: "#A0AEC0",
        fontSize: "0.875rem",
        fontWeight: "400",
        marginBottom: "10px",
        minWidth: "200px",
    };

    const btnColor = {
        background: "gray",
        height: "46px",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        borderRadius: "10px",
        color: "white",
    };

    const btnSelected = {
        background: "green",
        height: "46px",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        borderRadius: "10px",
        color: "white",
    };

    const handleEditOrderData = (data, values) => {
        values.groundColor = data?.user?.groundColor;
        values.palluColor = data?.user?.pallu;
        values.pcs = data?.user?.pcs;
        values.matchingId = data?.user?.matchingId;
    }

    const columns = [
        {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
            id: (row) => row.matchingId,
        },
    ];
    try {
        const numOfFields = (colorData) ? colorData[0]?.feeder : 6;
        for (let i = 1; i <= numOfFields || 0; i++) {

            let fieldName = `f${i} `;

            if (colorData[0]?.feeders && colorData[0]?.feeders[`f${i}`]) {
                if (colorData[0]?.feeders[`f${i}`] === colorData[0]?.ground) {
                    fieldName += " (Ground)";
                } else if (colorData[0]?.feeders[`f${i}`] === colorData[0]?.pallu) {
                    fieldName += " (Pallu)";
                } else {
                    fieldName += " (Select)";
                }
            } else {
                fieldName += " (Select)"; // Default case if feeders[f${i}] doesn't exist
            }

            columns.push({
                name: fieldName,
                selector: (row) => row?.[fieldName?.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('').replace(/(\([^)]*\))/g, '')],
                sortable: true,
            });
        }
        columns.push({
            name: "Action",
            cell: (row) => {
                // Destructuring values from useFormikContext
                return (
                    <Field
                        name={`matchingId`}
                        render={({ field, form }) => (
                            <FormControl
                                isInvalid={form?.errors["matchingId"] && form?.touched["matchingId"]}
                                {...controlStyles}
                            >
                                <Box
                                    style={form.values?.matchingId !== row?.user?.matchingId ? btnColor : btnSelected}
                                    onClick={() => {
                                        form.setFieldValue('matchingId', row?.user?.matchingId);
                                        const groundColor = colorData.filter((item) => item.matchingId === row?.user?.matchingId)
                                        form.setFieldValue('groundColor', groundColor[0]?.ground);
                                        form.setFieldValue('palluColor', groundColor[0]?.pallu);
                                    }}
                                >
                                    Matching
                                </Box>
                            </FormControl>
                        )}
                    />
                );
            },
            id: "matchingId",
        },)
    } catch {

    }

    const tableData = Array.isArray(colorData)
        ? colorData?.map((user, index) => {
            const rowData = {};

            columns.forEach((column) => {
                if (column.selector && column.name !== 'ID' && column.name !== 'matchingId') {
                    const columnName = column.name
                        .split(' ')
                        .map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1))
                        .join('')
                        .replace(/(\([^)]*\))/g, '');

                    rowData[columnName] = column.selector(user.feeders);
                }
            });

            rowData['user'] = user;
            rowData['id'] = user?.matchingId;
            return rowData;
        })
        : [];

    const handleSubmit = (values, { setSubmitting }) => {
        setBtnDisable(true);
        dispatch(parentSelectedData(values));
        try {
            const apiUrl = `${process.env.REACT_APP_HOST}${postUrl}/${orderId}`;
            const body = optimizeKeys(values);
            let headers = {};
            // Make the callback function inside .then() async
            if (!isEditApi) {
                postApi(apiUrl, body, headers)
                    .then(async (response) => {
                        // You can access the response data using apiOtpResponse in your component
                        toast.success(response?.message || "New Data ADD successful!");
                        // dispatch(modelEdit(false));
                        // dispatch(modelDelete(false));
                        // setIsFetch(true);
                        values.groundColor = '';
                        values.palluColor = '';
                        values.pcs = '';
                        values.matchingId = '';
                        setSubmitting(true);
                        setIsFetchOrder(true);
                        setBtnDisable(false);
                        dispatch(modelEdit(false));
                        setIsEditApi(false);
                    })
                    .catch((error) => {
                        toast.error(error?.message || "Please Try After Sometime");
                        setBtnDisable(false);
                    });
            } else {
                putApi(`${process.env.REACT_APP_HOST}/api/order/editOrders/${orderId}/${selected?.selectData?.user?.tokenId}`, body, headers)
                    .then(async (response) => {
                        // You can access the response data using apiOtpResponse in your component
                        toast.success(response?.message || "Data Update successful!");
                        setSubmitting(false);
                        setIsFetchOrder(true);
                        setBtnDisable(false);
                        dispatch(modelEdit(false));
                        setIsEditApi(false);
                        values.groundColor = '';
                        values.palluColor = '';
                        values.pcs = '';
                        values.matchingId = '';
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
    }

    const handleDesignSet = async (e, form) => {
        try {
            const { name, value } = e.target;
            form.setFieldValue(name, value);
            const url = `${process.env.REACT_APP_HOST}/api/matching/findGroundColor`;
            const body = {
                design: value
            }
            const headers = {
                'Content-Type': 'application/json' // Assuming you're sending JSON data
            };
            await postApi(url, body, headers).then(async (response) => {
                // You can access the response data using apiOtpResponse in your component
                setColorData(response?.pageItems);
            })
                .catch((error) => {
                    toast.error(error?.message || "Please Try After Sometime");
                    setColorData([]);
                });

        } catch (error) {
            toast.error(error?.message || "Please Try After Sometime");
            setBtnDisable(false);
        }
    }

    const handleDialogClose = () => {
        setIsMatchingTable(false);
    }

    return (
        <Card
            overflowX={{ sm: "scroll", xl: "hidden" }}
            p="25px"
            className="common-table"
        >
            <CardHeader
                p="6px 0px 0px 0px"
                display="flex"
                justifyContent="space-between"
                flexDirection={{ sm: "column", md: "row" }}
            >
                <Flex alignItems="center" gap="5px">
                    <BackIcon
                        fontSize="1.3rem"
                        mb="4px"
                        cursor="pointer"
                        onClick={() => {
                            setIsAddPage(false);
                            dispatch(modelEdit(false));
                            setIsFetch(true);
                            setIsAddOrder(false);
                            dispatch(modelDelete(false));
                            setIsProcess(false);
                        }}
                    />
                    <Text fontSize="xl" color={textColor} fontWeight="bold">
                        {!isEditApi ? "Add Order" : "Edit Order"}
                    </Text>
                </Flex>
            </CardHeader>
            <Box>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ handleSubmit, values }) => (
                        <>
                            <Form>
                                <Flex
                                    // justifyContent="space-between"
                                    width="100%"
                                    flexWrap={{
                                        "2xl": "wrap",
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
                                            name="party"
                                            render={({ field, form }) => (
                                                <InputSelectBox
                                                    name='party'
                                                    label='Party'
                                                    placeholder={`Enter Party`}
                                                    form={form}
                                                    options={partyData}
                                                    field={field}
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
                                            name="date"
                                            render={({ field, form }) => (
                                                <InputDateField
                                                    name="date"
                                                    label="Date"
                                                    placeholder={`Enter Date`}
                                                    form={form}
                                                    field={field}
                                                    type='date'
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
                                                    label="Design"
                                                    placeholder={`Enter Design`}
                                                    form={form}
                                                    field={field}
                                                    options={designData}
                                                    isManual={true}
                                                    handleSelectChange={handleDesignSet}
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
                                            name="rate"
                                            render={({ field, form }) => (
                                                <InputField
                                                    name="rate"
                                                    label="Rate"
                                                    placeholder={`Enter Rate`}
                                                    form={form}
                                                    field={field}
                                                    type='number'
                                                />
                                            )}
                                        />
                                    </Box>
                                </Flex>
                                <Divider my="20px" />
                                <Flex
                                    // justifyContent="space-between"
                                    width="100%"
                                    flexWrap={{
                                        "2xl": "wrap",
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
                                        <Box>
                                            <FormLabel ms="4px" mb="2px" fontSize="1.1rem" fontWeight="700" color="#718096">
                                                Matching
                                            </FormLabel>
                                            <Button
                                                alignItems="center"
                                                w='100%'
                                                onClick={() => { setIsMatchingTable(true) }}
                                            >
                                                <Text pt="2px" pl="4px" disabled={btnDisable}>
                                                    Select Matching
                                                </Text>
                                            </Button>
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
                                    >
                                        <Field
                                            name="groundColor"
                                            render={({ field, form }) => (
                                                <InputField
                                                    name="groundColor"
                                                    label="Ground Color"
                                                    placeholder={`Enter Ground Color`}
                                                    form={form}
                                                    field={field}
                                                    disabled={true}
                                                // options={colorData}
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
                                            name="palluColor"
                                            render={({ field, form }) => (
                                                <InputField
                                                    name="palluColor"
                                                    label="Pallu Color"
                                                    placeholder={`Enter Pallu Color`}
                                                    form={form}
                                                    field={field}
                                                    disabled={true}
                                                // options={colorData}
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
                                            name="pcs"
                                            render={({ field, form }) => (
                                                <InputField
                                                    name="pcs"
                                                    label="PCS"
                                                    placeholder={`Enter PCS`}
                                                    form={form}
                                                    field={field}
                                                    type='number'
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
                                        mt={{
                                            "2xl": "28px",
                                            xl: "28px",
                                            lg: "28px",
                                            md: "0%",
                                            sm: "0%",
                                        }}
                                    >
                                        <Box>
                                            <Button
                                                alignItems="center"
                                                type='submit'
                                            >
                                                <AddIcon color="inherit" fontSize="16px" />
                                                <Text pt="2px" pl="4px" disabled={btnDisable}>
                                                    {!isEditApi ? "Add Order" : "Edit Order"}
                                                </Text>
                                            </Button>
                                        </Box>
                                    </Box>
                                </Flex>
                                <Modal isOpen={isMatchingTable} onClose={handleDialogClose} size="4xl">
                                    <Box className='matching-table'>
                                        <ModalOverlay />
                                        <ModalContent >
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
                                                        Design Matching
                                                    </Text>
                                                </CardHeader>
                                                <CardBody>
                                                    <DataTable
                                                        columns={columns}
                                                        data={tableData}
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
                                        </ModalContent>
                                    </Box>
                                </Modal>
                            </Form>
                            <Box mt="25px">
                                <CommonTable
                                    data={data}
                                    isLoading={isLoading}
                                    isError={isError}
                                    error={error}
                                    page="EditOrder"
                                    tableTitle="Orders"
                                    url={putUrl}
                                    deleteUrl={deleteUrl}
                                    setIsFetch={setIsFetchOrder}
                                    toast={toast}
                                    isPagination={false}
                                    handleEditOrderData={(e) => {
                                        handleEditOrderData(e, values)
                                    }}
                                    setIsEditApi={setIsEditApi}
                                />
                            </Box>
                        </>)}
                </Formik>
            </Box>
            <ToastContainer autoClose={2000} />
        </Card>
    )
}

export default AddOrders