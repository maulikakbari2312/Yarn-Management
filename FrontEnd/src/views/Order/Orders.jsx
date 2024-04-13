import { Box, Button, Flex, Modal, ModalContent, ModalOverlay, Spinner, Text, useColorMode, useColorModeValue } from "@chakra-ui/react"
import CommonTable from "components/CommonTable"
import { useApi } from "network/api";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modelData } from "redux/action";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, cssTransition } from "react-toastify";
import { AddIcon } from "@chakra-ui/icons";
import AddOrders from "./AddOrders";
import AddToProcess from "./AddToProcess";
import DataTable from "react-data-table-component";
import CardBody from "components/Card/CardBody";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import { totalRowsCount } from "redux/action";
import { setTableinitialState } from "redux/action";

const Orders = () => {
    const { getApi, postApi } = useApi();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMatching, setIsLoadingMatching] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const putUrl = "/api/Orders/editParty"
    const deleteUrl = "/api/order/deleteWholeOrder"
    const selected = useSelector((state) => state.selected);
    const pagination = useSelector((state) => state.pagination);
    const [isFetch, setIsFetch] = useState(false);
    const [isAddPage, setIsAddPage] = useState(false);
    const [isProcess, setIsProcess] = useState(false);
    const [isAddOrder, setIsAddOrder] = useState(false);
    const [colorCode, setColorCode] = useState([]);
    const [dataTable, setDataTable] = useState(null);
    const [statusDataTable, setStatusDataTable] = useState(null);
    const [isMatchingTable, setIsMatchingTable] = useState(false);
    const [isStatusTable, setIsStatusTable] = useState(false);
    const textColor = useColorModeValue("gray.500", "white");
    const { colorMode } = useColorMode();
    const disabledButtonStyle = {
        fill: colorMode === "light" ? "var(--chakra-colors-gray-400)" : "var(--chakra-colors-gray-700)",
    };

    const enabledButtonStyle = {
        fill: colorMode === "light" ? "var(--chakra-colors-gray-700)" : "var(--chakra-colors-gray-400)",
    };
    const model = {
        btnTitle: "Add Orders",
        page: "Orders",
        fieldData: [
            {
                name: "Date",
                type: "date",
            },
            {
                name: "Order No",
                type: "number",
            },
            {
                name: "Manage",
                type: "process",
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
                name: "Matching",
                type: "Matching-table",
            },
            {
                name: "Status",
                type: "Status-table",
            },
            {
                name: "Total",
                type: "number",
            },
            {
                name: "Pending",
                type: "number",
            },
            {
                name: "Process",
                type: "number",
            },
            {
                name: "Completed",
                type: "number",
            },
            {
                name: "Dispatch",
                type: "number",
            }
        ]
    }

    const fetchData = async () => {
        try {
            const url = `${process.env.REACT_APP_HOST}/api/order/findOrders?limit=${pagination?.pageSize}&offset=${pagination?.currentPage - 1}`
            const body = {
                limit: 20,
                offset: 0
            }
            const response = await getApi(url, body);
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

    const fetchMatching = async () => {
        setIsLoadingMatching(true);
        try {
            const url = `${process.env.REACT_APP_HOST}/api/order/findMatching/${selected?.parentSelectedData?.user?.orderId}`
            const body = {
                limit: 20,
                offset: 0,
                design: selected?.parentSelectedData?.user?.design
            }
            const response = await postApi(url, body);
            setDataTable(response);
            setIsLoadingMatching(false);
        } catch (error) {
            setIsError(true);
            setError(error);
            setIsLoadingMatching(false);
        }
        setIsLoadingMatching(false);
    }
    const fetchStatusOrder = async () => {
        setIsLoadingMatching(true);
        try {
            const url = `${process.env.REACT_APP_HOST}/api/order/findAllOrders/${selected?.parentSelectedData?.user?.orderId}`
            const body = {
                limit: 20,
                offset: 0,
                design: selected?.parentSelectedData?.user?.design
            }
            const response = await postApi(url, body);
            setStatusDataTable(response);
            setIsLoadingMatching(false);
        } catch (error) {
            setIsError(true);
            setError(error);
            setIsLoadingMatching(false);
        }
        setIsLoadingMatching(false);
    }

    useEffect(() => {
        if (isFetch == true) {
            dispatch(modelData(model));
            setIsFetch(false);
            fetchData();
        }
    }, [isFetch == true, selected.isEdit == false]);

    useEffect(() => {
        dispatch(modelData(model));
        setIsFetch(false);
        dispatch(setTableinitialState());
        try {
            const colorCode = async () => {
                const colorUrl = `${process.env.REACT_APP_HOST}/api/coloryarn/findColorYarn`;
                const colorResponse = await getApi(colorUrl);
                const extractedCodes = colorResponse?.pageItems?.map(item => item.colorCode);
                setColorCode(extractedCodes);
            }
            colorCode()

        } catch {

        }
    }, []);

    useEffect(() => {
        if (isMatchingTable) {
            fetchMatching()
        }
    }, [isMatchingTable]);

    useEffect(() => {
        if (isStatusTable) {
            fetchStatusOrder()
        }
    }, [isStatusTable]);

    const handleDialogClose = () => {
        setIsMatchingTable(false);
        setIsStatusTable(false);
    }

    useEffect(() => {
        fetchData();
    }, [pagination?.currentPage, pagination?.pageSize]);

    const columns = [{
        name: 'Design',
        selector: (row) => row?.['design'], // Ensure this matches your data structure
        sortable: true,
    }
    ];
    const statusColumns = [
        {
            name: 'Design',
            selector: (row) => row?.['design'], // Ensure this matches your data structure
            sortable: true,
        },
        {
            name: 'Rate',
            selector: (row) => row?.['rate'], // Ensure this matches your data structure
            sortable: true,
        },
        {
            name: 'PCS',
            selector: (row) => row?.['pcs'], // Ensure this matches your data structure
            sortable: true,
        },
        {
            name: 'Pending Pcs',
            selector: (row) => row?.['pendingPcs'], // Ensure this matches your data structure
            sortable: true,
        },
        {
            name: 'Complete Pcs',
            selector: (row) => row?.['completePcs'], // Ensure this matches your data structure
            sortable: true,
        },
        {
            name: 'Dispatch',
            selector: (row) => row?.['dispatch'], // Ensure this matches your data structure
            sortable: true,
        },
        {
            name: 'Settle Pcs',
            selector: (row) => row?.['settlePcs'], // Ensure this matches your data structure
            sortable: true,
        },
        {
            name: 'Machine No',
            selector: (row) => row?.['machineNo'], // Ensure this matches your data structure
            sortable: true,
        },
        {
            name: 'PCS On Machine',
            selector: (row) => row?.['pcsOnMachine'], // Ensure this matches your data structure
            sortable: true,
        },
    ];
    try {

        const numOfFields = (dataTable && dataTable.pageItems && dataTable.pageItems[0]) ? Object.keys(dataTable.pageItems[0]) : 6;
        const filteredFields = numOfFields?.filter(field => field !== 'matchingId');

        for (let i = 1; i <= filteredFields?.length - 2 || 0; i++) {

            let fieldName = `f${i} `;

            columns.push({
                name: fieldName,
                selector: (row) => row?.[fieldName?.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('').replace(/(\([^)]*\))/g, '')], // Ensure this matches your data structure
                sortable: true,
            });
        }
        columns.push({
            name: 'Weight',
            selector: (row) => row?.['weight'], // Ensure this matches your data structure
            sortable: true,
        });
    } catch {

    }

    const tableData = Array.isArray(dataTable?.pageItems)
        ? dataTable?.pageItems?.map((user, index) => {
            const rowData = {};

            columns.forEach((column) => {
                if (column.selector && column.name !== 'ID' && column.name !== 'matchingId') {
                    const columnName = column.name
                        .split(' ')
                        .map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1))
                        .join('')
                        .replace(/(\([^)]*\))/g, '');

                    rowData[columnName] = column.selector(user);
                }
            });

            rowData['user'] = user;
            rowData['id'] = user?.matchingId;
            return rowData;
        })
        : [];
    const statusTableData = Array.isArray(statusDataTable?.pageItems?.orders)
        ? statusDataTable?.pageItems?.orders?.map((user, index) => {
            const rowData = {};

            statusColumns.forEach((column) => {
                if (column.selector && column.name !== 'ID' && column.name !== 'matchingId') {
                    const columnName = column.name
                        .split(' ')
                        .map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1))
                        .join('')
                        .replace(/(\([^)]*\))/g, '');

                    rowData[columnName] = column.selector(user);
                }
            });

            rowData['user'] = user;
            rowData['id'] = user?.matchingId;
            return rowData;
        })
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
                    {!isAddPage ? (
                        <>
                            <Box>
                                <Button
                                    alignItems="center"
                                    onClick={() => {
                                        setIsAddPage(true);
                                        setIsAddOrder(true);
                                    }}
                                >
                                    <AddIcon color="inherit" fontSize="16px" />
                                    <Text pt="2px" pl="4px">
                                        Add Orders
                                    </Text>
                                </Button>
                            </Box>
                            <Box mt="25px" className="order-wrraper">
                                <CommonTable
                                    data={data}
                                    isLoading={isLoading}
                                    isError={isError}
                                    error={error}
                                    page="Orders"
                                    tableTitle="Orders Data"
                                    url={putUrl}
                                    deleteUrl={deleteUrl}
                                    setIsFetch={setIsFetch}
                                    toast={toast}
                                    setIsAddPage={setIsAddPage}
                                    setIsProcess={setIsProcess}
                                    setIsMatchingTable={setIsMatchingTable}
                                    setIsStatusTable={setIsStatusTable}
                                />
                            </Box>
                        </>) :
                        isProcess
                            ?
                            <AddToProcess
                                setIsAddPage={setIsAddPage}
                                setIsFetch={setIsFetch}
                                setColorCode={setColorCode}
                                colorCode={colorCode}
                                isAddOrder={isAddOrder}
                                setIsAddOrder={setIsAddOrder}
                                setIsProcess={setIsProcess}
                            />
                            :
                            <AddOrders
                                setIsAddPage={setIsAddPage}
                                setIsFetch={setIsFetch}
                                setColorCode={setColorCode}
                                colorCode={colorCode}
                                isAddOrder={isAddOrder}
                                setIsAddOrder={setIsAddOrder}
                                setIsProcess={setIsProcess}
                            />}
                    <ToastContainer autoClose={2000} />
                    <Modal isOpen={isMatchingTable} onClose={handleDialogClose} size="6xl">
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
                                        progressPending={isLoadingMatching}
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
                    </Modal>
                    <Modal isOpen={isStatusTable} onClose={handleDialogClose} size="6xl">
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
                                        Design Status
                                    </Text>
                                </CardHeader>
                                <CardBody>
                                    <DataTable
                                        columns={statusColumns}
                                        data={statusTableData}
                                        progressPending={isLoadingMatching}
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
                    </Modal>
                    <style>
                        {`
                .rdt_Pagination button[disabled] svg {
                fill: ${disabledButtonStyle.fill};
            }
                .rdt_Pagination button: not([disabled]) svg {
    fill: ${enabledButtonStyle.fill};
}
`}
                    </style>
                </>
            }
        </Flex>
    )
}

export default Orders