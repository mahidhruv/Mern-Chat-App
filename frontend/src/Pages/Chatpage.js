import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/Miscellaneous/SideDrawer";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";

const Chatpage = () => {
  // user state from context api
  const { user, setUser } = ChatState();

  // fetch again state
  const [fetchAgain, setFetchAgain] = useState(false);

  // this is for rendering the page for the first time properly otherwise need to refresh it
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    }
  }, [setUser]);

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      {user && <SideDrawer />}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        width={"100%"}
        height={"91.5vh"}
        padding={"10px"}
      >
        {user && <MyChats />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;

// initial unused code of Chat Page

// const Chatpage = () => {
//   const [chats, setChats] = useState([]);
//     // const fetchChats = async () => {
//     //   const response = await axios.get("/api/chats");
//     //   setChats(response.data.data);
//     //   console.log("API response:", response.data); // Log the entire response
//     // };
//   const fetchChats = async () => {
//     try {
//       const response = await axios.get("/api/chats");
//       console.log("API response:", response.data); // Log the entire response
//       if (Array.isArray(response.data.data)) {
//         setChats(response.data.data);
//       } else {
//         console.error("Received data is not an array:", response.data.data);
//         setChats([]);
//       }
//     } catch (error) {
//       console.error("Error fetching chats:", error);
//       setChats([]);
//     }
//   };

//   useEffect(() => {
//     fetchChats();
//   }, []);

//     // return (
//     //   <div>
//     //     {chats.map((chat) => (
//     //       <div key={chat._id}>{chat.chatName}</div>
//     //     ))}
//     //   </div>
//     // );
//   return (
//     <div>
//       {chats && chats.length > 0 ? (
//         chats.map((chat, index) => (
//           <div key={chat._id || index}>
//             {chat.chatName || chat.name || "Unnamed Chat"}
//           </div>
//         ))
//       ) : (
//         <p>No chats available</p>
//       )}
//     </div>
//   );
// };
