import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useColorMode, useColorModeValue, Spinner } from "@chakra-ui/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
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
import SareeStockModel from "./SareeStockModel";
const SareeStock = () => {
    const { getApi } = useApi();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [isFetch, setIsFetch] = useState(false);
    const pagination = useSelector((state) => state.pagination);
    const dispatch = useDispatch();
    const [party, setParty] = useState([]);
    const [isSareeSaleDialogOpen, setIsSareeSaleDialogOpen] = useState(false);
    const model = {
        btnTitle: "",
        page: "SareeStock",
        fieldData: [
            {
                name: "Design",
                type: "text",
            },
            {
                name: "Pallu",
                type: "text"
            },
            {
                name: "Ground Color",
                type: "text",
            },
            {
                name: "Stock",
                type: "number",
            }
        ]
    }
    useEffect(() => {
        (async () => {
            try {
                const url = `${process.env.REACT_APP_HOST}/api/party/findParty`;
                const response = await getApi(url);
                const extractedParty = response?.pageItems?.map(item => item.name);
                setParty(extractedParty);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    const fetchData = async () => {
        try {
            const url = `${process.env.REACT_APP_HOST}/api/stock/getSareeStock?limit=${pagination?.pageSize}&offset=${pagination?.currentPage - 1}`
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
                            page="SareeStock"
                            tableTitle="Saree Stock"
                            toast={toast}
                            setIsSareeSaleDialogOpen={setIsSareeSaleDialogOpen}
                        />
                    </Box>
                    {
                        isSareeSaleDialogOpen && <SareeStockModel toast={toast} setIsSareeSaleDialogOpen={setIsSareeSaleDialogOpen} party={party} isSareeSaleDialogOpen={isSareeSaleDialogOpen} setIsFetch={setIsFetch} fetchData={fetchData} />
                    }
                    <ToastContainer autoClose={2000} />
                </>
            }
        </Flex>
    )
}

export default SareeStock