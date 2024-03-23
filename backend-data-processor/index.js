const express = require("express");
const app = express();
const port = 5001;

app.get("/", (req, res) => {
  res.send("I am data processor server!");
});

app.listen(port, () => {
  console.log(`Data processing server app listening on port ${port}`);
});
