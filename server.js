const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, "messages.json");

app.use(express.json());
app.use(express.static("public"));

if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, JSON.stringify([]));
}

app.get("/messages", (req, res) => {
  const username = req.query.username;
  const messages = JSON.parse(fs.readFileSync(FILE_PATH));
  const filtered = messages.filter(
    m => m.recipient === username || m.recipient === "all"
  );
  res.json(filtered);
});

app.post("/messages", (req, res) => {
  const messages = JSON.parse(fs.readFileSync(FILE_PATH));
  messages.push(req.body);
  fs.writeFileSync(FILE_PATH, JSON.stringify(messages, null, 2));
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
