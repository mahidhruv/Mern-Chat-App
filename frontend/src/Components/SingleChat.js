import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import ProfileModal from "./Miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  //   handler to show the selected chat
  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Helvetica"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<i className="fa-solid fa-arrow-left" />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {selectedChat && user && selectedChat.users?.length > 0 ? (
                  <>
                    {getSender(user, selectedChat.users)}
                    <ProfileModal
                      user={getSenderFull(user, selectedChat.users) || null}
                    />
                  </>
                ) : (
                  <>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      h={"87vh"}
                      w={"100%"}
                      justifyContent={"center"}
                      flexDir={"column"}
                      paddingBottom={3}
                      fontFamily={"Helvetica"}
                      fontSize={"3xl"}
                    >
                      <Text textAlign={"center"}>
                        Please select a chat to start messaging...
                      </Text>
                    </Box>
                  </>
                )}
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
            flexDirection="column"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            position="relative"
          >
            <Box
              flex={1}
              display="flex"
              flexDirection="column"
              overflowY="auto"
              css={{
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#888",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#555",
                },
              }}
            >
              <Box
                display="flex"
                flexDirection="column"
                marginTop="auto"
                gap={2}
              >
                {/* Messages will be rendered here */}
              </Box>
            </Box>
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
