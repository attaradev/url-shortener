const express = require("express");
const path = require("path");

const app = express();

app.get("/", (req, res) => {
  const homePage = path.join(__dirname, "..", "public", "index.html");
  res.sendFile(homePage);
});

app.use(express.static(path.join(__dirname, "..", "public")));

app.set("port", process.env.PORT || 4100);

const server = app.listen(app.get("port"), () => {
  console.log(`Express running →  http://localhost:${server.address().port}`);
});
