// export const getSender = (loggedUser, users) => {
//   return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
// };

export const getSender = (loggedUser, users) => {
  // Add safety checks
  if (!loggedUser || !users || !Array.isArray(users) || users.length < 2) {
    return null; // or return a default value/object based on your needs
  }

  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  // Add safety checks
  if (!loggedUser || !users || !Array.isArray(users) || users.length < 2) {
    return null; // or return a default value/object based on your needs
  }
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

// Where you're using getSender (likely in SingleChat component)
const SingleChat = ({ loggedUser, chat }) => {
  return (
    <>
      {chat && chat.users && chat.users.length > 0
        ? // Add null check when using getSenderFull
          getSenderFull(loggedUser, chat.users)
          ? getSender(loggedUser, chat.users)
          : "Loading chat..."
        : "Loading chat..."}
    </>
  );
};
