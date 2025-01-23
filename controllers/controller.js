const { format } = require("date-fns");
const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

async function addUser(req, res) {
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 5),
    memberStatus: "guest",
  };

  await db.addUser(user);
  res.redirect("/sign-in");
}

async function addMessage(req, res) {
  const user = await db.getUserByEmail(res.locals.currentUser.email);
  const message = {
    title: req.body.title,
    text: req.body.text,
  };
  await db.addMessage(user[0].id, message);
  res.redirect("/");
}

async function deleteMessage(req, res) {
  await db.deleteMessage(req.params.id);
  res.status(200).send();
}

async function joinMember(req, res) {
  if (req.body.memberCode === "theodinproject") {
    await db.joinMember(res.locals.currentUser.email);
    res.redirect("/");
  } else {
    return res.status(400).render("join", {
      title: "Join Member",
      errors: { memberCode: "Invalid code" },
      data: req.body,
    });
  }
}

async function joinAdmin(req, res) {
  if (req.body.adminCode === "KvJellyBeanAdmin") {
    await db.joinAdmin(res.locals.currentUser.email);
    res.redirect("/");
  } else {
    return res.status(400).render("getAdmin", {
      title: "Become Admin",
      errors: { adminCode: "Invalid token" },
      data: req.body,
    });
  }
}

async function validateSignUp(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const mappedErrors = errors.array().reduce((acc, error) => {
      acc[error.path] = error.msg;
      return acc;
    }, {});

    return res.status(400).render("sign-up", {
      title: "Sign Up",
      errors: mappedErrors,
      data: req.body,
    });
  }

  const isEmailExist = await db.getUserByEmail(req.body.email);
  if (isEmailExist.length) {
    return res.status(400).render("sign-up", {
      title: "Sign Up",
      errors: { email: "Email already exists" },
      data: req.body,
    });
  }

  next();
}

async function validateSignIn(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const mappedErrors = errors.array().reduce((acc, error) => {
      acc[error.param] = error.msg;
      return acc;
    }, {});

    return res.status(400).render("sign-in", {
      title: "Sign In",
      errors: mappedErrors,
      data: req.body,
    });
  }

  const user = await db.getUserByEmail(req.body.email);

  if (!user.length) {
    return res.status(400).render("sign-in", {
      title: "Sign In",
      errors: { email: "Email is not registered" },
      data: req.body,
    });
  } else if (!bcrypt.compareSync(req.body.password, user[0].password)) {
    return res.status(400).render("sign-in", {
      title: "Sign In",
      errors: { password: "Incorrect password" },
      data: req.body,
    });
  }

  next();
}

async function renderLobby(req, res) {
  const messages = await db.getMessages();
  const users = await db.getUsers();

  for (let message of messages) {
    message.added = format(new Date(message.added), "P HH:mm a");
    message.user = await db.getUserById(message.userid);
  }

  res.render("index", {
    title: "JellySphere",
    messages: messages,
    Users: users,
  });
}

function renderSignIn(req, res) {
  res.render("sign-in", { title: "Sign In", errors: {}, data: {} });
}

function renderSignUp(req, res) {
  res.render("sign-up", { title: "Sign Up", errors: {}, data: {} });
}

async function renderMessageForm(req, res) {
  const users = await db.getUsers();
  res.render("form", { title: "New Post", Users: users });
}

async function renderMessageDetail(req, res) {
  const users = await db.getUsers();
  const message = await db.getMessageById(req.params.id);
  message.added = format(new Date(message.added), "P HH:mm a");
  message.user = await db.getUserById(message.userid);
  res.render("message", {
    title: message.title,
    message: message,
    Users: users,
  });
}

function renderProfile(req, res) {
  res.render("profile", { title: "Profile" });
}

function renderJoinMember(req, res) {
  res.render("join", { title: "Join Member", errors: {}, data: {} });
}

function renderGetAdmin(req, res) {
  res.render("getAdmin", { title: "Become Admin", errors: {}, data: {} });
}

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/sign-in");
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && res.locals.currentUser.isadmin) {
    return next();
  }
  res.redirect("/");
}

module.exports = {
  addUser,
  addMessage,
  deleteMessage,
  joinMember,
  joinAdmin,
  validateSignIn,
  validateSignUp,
  renderLobby,
  renderSignIn,
  renderSignUp,
  renderMessageForm,
  renderMessageDetail,
  renderProfile,
  renderJoinMember,
  renderGetAdmin,
  isAdmin,
  isAuthenticated,
};
