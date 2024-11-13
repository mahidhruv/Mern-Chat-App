const chats = [
  {
    isGroupChat: false,
    users: [
      {
        name: "Deepanshi",
        email: "deepanshi@example.com",
      },
      {
        name: "Dhruv",
        email: "dhruv@example.com",
      },
    ],
    _id: "617a077e18c25468bc7c4dd4",
    chatName: "Deepanshi",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Garvit",
        email: "garvit@example.com",
      },
      {
        name: "Dhruv",
        email: "dhruv@example.com",
      },
    ],
    _id: "617a077e18c25778bc7c4dd4",
    chatName: "Garvit",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Guest User",
        email: "guest@example.com",
      },
      {
        name: "Dhruv",
        email: "dhruv@example.com",
      },
    ],
    _id: "617a077e18c25468b27c4dd4",
    chatName: "Guest User",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Virat",
        email: "virat@example.com",
      },
      {
        name: "Dhruv",
        email: "dhruv@example.com",
      },
    ],
    _id: "617a077e18c2d468bc7c4dd4",
    chatName: "Virat",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "Garvit",
        email: "garvit@example.com",
      },
      {
        name: "Dhruv",
        email: "dhruv@example.com",
      },
      {
        name: "Deepanshi",
        email: "deepanshi@example.com",
      },
    ],
    _id: "617a518c4081150716472c78",
    chatName: "Friends",
    groupAdmin: {
      name: "Dhruv",
      email: "dhruv@example.com",
    },
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Dhoni",
        email: "dhoni@example.com",
      },
      {
        name: "Dhruv",
        email: "dhruv@example.com",
      },
    ],
    _id: "617a077e18c25468bc7cfdd4",
    chatName: "Dhoni",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "Rohit",
        email: "rohit@example.com",
      },
      {
        name: "Dhruv",
        email: "dhruv@example.com",
      },
      {
        name: "Dhoni",
        email: "dhoni@example.com",
      },
    ],
    _id: "617a518c4081150016472c78",
    chatName: "Chill Zone",
    groupAdmin: {
      name: "Dhoni",
      email: "dhoni@example.com",
    },
  },
];

module.exports = { chats };
