import { Box, Button, Flex, Input, ModalBody, ModalFooter, Text, useColorModeValue } from '@chakra-ui/react'
import Card from 'components/Card/Card';
import { InputField } from 'components/InputFiled';
import { Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { modelEdit } from 'redux/action';
import * as Yup from 'yup';
import { modelData } from 'redux/action';
import CommonTable from "components/CommonTable"
import { ToastContainer, toast, cssTransition } from "react-toastify";
import { useApi } from 'network/api';
import { InputSelectBox } from 'components/InputFiled';

function DesignReport() {
    const { getApi } = useApi();
    const dispatch = useDispatch();
    const selected = useSelector((state) => state.selected);
    const textColor = useColorModeValue("gray.700", "white");
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [design, setDesign] = useState([]);

    const initialValues = {
        design: selected?.selectData?.design || '', // Set default initial value for "name"
        dashRepeat: '',
        pick: '',
        hook: '',
        reed: '',
        finalCut: '',
        avgPick: '',
        feeder: '',
    };

    const validationSchema = Yup.object().shape({
        design: Yup.string().required('Design is required'),
    });


    const fetchData = async () => {
        try {
            const url = `${process.env.REACT_APP_HOST}/api/design/findDesign`;
            const headers = {
                'Content-Type': 'application/json' // Assuming you're sending JSON data
            };

            const response = await getApi(url, headers);
            // Optimized pageItems array

            const extractedDesign = response?.pageItems?.map(item => item.name);
            setDesign(extractedDesign);
            setIsLoading(false);
        } catch (error) {
            setIsError(true);
            setError(error);
        }
    };

    useEffect(() => {
        setIsLoading(false);
        fetchData();
    }, []);

    const handleSubmit = () => { }
    function optimizeFeeders(pageItems) {
        return pageItems.map(item => {
            const { feeders, ...rest } = item;
            return { ...rest, ...feeders };
        });
    }
    const handleDesignData = async (e, form) => {
        setIsLoading(true);
        const { name, value } = e.target;
        form.setFieldValue(name, value);
        const url = `${process.env.REACT_APP_HOST}/api/report/findReportDesign`;
        const headers = {
            'Content-Type': 'application/json' // Assuming you're sending JSON data
        };
        const body = {
            name: value
        }
        try {
            const response = await getApi(url, headers, body);
            if (response?.design) {
                form.setFieldValue('dashRepeat', response?.design?.dashRepeat);
                form.setFieldValue('avgPick', response?.design?.avgPick);
                form.setFieldValue('feeder', response?.design?.feeder);
                form.setFieldValue('pick', response?.design?.pick);
                form.setFieldValue('finalCut', response?.design?.finalCut);
                form.setFieldValue('ground', response?.design?.ground);
                form.setFieldValue('reed', response?.design?.reed);
                form.setFieldValue('hook', response?.design?.hook);
                const url = `${process.env.REACT_APP_HOST}/api/design/photo/${response?.design?.image}`;
                const responseImage = await fetch(url);
                const blob = await responseImage.blob();
                const imageUrl = URL.createObjectURL(blob);
                form.setFieldValue('image', imageUrl);

                let optimizedPageItems = optimizeFeeders(response?.design?.matching);
                setData(optimizedPageItems);

                const model = {
                    btnTitle: "",
                    page: "DesignReport",
                    fieldData: []
                }

                const numOfFields = response?.design?.feeder || 6;
                for (let i = 1; i <= numOfFields; i++) {
                    let fieldName = `f${i}`;

                    if (i === response?.design?.ground) {
                        fieldName += " (Ground)";
                    } else if (i === response?.design?.pallu) {
                        fieldName += " (Pallu)";
                    } else {
                        fieldName += " (Select)";
                    }

                    model.fieldData.push({
                        label: fieldName,
                        name: fieldName,
                        type: "text",
                    });
                };
                dispatch(modelData(model));
                setIsLoading(false);
            }
        } catch {

        }
    }




    return (
        <Flex direction="column" pt={["120px", "75px", "90px"]}>
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
                        {({ handleSubmit, values }) => (
                            <>
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
                                            w={{ md: "25%", sm: "100%" }} minW="224px"
                                        >
                                            <Field
                                                name="Select Design"
                                                render={({ field, form }) => (
                                                    <InputSelectBox
                                                        name="design"
                                                        label="Select Design"
                                                        placeholder={`Enter Select Design`}
                                                        form={form}
                                                        field={field}
                                                        type='text'
                                                        options={design}
                                                        isManual={true}
                                                        handleSelectChange={handleDesignData}
                                                    />
                                                )}
                                            />
                                        </Box>
                                    </Flex>

                                    {!isLoading && values?.design !== "" &&
                                        <Box mt="25px">
                                            <Flex flexWrap={{ md: "noWrap", sm: "wrap" }}>
                                                <Box w={{ md: "25%", sm: "100%" }} minW="224px">
                                                    <label
                                                        className="picture"
                                                        htmlFor="picture__input"
                                                        tabIndex="0"
                                                    >
                                                        <span className="picture__image">
                                                            <img
                                                                src={values?.image}
                                                                alt="Uploaded"
                                                                className="picture__img"
                                                            />
                                                        </span>
                                                    </label>
                                                </Box>
                                                <Flex w={{ md: "75%", sm: "100%" }} flexWrap="wrap" px="10px">
                                                    <Box
                                                        mr={{
                                                            "2xl": "6px",
                                                            xl: "5px",
                                                            lg: "4.5px",
                                                            md: "4px",
                                                            sm: "0px",
                                                        }}
                                                        w={{
                                                            "2xl": "32.5%",
                                                            xl: "32.5%",
                                                            lg: "32.5%",
                                                            md: "49%",
                                                            sm: "100%",
                                                        }}
                                                        mt={{ lg: "0", md: "0", sm: "10px" }}
                                                    >

                                                        <Field
                                                            name="dashRepeat"
                                                            render={({ field, form }) => (
                                                                <InputField
                                                                    name="dashRepeat"
                                                                    label="Dash Repeat"
                                                                    placeholder={`Enter Dash Repeat`}
                                                                    form={form}
                                                                    field={field}
                                                                    type="number"
                                                                    disabled={true}
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
                                                            "2xl": "32.5%",
                                                            xl: "32.5%",
                                                            lg: "32.5%",
                                                            md: "49%",
                                                            sm: "100%",
                                                        }}
                                                        mt={{ lg: "0", md: "0", sm: "10px" }}
                                                    >
                                                        <Field
                                                            name="pick"
                                                            render={({ field, form }) => (
                                                                <InputField
                                                                    name="pick"
                                                                    label="Pick"
                                                                    placeholder={`Enter Pick`}
                                                                    form={form}
                                                                    field={field}
                                                                    type="number"
                                                                    disabled={true}
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
                                                            "2xl": "32.5%",
                                                            xl: "32.5%",
                                                            lg: "32.5%",
                                                            md: "49%",
                                                            sm: "100%",
                                                        }}
                                                        mt={{ lg: "0", md: "0", sm: "10px" }}
                                                    >

                                                        <Field
                                                            name="hook"
                                                            render={({ field, form }) => (
                                                                <InputField
                                                                    name="hook"
                                                                    label="Hook"
                                                                    placeholder={`Enter Hook`}
                                                                    form={form}
                                                                    field={field}
                                                                    type="number"
                                                                    disabled={true}
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
                                                            "2xl": "32.5%",
                                                            xl: "32.5%",
                                                            lg: "32.5%",
                                                            md: "49%",
                                                            sm: "100%",
                                                        }}
                                                        mt={{ lg: "0", md: "0", sm: "10px" }}
                                                    >

                                                        <Field
                                                            name="reed"
                                                            render={({ field, form }) => (
                                                                <InputField
                                                                    name="reed"
                                                                    label="Reed"
                                                                    placeholder={`Enter Reed`}
                                                                    form={form}
                                                                    field={field}
                                                                    type="number"
                                                                    disabled={true}
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
                                                            "2xl": "32.5%",
                                                            xl: "32.5%",
                                                            lg: "32.5%",
                                                            md: "49%",
                                                            sm: "100%",
                                                        }}
                                                        mt={{ lg: "0", md: "0", sm: "10px" }}
                                                    >

                                                        <Field
                                                            name="finalCut"
                                                            render={({ field, form }) => (
                                                                <InputField
                                                                    name="finalCut"
                                                                    label="Final Cut"
                                                                    placeholder={`Enter Final Cut`}
                                                                    form={form}
                                                                    field={field}
                                                                    type="number"
                                                                    disabled={true}
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
                                                            "2xl": "32.5%",
                                                            xl: "32.5%",
                                                            lg: "32.5%",
                                                            md: "49%",
                                                            sm: "100%",
                                                        }}
                                                        mt={{ lg: "0", md: "0", sm: "10px" }}
                                                    >

                                                        <Field
                                                            name="avgPick"
                                                            render={({ field, form }) => (
                                                                <InputField
                                                                    name="avgPick"
                                                                    label="Avg Pick"
                                                                    placeholder={`Enter Avg Pick`}
                                                                    form={form}
                                                                    field={field}
                                                                    type="number"
                                                                    disabled={true}
                                                                />
                                                            )}
                                                        />
                                                    </Box>
                                                </Flex>
                                            </Flex>
                                        </Box>
                                    }
                                </Form>
                                {values.design &&
                                    <Box>
                                        <CommonTable
                                            data={data}
                                            isLoading={isLoading}
                                            isError={isError}
                                            error={error}
                                            page="DesignReport"
                                            tableTitle="Design Matching"
                                            toast={toast}
                                        />
                                    </Box>
                                }
                            </>
                        )}
                    </Formik>
                </Box>
                <ToastContainer autoClose={2000} />
            </Card>
        </Flex>
    )
}

export default DesignReport