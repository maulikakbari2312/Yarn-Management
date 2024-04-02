import { Box, Flex, Spinner } from "@chakra-ui/react"
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
const DeliveredOrders = () => {
    const { getApi } = useApi();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const postUrl = "/api/company/createCompany"
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
                        />
                    </Box>
                    <ToastContainer autoClose={2000} />
                </>
            }
        </Flex>
    )
}

export default DeliveredOrders