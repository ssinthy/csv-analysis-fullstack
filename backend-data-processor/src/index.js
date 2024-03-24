const express = require("express");
const app = express();
const port = 5001;
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

app.post("/upload-csv", upload.single("file"), (req, res) => {
  console.log(req.body);
  console.log(req.files);
  res.json({ message: "Successfully uploaded files" });
});

app.get("/dummy", async (req, res) => {
  res.send("I am dummy");
});

app.listen(port, () => {
  console.log(`Data processing server app listening on port ${port}`);
});
