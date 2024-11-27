import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../Config/ChatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [chatLoading, setChatLoading] = useState();

  // Accessing user data, selected chat state, chats array and their setter functions from Chat context
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  // history
  const history = useHistory();

  // For Drawer
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const btnRef = React.useRef();

  // logout handler
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
    // window.location.href = "/";
  };

  // drawer close handler
  const handleDrawerClose = () => {
    setSearch("");
    setSearchResult([]);
    setIsSearched(false);
    onClose();
  };

  // search handler
  const handleSearchInputChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
      setSearchResult([]);
      setIsSearched(false);
    }
  };

  const toast = useToast();

  // handle search
  const handleSearch = async () => {
    if (!search) {
      console.log("Please enter something in search");
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    // for search the user in the database
    try {
      setLoading(true);
      setIsSearched(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setSearchResult(data);
      setLoading(false);

      // Check if no users were found
      if (data.length === 0) {
        toast({
          title: "No User Found",
          description: "Please search with different name or email",
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "top-left",
        });
        setSearchResult([]);
        return;
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setChatLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      // CHANGE 1: Add retry mechanism for chat creation
      const createChat = async (retryCount = 0) => {
        try {
          const { data } = await axios.post(`/api/chat`, { userId }, config);
          console.log("Chat creation response:", data);

          if (!data || !data.users) {
            if (retryCount < 2) {
              // Try up to 2 times
              await new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100 ms
              return await createChat(retryCount + 1);
            }
            throw new Error("Chat creation failed");
          }
          return data;
        } catch (error) {
          if (retryCount < 2) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            return await createChat(retryCount + 1);
          }
          throw error;
        }
      };

      // CHANGE 2: First fetch user details
      const userResponse = await axios.get(
        `/api/user?search=${userId}`,
        config
      );
      const selectedUser = Array.isArray(userResponse.data)
        ? userResponse.data[0]
        : userResponse.data;

      // CHANGE 3: Create/fetch chat with retry mechanism
      const chatData = await createChat();

      // CHANGE 4: Update users array with full details
      if (selectedUser && chatData.users) {
        chatData.users = chatData.users.map((u) =>
          u._id === selectedUser._id ? selectedUser : u
        );
      }

      console.log("Final chat data:", chatData);

      // Update chats list if needed
      if (Array.isArray(chats)) {
        if (!chats.find((c) => c._id === chatData._id)) {
          setChats([chatData, ...chats]);
        }
      }

      setSelectedChat(chatData);
      setChatLoading(false);
      handleDrawerClose();
    } catch (error) {
      console.error("Chat access error:", error);
      toast({
        title: "Error fetching the chat",
        description: error.message || "Unable to load chat details",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", sm: "flex" }} paddingX={"2"}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={"2xl"} fontFamily={"Helvetica"}>
          Talk-A-Tive
        </Text>

        <div>
          <Menu>
            <MenuButton padding={"1"}>
              {/* Notification Badge */}
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />

              <BellIcon fontSize={"2xl"} margin={"1"} />
            </MenuButton>
            {/* Rendering of the notifications */}
            <MenuList
              style={{
                maxHeight: "300px", // Set maximum height
                overflowY: "auto", // Enable scrolling if needed
                padding: "10px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                border: "1px solid #e0e0e0",
              }}
            >
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    // setNotification(notification.filter((n) => n !== notif));
                    // Filter out all notifications from the same chat
                    const remainingNotifications = notification.filter(
                      (n) => n.chat._id !== notif.chat._id
                    );
                    // If multiple notifications were cleared
                    if (
                      notification.length - remainingNotifications.length >
                      1
                    ) {
                      toast({
                        title: "Notifications Cleared",
                        description: `Cleared ${
                          notification.length - remainingNotifications.length
                        } notifications from this chat`,
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                        position: "top-right",
                      });
                    }

                    setNotification(remainingNotifications);
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        // onClose={onClose}
        onClose={handleDrawerClose}
        // finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton marginTop={"7px"} marginRight={"10px"} />
          <DrawerHeader borderBottomWidth={"1px"}>Search User</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} paddingBottom={"2"}>
              <Input
                placeholder="Search by name or email"
                marginRight={"2"}
                value={search}
                // onChange={(e) => setSearch(e.target.value)}
                onChange={handleSearchInputChange}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              <>
                {searchResult?.length > 0
                  ? searchResult.map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => accessChat(user._id)}
                      />
                    ))
                  : isSearched &&
                    search && (
                      <Box textAlign="center" py={4}>
                        <Text color="gray.500">
                          No users found. Try searching with a different name or
                          email.
                        </Text>
                      </Box>
                    )}
              </>
            )}
            {/* {chatLoading && <Spinner ml="auto" display="flex" />} */}
            {chatLoading && (
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
            )}
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={handleDrawerClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
