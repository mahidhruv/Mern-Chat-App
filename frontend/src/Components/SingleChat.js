import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import ProfileModal from "./Miscellaneous/ProfileModal";

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
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <Text>{selectedChat.chatName.toUpperCase()}</Text>
              // <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            )}
          </Text>
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
