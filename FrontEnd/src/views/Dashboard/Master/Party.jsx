import { useState, useEffect } from "react";
import { Box, Button, Flex, Spinner } from "@chakra-ui/react";
import axios from "axios";
import AddButton from "components/AddButton/AddButton";
import CommonTable from "components/CommonTable";
import { useApi } from "network/api";
import { useDispatch, useSelector } from "react-redux";
import { modelData } from "redux/action";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { totalRowsCount } from "redux/action";
import { setTableinitialState } from "redux/action";
const Party = () => {
    const { getApi } = useApi();
    const [data, setData] = useState(null);
    const [filterDatas, setFilterDatas] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [isFetch, setIsFetch] = useState(false);
    const [filterType, setFilterType] = useState('All'); // State to track filter type
    const dispatch = useDispatch();
    const postUrl = "/api/party/createParty";
    const putUrl = "/api/party/editParty";
    const deleteUrl = "/api/party/deleteParty";
    const selected = useSelector((state) => state.selected);
    const pagination = useSelector((state) => state.pagination);

    const model = {
        btnTitle: "Add Party",
        page: "party",
        fieldData: [
            {
                name: "Name",
                type: "text",
            },
            {
                name: "Address",
                type: "text",
            },
            {
                name: "Mobile",
                type: "number",
            },
            {
                name: "Type",
                type: "select",
                option: ['Debitor', 'Creditor'],
            }
        ]
    };
    const fetchData = async () => {
        try {
            const url = `${process.env.REACT_APP_HOST}/api/party/findParty?limit=${pagination?.pageSize}&offset=${pagination?.currentPage - 1}`
            const response = await getApi(url);
            setData(response?.pageItems);
            setFilterDatas(response?.pageItems);
            setIsLoading(false);
            setIsFetch(false);
            dispatch(totalRowsCount(response?.total || 0));
        } catch (error) {
            setIsError(true);
            setIsFetch(false);
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
        if (pagination?.currentPage !== 0) {
            fetchData();
        }
    }, [pagination?.currentPage, pagination?.pageSize]);

    // Function to handle filtering based on type
    const filterData = (type) => {
        setIsLoading(true);
        if (type !== 'All') {
            const filtered = data?.filter(item => item.type === type); // Filter by type
            setFilterDatas(filtered);
            setIsLoading(false);
        } else {
            setFilterDatas(data);
            setIsLoading(false);
        }
        setIsLoading(false);
        setFilterType(type); // Set the current filter type
    };

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
                    <Flex justifyContent="space-between" flexWrap="wrap" gap={{ md: '10px', sm: '20px' }}>
                        <Box>
                            <AddButton url={postUrl} setIsFetch={setIsFetch} toast={toast} />
                        </Box>
                        <Flex gap="10px" mr={{ lg: "20px", md: '3px', sm: '0' }}>
                            <Button onClick={() => filterData('All')} colorScheme={filterType === 'All' ? 'blue' : 'gray'}>
                                All
                            </Button>
                            <Button onClick={() => filterData('Debitor')} colorScheme={filterType === 'Debitor' ? 'blue' : 'gray'}>
                                Debitor
                            </Button>
                            <Button onClick={() => filterData('Creditor')} colorScheme={filterType === 'Creditor' ? 'blue' : 'gray'}>
                                Creditor
                            </Button>
                        </Flex>
                    </Flex>
                    <Box mt="25px">

                        < CommonTable
                            data={filterDatas}
                            isLoading={isLoading}
                            isError={isError}
                            error={error}
                            page="party"
                            tableTitle="Party Data"
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
    );
};

export default Party;
