const pool = require("./pool");

async function getUsers() {
  const query = "SELECT * FROM users";
  const { rows } = await pool
    .query(query)
    .catch((err) => console.error("Error executing query", err.stack));
  return rows;
}

async function getUserById(id) {
  const query = "SELECT * FROM users WHERE id = $1";
  const { rows } = await pool
    .query(query, [id])
    .catch((err) => console.error("Error executing query", err.stack));
  return rows[0].firstname + " " + rows[0].lastname;
}

async function getUserByEmail(email) {
  const query = "SELECT * FROM users WHERE email = $1";
  const { rows } = await pool
    .query(query, [email])
    .catch((err) => console.error("Error executing query", err.stack));
  return rows;
}

async function getMessages() {
  const query = "SELECT * FROM messages ORDER BY added";
  const { rows } = await pool
    .query(query)
    .catch((err) => console.error("Error executing query", err.stack));
  return rows;
}

async function getMessageById(id) {
  const query = "SELECT * FROM messages WHERE id = $1";
  const { rows } = await pool
    .query(query, [id])
    .catch((err) => console.error("Error executing query", err.stack));
  return rows[0];
}

async function addUser(user) {
  await pool
    .query(
      "INSERT INTO users(firstName, lastName, email, password, memberStatus) VALUES ($1, $2, $3, $4, $5)",
      [
        user.firstName,
        user.lastName,
        user.email,
        user.password,
        user.memberStatus,
      ]
    )
    .catch((err) => console.error("Error executing query", err.stack));
}

async function addMessage(userId, message) {
  await pool
    .query(
      "INSERT INTO messages(userId, title, text, added) VALUES ($1, $2, $3, NOW())",
      [userId, message.title, message.text]
    )
    .catch((err) => console.error("Error executing query", err.stack));
}

async function deleteMessage(id) {
  await pool
    .query("DELETE FROM messages WHERE id = $1", [id])
    .catch((err) => console.error("Error executing query", err.stack));
}

async function joinMember(email) {
  await pool
    .query("UPDATE users SET memberstatus = 'member' WHERE email = $1", [email])
    .catch((err) => console.error("Error executing query", err.stack));
}

async function joinAdmin(email) {
  await pool
    .query("UPDATE users SET isadmin = true WHERE email = $1", [email])
    .catch((err) => console.error("Error executing query", err.stack));
}

module.exports = {
  getUsers,
  getUserById,
  getUserByEmail,
  getMessages,
  getMessageById,
  addUser,
  addMessage,
  deleteMessage,
  joinMember,
  joinAdmin,
};
