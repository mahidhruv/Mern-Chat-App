import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import ProfileModal from "./Miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import { ArrowBackIcon } from "@chakra-ui/icons";
import axios from 'axios';
import "./styles.css";
import ScrollableChat from "./ScrollableChat";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const { user, selectedChat, setSelectedChat } = ChatState();

  const toast = useToast();

  // handler to show the selected chat
  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  // handler to fetch messages
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

      console.log("message data:", data);
      // console.log("messages: ", messages);
      setMessages(data);
      console.log("messages: ", messages);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);
  

  // handler to send the message
  const sendMessage = async () => {
    if (newMessage.trim()) {
      // Check if message exists and isn't just whitespace
      try {
        // Your message sending logic here
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        // Clear the message here to show on ui immediately
        setNewMessage("");

        // Send the message to the server
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        console.log("message data: ", data);
        // Clear the message after sending
        // setNewMessage("");
        setMessages([...messages, data]);

        // Reset the input field height
        const inputElement = document.querySelector("textarea");
        if (inputElement) {
          inputElement.style.height = "40px";
        }
      } catch (error) {
        console.error("Error sending message: ", error);
        // Handle error appropriately
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  // handler to typing message
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // Auto-adjust height
    e.target.style.height = "inherit";
    const newHeight =
      e.target.value === ""
        ? "40px" // Reset to minimum height when empty
        : `${Math.min(e.target.scrollHeight, 200)}px`; // 200px is maxHeight
    e.target.style.height = newHeight;

    // Typing indicator logic
  };

  // handler for enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      const cursorPosition = e.target.selectionStart;
      const textBeforeCursor = e.target.value.substring(0, cursorPosition);
      const textAfterCursor = e.target.value.substring(cursorPosition);

      setNewMessage(textBeforeCursor + "\n" + textAfterCursor);

      setTimeout(() => {
        e.target.selectionStart = cursorPosition + 1;
        e.target.selectionEnd = cursorPosition + 1;
      }, 0);
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
      // Reset height after sending message
      e.target.style.height = "40px";
    }
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
                  fetchMessages={fetchMessages}
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
            {/* Messages Here */}
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Box
                  p={6}
                  borderRadius="xl"
                  bg="linear-gradient(to right, #E0EAFC, #CFDEF3)"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={4}
                >
                  <Spinner
                    size="xl"
                    w={16}
                    h={16}
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                  />
                  <Text fontSize="lg" fontWeight="medium" color="gray.700">
                    Loading messages...
                  </Text>
                </Box>
              </div>
            ) : (
              <div className="messages">
                {/* All of the messages */}
                <ScrollableChat messages={messages} />
              </div>
            )}
            {/* Input Field to type the messages */}
            <FormControl
              display="flex"
              alignItems="flex-end"
              marginTop={3}
              isRequired
            >
              <Box position="relative" width="100%" mr={2}>
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Type a message..."
                  _hover={{ bg: "#E0E0E0" }}
                  value={newMessage}
                  onChange={typingHandler}
                  onKeyDown={handleKeyDown}
                  mr={2}
                  borderRadius="20px"
                  _focus={{
                    borderColor: "blue.500",
                    bg: "#E8E8E8",
                    boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
                  }}
                  as="textarea"
                  minHeight="40px"
                  height="40px"
                  maxHeight="200px"
                  overflow="auto"
                  resize="none"
                  py={2}
                  px={4}
                  transition="all 0.2s"
                  fontFamily="inherit"
                  fontSize="md"
                  sx={{
                    "&::-webkit-scrollbar": {
                      display: "none", // This hides the scrollbar in WebKit browsers
                    },
                    msOverflowStyle: "none", // Fixed: changed to camelCase
                    scrollbarWidth: "none",
                    lineHeight: "1.5",
                    display: "block",
                    width: "100%",
                  }}
                />
              </Box>
              <IconButton
                colorScheme="blue"
                aria-label="Send message"
                icon={<i className="fas fa-paper-plane"></i>}
                onClick={sendMessage}
                // isLoading={loading}
                borderRadius="full"
                size="md"
                alignSelf="flex-end" // Aligns button with the bottom of the input
                mb="2px" // Optional: slight margin to align perfectly with input
              />
            </FormControl>
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
