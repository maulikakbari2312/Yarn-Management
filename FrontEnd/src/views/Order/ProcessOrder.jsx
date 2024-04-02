import { Box, Flex, Spinner } from "@chakra-ui/react"
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
const ProcessOrder = () => {
    const { getApi } = useApi();
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

    return (
        <Flex direction="column" pt={["120px", "75px", "90px"]} className="ProcessOrder-wrapper">
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
                            page="ProcessOrder"
                            tableTitle="Process Orders"
                            url={postUrl}
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

export default ProcessOrder