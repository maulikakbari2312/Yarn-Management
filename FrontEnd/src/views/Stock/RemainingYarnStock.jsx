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
const RemainingYarnStock = () => {
    const { getApi } = useApi();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const pagination = useSelector((state) => state.pagination);
    const [isFetch, setIsFetch] = useState(false);
    const dispatch = useDispatch();
    const model = {
        btnTitle: "",
        page: "RemainingYarnStock",
        fieldData: [
            {
                name: "Color",
                type: "text",
            },
            {
                name: "Total Stock",
                type: "text",
            },
            {
                name: "Required Yarn (Pending Order)",
                type: "text",
            },
            // {
            //     name: "Remaining Stock",
            //     type: "text",
            // }
        ]
    }
    const fetchData = async () => {
        try {
            const url = `${process.env.REACT_APP_HOST}/api/yarnStock/findRemainYarnStock?limit=${pagination?.pageSize}&offset=${pagination?.currentPage - 1}`
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
        dispatch(setTableinitialState());
        dispatch(modelData(model))
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
                            page="RemainingYarnStock"
                            tableTitle="All Yarn Stock Data"
                            toast={toast}
                        />
                    </Box>
                    <ToastContainer autoClose={2000} />
                </>
            }
        </Flex>
    )
}

export default RemainingYarnStock