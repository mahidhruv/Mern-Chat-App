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
export const SingleChat = ({ loggedUser, chat }) => {
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

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};