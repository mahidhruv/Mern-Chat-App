import {
  Box,
  Button,
  FormControl,
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
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  // handle to search users
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]); // Clear the search results when query is empty
      return;
    }
    try {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      // console.log("search data:", data);
      setSearchResult(data);
      setIsLoading(false);
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

  // submit handle to create a group chat
  const handleSubmit = async () => {
    if (!groupChatName || !setSelectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );
      setChats([data, ...chats]);
      handleModalClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Group Chat!",
        description: "Atleast 3 group members required.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  // handle to handle add users to group
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  // delete handler to delete user from group
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  // handle modal close
  const handleModalClose = () => {
    setGroupChatName("");
    setSelectedUsers([]);
    setSearch("");
    setSearchResult([]);
    onClose();
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Helvetica"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            {/* Chat Name */}
            <FormControl>
              <Input
                placeholder="Group Name"
                marginBottom={1}
                onChange={(e) => setGroupChatName(e.target.value)}
              ></Input>
            </FormControl>

            {/* Search */}
            <FormControl>
              <Input
                placeholder="Add Users to Group"
                marginBottom={3}
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
            </FormControl>

            {/* list of selected users */}

            {/* render searched users */}
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>
            {isLoading ? (
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
                  Loading Users...
                </Text>
              </Box>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="cyan" mr={2} onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
