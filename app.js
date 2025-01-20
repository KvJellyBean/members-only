const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("./config/passport");
const pgSession = require("connect-pg-simple")(session);

const app = express();
const port = process.env.PORT || 3000;
const assetsPath = path.join(__dirname, "public");
const pool = require("./db/pool");

const home = require("./routes/index");
const signUp = require("./routes/sign-up");
const signIn = require("./routes/sign-in");
const profile = require("./routes/profile");
const joinMember = require("./routes/joinMember");
const newMessage = require("./routes/message");
const getAdmin = require("./routes/getAdmin");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(assetsPath));

app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "session",
    }),
    secret: "jellybean",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", home);
app.use("/sign-up", signUp);
app.use("/sign-in", signIn);
app.use("/profile", profile);
app.use("/join", joinMember);
app.use("/message", newMessage);
app.use("/getAdmin", getAdmin);
app.get("/logout", async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid");
      return res.redirect("/sign-in");
    });
  });
});

app.use((req, res, next) => {
  res.status(404).render("404");
});

app.use((err, req, res, next) => {
  res.status(500).render("500");
});

app.listen(port, () => {
  console.log(`Application running at http://localhost:${port}`);
});
