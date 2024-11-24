import React, { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { ViewIcon } from "@chakra-ui/icons";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();
  const loggedUser = user; // Add this line
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  // For the leave alert - separate state
  const [isLeaveAlertOpen, setIsLeaveAlertOpen] = useState(false);

  // For search user state
  const [isSearched, setIsSearched] = useState(false);

  const [isRemoveAlertOpen, setIsRemoveAlertOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);

  // Remove handler to remove user from group -> only admin can remove the user
  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    // Check if trying to remove the admin
    if (user1._id === selectedChat.groupAdmin._id && user1._id !== user._id) {
      toast({
        title: "Admin cannot be removed!",
        description: "Transfer admin rights before removing",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);

      // Log the request data
      console.log("Request data:", {
        chatId: selectedChat._id,
        userId: user1._id,
      });

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // Log the full request
      console.log("Making request with config:", config);

      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      // Log successful response
      console.log("Response data:", data);

      // If user removed themselves, reset selectedChat
      // Otherwise update the selectedChat with new data
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);

      // Close the modal if user removed themselves
      if (user1._id === user._id) {
        onClose();
      }
    } catch (error) {
      console.log("Error in handleRemove:", error); // Log full error
      console.log("Error response:", error.response); // Log error response
      console.log("Error message:", error.message); // Log error message
      toast({
        title: "Error Occured!",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to remove user",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
    // setGroupChatName("");
  };

  const handleLeaveGroup = (user) => {
    closeLeaveAlert(); // Close the alert first
    handleRemove(user);
  };

  // Function to open leave alert
  const openLeaveAlert = () => {
    setIsLeaveAlertOpen(true);
  };

  // Function to close leave alert
  const closeLeaveAlert = () => {
    setIsLeaveAlertOpen(false);
  };

  const openRemoveAlert = (user1) => {
    setUserToRemove(user1);
    setIsRemoveAlertOpen(true);
  };

  const closeRemoveAlert = () => {
    setIsRemoveAlertOpen(false);
    setUserToRemove(null);
  };

  const handleRemoveUser = () => {
    closeRemoveAlert();
    handleRemove(userToRemove);
  };

  // hadler to add the user in the group
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    // check for the admin
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  // handler to rename the name of the group
  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  // handler to search the users
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]); // Clear results
      setIsSearched(false); // Reset search state
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      // console.log("search data:", data);
      setLoading(false);
      setSearchResult(data);
      setIsSearched(true); // Set search state to true after successful search
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the search results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Helvetica"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* All of the users that are currently inside the group */}
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
              {selectedChat.users.map((user) => (
                // <UserBadgeItem
                //   key={user._id}
                //   user={user}
                //   handleFunction={() => {
                //     if (
                //       selectedChat.groupAdmin._id === user._id ||
                //       user._id === user._id
                //     ) {
                //       handleRemove(user);
                //     } else {
                //       toast({
                //         title: "Only admins can remove someone!",
                //         status: "error",
                //         duration: 3000,
                //         isClosable: true,
                //         position: "top",
                //       });
                //     }
                //   }}
                // />
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => {
                    if (user._id === selectedChat.groupAdmin._id) {
                      toast({
                        title: "Admin cannot be removed!",
                        description: "Transfer admin rights before removing",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                        position: "top",
                      });
                    } else if (user._id === loggedUser._id) {
                      // If user is removing themselves
                      openLeaveAlert();
                    } else if (loggedUser._id === selectedChat.groupAdmin._id) {
                      // If logged-in user is admin and removing someone else
                      openRemoveAlert(user);
                    } else {
                      toast({
                        title: "Only admins can remove someone!",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                        position: "top",
                      });
                    }
                  }}
                />
              ))}
            </Box>
            {/* To update the group name */}
            <FormControl display={"flex"}>
              <Input
                placeholder="New Group Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            {/* To add the user in the group */}
            <FormControl>
              <Input
                placeholder="Add Users to Group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
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
            ) : (
              isSearched &&
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            {/* <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button> */}
            <Button onClick={openLeaveAlert} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Alert Dialog for leaving the group */}
      <AlertDialog
        isOpen={isLeaveAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeLeaveAlert}
        isCentered // Centers the dialog
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Leave Group Chat
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to leave group{" "}
              <Text as={"span"} fontWeight="bold">
                {" "}
                {selectedChat.chatName}{" "}
              </Text>
              ? You'll need to be added back to rejoin the group.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeLeaveAlert}>
                Stay
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleLeaveGroup(user)}
                ml={3}
                _hover={{
                  bg: "red.600",
                  transform: "scale(1.05)",
                }}
                transition="all 0.2s"
              >
                Leave Group
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Alert Dialog for removing user */}
      <AlertDialog
        isOpen={isRemoveAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeRemoveAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remove User
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to remove{" "}
              <Text as={"span"} fontWeight="bold">
                {" "}
                {userToRemove?.name}{" "}
              </Text>{" "}
              from the group?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeRemoveAlert}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleRemoveUser} ml={3}>
                Remove
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default UpdateGroupChatModal;
