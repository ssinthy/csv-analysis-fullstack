const express = require("express");
const app = express();
const port = 5000;
const pgp = require("pg-promise")();
const db = pgp("postgres://susu:potato@localhost:9000/susu");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.get("/dummy", async (req, res) => {
  // Do not generate new session if already exists
  if (req.cookies.sid) {
    res.send("Already SID exists");
    return;
  }

  try {
    // Generate an uuid in database and fetch it
    const row = await db.one(
      `INSERT INTO VALID_SESSION_ID VALUES (gen_random_uuid()) RETURNING SID`
    );

    // Send SID to client as cookie
    res.cookie("sid", row.sid, { httpOnly: true }).send("SID set as cookie!");
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.listen(port, () => {
  console.log(`Gateway server listening on port ${port}`);
});
