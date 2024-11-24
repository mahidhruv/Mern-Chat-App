import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
} from "@chakra-ui/react";
import Login from "../Components/Authentication/Login";
import Signup from "../Components/Authentication/Signup";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Homepage = () => {
  // Get the history object from react-router-dom for programmatic navigation
  const history = useHistory();

  // Use an effect hook to check user authentication status when the component mounts
  useEffect(() => {
    // Retrieve user information from local storage
    const user = JSON.parse(localStorage.getItem("userInfo"));

    // If user information exists (user is logged in)
    if (user) {
      // Redirect the user to the "/chats" route
      // This ensures authenticated users are directed to the main chat interface
      history.push("/chats");
    }
    // The effect depends on the history object, so it's included in the dependency array
  }, [history]);

  return (
    <Container maxW="xl" centerContent my={8} p={3}>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40 px 0 15 px 0"
        mb={6}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Text fontSize="4xl" fontFamily={"Helvetica"} color={"black"} px={4}>
          Talk-A-Tive
        </Text>
      </Box>
      <Box
        bg={"white"}
        w={"100%"}
        p={4}
        borderRadius={"lg"}
        borderWidth={"1px"}
        color={"black"}
      >
        <Tabs variant="soft-rounded" colorScheme="cyan">
          <TabList mb={"1em"} gap={4}>
            <Tab
              width={"50%"}
              _hover={{ boxShadow: "0 2px 4px rgba(128,128,128,0.7)" }}
              transition="box-shadow 0.2s"
            >
              Login
            </Tab>
            <Tab
              width={"50%"}
              _hover={{ boxShadow: "0 2px 4px rgba(128,128,128,0.7)" }}
              transition="box-shadow 0.2s"
            >
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
