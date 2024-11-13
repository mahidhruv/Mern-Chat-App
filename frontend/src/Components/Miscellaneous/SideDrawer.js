import {
  Avatar,
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

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [chatLoading, setChatLoading] = useState();

  // Accessing user data, selected chat state, chats array and their setter functions from Chat context
  const { user, setSelectedChat, chats, setChats } = ChatState();

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

      // this will return the chat that is selected
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      // Check if the chat doesn't already exist in the chats array, and if so, add it
      if (!chats.find((c) => c._id === data._id)) {
        // If chat with this ID is NOT found. Add new chat to the beginning of the array
        // New chat appears at the top
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setChatLoading(false);
      handleDrawerClose();
      // onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    } finally {
      setChatLoading(false); // Always reset loading state
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
              <BellIcon fontSize={"2xl"} margin={"1"} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
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
