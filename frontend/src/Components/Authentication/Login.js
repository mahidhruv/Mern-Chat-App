import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showErrorToast = (title, message) => {
    toast({
      title: title,
      description: message,
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    setLoading(false);
    return;
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!email) {
      showErrorToast("Missing Information!", "Email is required.");
      return;
    }
    if (!isValidEmail(email)) {
      showErrorToast(
        "Validation Error!",
        "Please enter a valid email address."
      );
      return;
    }
    if (!password) {
      showErrorToast("Missing Information!", "Password is required.");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showErrorToast("Validation Error!", "Incorrect email or password.");
      } else {
        showErrorToast(
          "Error Occurred!",
          error.response?.data?.message || "An unexpected error occurred."
        );
      }
      setLoading(false);
    }
  };

  const setGuestCredentials = () => {
    setEmail("guest@example.com");
    setPassword("1234567");
  };

  return (
    <VStack spacing={"5px"}>
      {/* Email Input */}
      <FormControl
        id="email"
        isRequired
        isInvalid={email && !isValidEmail(email)}
      >
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {email && !isValidEmail(email) && (
          <FormErrorMessage>
            Please enter a valid email address.
          </FormErrorMessage>
        )}
      </FormControl>

      {/* Password Input */}
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <InputRightElement width={"4.5rem"}>
            <Button
              height="1.75rem"
              size="sm"
              onClick={togglePasswordVisibility}
              mr={5}
              px={7}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* Button to Login */}
      <Button
        colorScheme="cyan"
        width="100%"
        onClick={submitHandler}
        marginTop={5}
        isLoading={loading}
      >
        Login
      </Button>

      {/* Button to get guest credentials */}
      <Button
        colorScheme="purple"
        width="100%"
        onClick={() => {
          setGuestCredentials();
        }}
        marginTop={0}
        marginBottom={0}
      >
        Guest Credentials
      </Button>
    </VStack>
  );
};

export default Login;
