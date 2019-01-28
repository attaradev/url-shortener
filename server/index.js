require("dotenv").config();

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const nanoid = require("nanoid");
const { MongoClient } = require("mongodb");

const databaseURL = process.env.DATABASE;

const app = express();
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

MongoClient.connect(
  databaseURL,
  { useNewUrlParser: true }
)
  .then(client => {
    app.locals.db = client.db("shortener");
  })
  .catch(() => console.error("Failed to connect to database"));

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

    const { db } = req.app.locals;
    shortenURL(db, originalUrl.href)
      .then(result => {
        const doc = result.value;
        res.json({
          original_url: doc.original_url,
          short_id: doc.short_id
        });
      })
      .catch(console.error);
  });
});

const shortenURL = (db, url) => {
  const shortenedURLs = db.collection("shortenedURLs");
  return shortenedURLs.findOneAndUpdate(
    { originalUrl: url },
    { $setOnInsert: { originalUrl: url, short_id: nanoid(7) } },
    { returnOriginal: false, upsert: true }
  );
};

app.set("port", process.env.PORT || 4100);

const server = app.listen(app.get("port"), () => {
  console.log(`Express running →  http://localhost:${server.address().port}`);
});
