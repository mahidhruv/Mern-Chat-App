import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const cloudinaryUploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const cancelRef = React.useRef();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      console.log("No image selected");
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      console.log("Valid image type, preparing to upload");
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", cloudinaryUploadPreset);
      data.append("cloud_name", cloudinaryCloudName);
      console.log("Uploading to Cloudinary...");
      fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        {
          method: "post",
          body: data,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("Upload successful, data:", data);
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error during upload:", err);
          setLoading(false);
          console.log(err);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }
  };

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

  const proceedWithSignup = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      console.log("Registration Successful", name);
      localStorage.setItem("userInfo", JSON.stringify(data));
      history.push("/chats");
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name) {
      showErrorToast("Missing Information!", "Name is required.");
      return;
    }
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
    if (!confirmPassword) {
      showErrorToast("Missing Information!", "Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      showErrorToast(
        "Validation Error!",
        "Please ensure both passwords match."
      );
      return;
    }

    // if (!pic) {
    //   // Show confirmation dialog
    //   const wantToContinue = window.confirm(
    //     "Are you sure you want to continue without choosing an image?"
    //   );
    //   if (!wantToContinue) {
    //     setLoading(false);
    //     return;
    //   }
    // }

    if (!pic) {
      setIsAlertOpen(true);
      setLoading(false);
      return;
    }

    await proceedWithSignup();
  };

  return (
    <VStack spacing={"5px"}>
      {/* Name Input */}
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="name"
          placeholder="Enter Your Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></Input>
      </FormControl>

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
          value={email || ""}
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

      {/* Confirm Password Input */}
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Enter Your Password Again"
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Input>
          <InputRightElement width={"4.5rem"}>
            <Button
              height="1.75rem"
              size="sm"
              onClick={toggleConfirmPasswordVisibility}
              mr={5}
              px={7}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* Picture Input */}
      <FormControl id="pic">
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        ></Input>
      </FormControl>

      {/* Button to Submit the Form */}
      <Button
        colorScheme="cyan"
        width="100%"
        marginTop={5}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              No Image Selected!
            </AlertDialogHeader>

            <AlertDialogBody>
              Do you want to continue without choosing a picture?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  setIsAlertOpen(false);
                  proceedWithSignup();
                }}
                ml={3}
              >
                Continue
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};

export default Signup;
