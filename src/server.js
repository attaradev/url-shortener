const express = require("express");
const path = require("path");

const app = express();

app.set("port", process.env.PORT || 4100);

const server = app.listen(app.get("port"), () => {
  console.log(`Express running →  http://localhost:${server.address().port}`);
});
