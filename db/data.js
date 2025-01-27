const bcrypt = require("bcryptjs");

const users = [
  {
    firstName: "Jelly",
    lastName: "Bean",
    email: "jellybean@gmail.com",
    password: bcrypt.hashSync("KvJellyBean", 5),
    memberStatus: "member",
    isAdmin: true,
  },
  {
    firstName: "Jelly",
    lastName: "Member",
    email: "jellymember@gmail.com",
    memberStatus: "member",
    password: bcrypt.hashSync("KvJellyBean", 5),
  },
  {
    firstName: "Jelly",
    lastName: "NonMember",
    email: "jellynonmember@gmail.com",
    memberStatus: "guest",
    password: bcrypt.hashSync("KvJellyBean", 5),
  },
];
const messages = [
  {
    userId: 1,
    title: "Welcome to JELLYSPHERE!",
    text: "This is the first post.",
  },
  {
    userId: 2,
    title: "Hello World!",
    text: "Hi, Nice to know you guys.",
  },
];

module.exports = { users, messages };
