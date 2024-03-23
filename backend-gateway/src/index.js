const express = require("express");
const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("Gateway: Hello World!");
});

app.listen(port, () => {
  console.log(`Gateway server listening on port ${port}`);
});
