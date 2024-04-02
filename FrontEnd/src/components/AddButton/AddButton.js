import { AddIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import React, { useState } from "react";
import {
    Text,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";

import CommonModal from "components/CommonModal/CommonModal";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function AddButton({ url, setIsFetch }) {
    const [userData, setUserData] = useState(null); // Local state to store user data
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const user = useSelector((state) => state.user.modelData);
    useEffect(() => {
        setUserData(user);
    }, [user]);

    return (
        <>
            <Button
                alignItems="center"
                onClick={() => {
                    setIsDialogOpen(true);
                }}
            >
                <AddIcon color="inherit" fontSize="16px" />
                <Text pt="2px" pl="4px">
                    {userData?.btnTitle}
                </Text>
            </Button>
            <CommonModal
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                userData={userData}
                url={url}
                setIsFetch={setIsFetch}
            />
        </>
    );
}

export default AddButton;
