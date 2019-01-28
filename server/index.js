const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  const homePage = path.join(__dirname, "..", "public", "index.html");
  res.sendFile(homePage);
});

app.post("/new", (req, res) => {
  let originalUrl;
  try {
    originalUrl = new URL(req.body.url);
  } catch (err) {
    return res.status(400).send({ error: "invalid URL" });
  }

  dns.lookup(originalUrl.hostname, err => {
    if (err) {
      return res.status(404).send({ error: "Address not found" });
    }
  });
});

app.set("port", process.env.PORT || 4100);

const server = app.listen(app.get("port"), () => {
  console.log(`Express running →  http://localhost:${server.address().port}`);
});
