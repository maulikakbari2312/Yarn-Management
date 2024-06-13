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
const Machine = () => {
    const { getApi } = useApi();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const postUrl = "/api/machine/createMachine"
    const putUrl = "/api/machine/editMachine"
    const deleteUrl = "/api/machine/deleteMachine"
    const selected = useSelector((state) => state.selected);
    const pagination = useSelector((state) => state.pagination);
    const [isFetch, setIsFetch] = useState(false);

    const model = {
        btnTitle: "Add Machine",
        page: "machine",
        fieldData: [
            {
                name: "Machine",
                type: "number",
            },
            {
                name: "Panna",
                type: "number",
            },
        ]
    }

    const fetchData = async () => {
        try {
            const url = `${process.env.REACT_APP_HOST}/api/machine/findMachine?limit=${pagination?.pageSize}&offset=${pagination?.currentPage - 1}`
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

    useEffect(() => {
        if (isFetch == true) {
            setIsFetch(false);
            fetchData();
        }
    }, [isFetch == true, selected.isEdit == false]);

    useEffect(() => {
        dispatch(setTableinitialState());
        dispatch(modelData(model));
        setIsFetch(false);
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
                        color=' #5eaba2'
                        size='xl'
                    />
                </Flex>
                :
                <>
                    <Box>
                        <AddButton url={postUrl} setIsFetch={setIsFetch} toast={toast} />
                    </Box>
                    <Box mt="25px">
                        <CommonTable
                            data={data}
                            isLoading={isLoading}
                            isError={isError}
                            error={error}
                            page="Machine"
                            tableTitle="Machine Data"
                            url={putUrl}
                            deleteUrl={deleteUrl}
                            setIsFetch={setIsFetch}
                            toast={toast}
                        />
                    </Box>
                </>
            }
            <ToastContainer autoClose={2000} />
        </Flex>
    )
}

export default Machine