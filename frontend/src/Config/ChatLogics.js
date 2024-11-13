// export const getSender = (loggedUser, users) => {
//   return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
// };

export const getSender = (loggedUser, users) => {
  // Add safety checks
  if (!loggedUser || !users || !Array.isArray(users) || users.length < 2) {
    return "Loading..."; // or return some default value
  }
  
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

// Where you're using getSender (likely in SingleChat component)
const SingleChat = ({ loggedUser, chat }) => {
  // Receive as props
  return (
    <>
      {chat && chat.users && chat.users.length > 0
        ? getSender(loggedUser, chat.users)
        : "Loading chat..."}
    </>
  );
};

