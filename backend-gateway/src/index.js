const express = require("express");
const app = express();
const port = 5000;
const pgp = require("pg-promise")();
const db = pgp("postgres://susu:potato@localhost:9000/susu");
const cookieParser = require("cookie-parser");
var proxy = require("express-http-proxy");

app.use(cookieParser());

app.use(async function sessionMiddleware(req, res, next) {
  // Do not generate new session if already exists
  if (req.cookies.sid) {
    next();
    return;
  }

  try {
    // Generate an uuid in database and fetch it
    const row = await db.one(
      `INSERT INTO VALID_SESSION_ID VALUES (gen_random_uuid()) RETURNING SID`
    );

    // Send SID to client as cookie
    res.cookie("sid", row.sid, { httpOnly: true });
    console.log("New session created!");

    next();
  } catch (error) {
    res.status(500).send({ error: "Unable to set session" });
  }
});

app.use("/api", proxy("http://localhost:5001"));

app.listen(port, () => {
  console.log(`Gateway server listening on port ${port}`);
});
