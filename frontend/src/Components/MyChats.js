import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../Config/ChatLogics";
import GroupChatModal from "./Miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  // const [loggedUser, setLoggedUser] = useState();
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const [isLoading, setIsLoading] = useState(true);

  // Deleting the chat
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const cancelRef = useRef();

  // NEW: Add this state for backup
  const [deletedChatBackup, setDeletedChatBackup] = useState(null);

  const toast = useToast();

  const fetchChats = async () => {
    // CHANGE : Added early return for better performance
    if (!user?.token) return;

    // setIsLoading(true); // Changed
    try {
      // Changed
      if (!user || !user.token) {
        console.log("User not found or token missing");
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);

      // console.log("Fetched chats:", data); // Debug log
      // console.log(
      //   "Chat IDs:",
      //   data.map((chat) => chat._id)
      // );
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    } finally {
      // CHANGED : Reset loading state
      // setIsLoading(false);
    }
  };

  // Delete handler with new alert dialog box
  const handleDeleteClick = (chat) => {
    setChatToDelete(chat);
    setIsDeleteAlertOpen(true);
  };

  // Delete handler
  const handleDeleteConfirm = async () => {
    if (!chatToDelete) return;

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete("/api/chat/delete", {
        headers: config.headers,
        data: { chatId: chatToDelete._id },
      });

      setChats(chats.filter((c) => c._id !== chatToDelete._id));

      if (selectedChat?._id === chatToDelete._id) {
        setSelectedChat(null);
      }

      toast({
        title: "Chat Deleted Successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error Deleting Chat",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      // NEW: Clean up states
      setIsDeleteAlertOpen(false);
      setChatToDelete(null);
    }
  };

  // Old Delete handler -> working fine with windows default alert
  // const handleDeleteChat = async (chatId) => {
  //   // Show confirmation dialog
  //   if (window.confirm("Chat will be deleted permanently. Are you sure?")) {
  //     try {
  //       const config = {
  //         headers: {
  //           "Content-type": "application/json",
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       };

  //       await axios.delete("/api/chat/delete", {
  //         headers: config.headers,
  //         data: { chatId: chatId },
  //       });

  //       // Remove chat from the list
  //       setChats(chats.filter((c) => c._id !== chatId));

  //       // If deleted chat was selected, unselect it
  //       if (selectedChat?._id === chatId) {
  //         setSelectedChat(null);
  //       }

  //       toast({
  //         title: "Chat Deleted Successfully",
  //         status: "success",
  //         duration: 3000,
  //         isClosable: true,
  //         position: "top",
  //       });
  //     } catch (error) {
  //       toast({
  //         title: "Error Deleting Chat",
  //         description: error.response?.data?.message || "Something went wrong",
  //         status: "error",
  //         duration: 3000,
  //         isClosable: true,
  //         position: "top",
  //       });
  //     }
  //   }
  // };

  useEffect(() => {
    const loadChats = async () => {
      // Only show loading if there are no chats yet
      if (!chats.length) {
        setIsLoading(true);
      }

      try {
        await fetchChats();
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChats();
  }, [user, selectedChat, fetchAgain]); // Added dependencies

  // // CHANGED: Added debug useEffect
  // useEffect(() => {
  //   // console.log("Selected Chat changed:", selectedChat);
  //   // console.log("Current chats:", chats);
  // }, [selectedChat, chats]);

  // CHANGED: Added explicit chat selection handler
  const handleChatSelect = (chat) => {
    // console.log("Selecting chat:", chat);
    setSelectedChat(chat);
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth={"1px"}
    >
      {/* Header of the Chat */}
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Helvetica"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            // rightIcon={<AddIcon />}
            gap={"2"}
          >
            <Text alignItems="center" size={"15px"} paddingTop={"1"}>
              New Group Chat
            </Text>
            <AddIcon fontSize="15px" />
          </Button>
        </GroupChatModal>
      </Box>
      {/* Render all the chats */}
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {/* CHANGE : Improved conditional rendering with loading state */}
        {isLoading ? (
          // <ChatLoading />
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={3}
            p={6}
            bg="white"
            borderRadius="xl"
            shadow="sm"
            minW="200px"
          >
            <i
              className="fa-solid fa-arrows-rotate fa-spin"
              style={{
                fontSize: "2rem",
                color: "#3182ce",
                animationDuration: "3s",
              }}
            />
            <Text color="gray.700" fontSize="lg" fontWeight="semibold">
              Loading Chats...
            </Text>
          </Box>
        ) : chats?.length > 0 ? (
          <Stack overflowY="scroll">
            {chats.map((chat, index) => (
              <Box
                onClick={() => handleChatSelect(chat)}
                cursor="pointer"
                // added id comparision so that chat remain selected
                bg={selectedChat?._id === chat._id ? "#00CED1" : "#E8E8E8"}
                color={selectedChat?._id === chat._id ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={`${chat._id}-${index}`}
                // For delete button
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                _hover={{
                  "& .delete-button": {
                    opacity: 1,
                  },
                }}
              >
                {/* CHANGE : Optimized chat name rendering with null checks */}
                <Text fontSize={"lg"}>
                  {chat && !chat.isGroupChat && loggedUser && chat.users
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName || "Unnamed Chat"}
                </Text>

                {/* For deleting the chat */}
                <Button
                  className="delete-button"
                  opacity={0}
                  transition="opacity 0.2s"
                  size="sm"
                  colorScheme="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(chat);
                  }}
                  ml={2} // Add margin to the left of button
                >
                  <CloseIcon boxSize="auto" />
                </Button>

                {/* Add this AlertDialog component */}
                <AlertDialog
                  isOpen={isDeleteAlertOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={() => setIsDeleteAlertOpen(false)}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Unexpected bad things will happen if you don’t read
                        this!
                      </AlertDialogHeader>

                      <AlertDialogBody>
                        This will permanently delete the chat, and remove all
                        messages associated with it.
                      </AlertDialogBody>

                      <AlertDialogFooter>
                        <Button
                          ref={cancelRef}
                          onClick={() => setIsDeleteAlertOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={handleDeleteConfirm}
                          ml={3}
                        >
                          Delete
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </Box>
            ))}
          </Stack>
        ) : (
          // CHANGE : Added empty state message
          <Text textAlign="center" color="gray.500">
            No chats available
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
// CHANGE 8: Export with React.memo for performance
// export default React.memo(MyChats);
