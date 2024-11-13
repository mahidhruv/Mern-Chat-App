// This code sets up a context for managing the user's authentication state in a React application. It checks if the user is logged in by looking for userInfo in the local storage. If the user is not logged in, they are redirected to the login page. The user state and the setUser function are made available to other components through the ChatContext, allowing them to access and modify the user's authentication state as needed.

import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

// Create a new context called ChatContext
const ChatContext = createContext();

// Define the ChatProvider component
const ChatProvider = ({ children }) => {
  // State to hold the user's information
  const [user, setUser] = useState("");

  // State to hold selected chat
  const [selectedChat, setSelectedChat] = useState();

  // State to hold all the chats
  const [chats, setChats] = useState([]);

  // checking if the user is not logged in then push it to the "/" route
  // Get the history object from react-router-dom
  const history = useHistory();

  // Use the useEffect hook to check if the user is logged in
  useEffect(() => {
    // Retrieve the user's information from the local storage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // console.log("userinfo: ", userInfo);

    // Update the user state with the retrieved information
    setUser(userInfo);

    // If the user is not logged in (userInfo is falsy), redirect to the root path
    if (!userInfo) {
      history.push("/");
    }
  }, [history]);

  // make user state global by putting it with value attribute
  // Render the provider component and pass the user state and setUser function as the context value
  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Define a custom hook to consume the ChatContext
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
