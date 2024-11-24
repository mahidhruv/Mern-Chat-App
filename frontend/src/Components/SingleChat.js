import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import ProfileModal from "./Miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import { ArrowBackIcon } from "@chakra-ui/icons";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  // handler to show the selected chat
  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  const senderFull =
    selectedChat && user ? getSenderFull(user, selectedChat.users) : null;

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            fontFamily="Helvetica"
            px={2}
            display="flex"
            w="100%"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                {/* <ProfileModal user={getSenderFull(selectedChat.users, user)} /> */}
                {senderFull && <ProfileModal user={senderFull} />}
              </>
            ) : (
              <>
                {selectedChat.chatName}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>

          {/* For rendering of the messages */}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflow="hidden"
          >
            
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          h={"100%"}
          justifyContent={"center"}
          flexDir={"column"}
          paddingBottom={3}
          fontFamily={"Helvetica"}
          fontSize={"3xl"}
        >
          Please select a chat to start messaging...
        </Box>
      )}
    </>
  );
};

export default SingleChat;
