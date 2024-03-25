require("dotenv").config();
const express = require("express");
const app = express();
const port = 5000;
const pgp = require("pg-promise")();
const db = pgp(`postgres://susu:potato@${env.POSTGRES_URL}/susu`);
const cookieParser = require("cookie-parser");
var proxy = require("express-http-proxy");

app.use(express.urlencoded({ limit: "5000mb" }));

app.use(cookieParser());

app.get("/api/get-session", async (req, res) => {
  // Do not generate new session if already exists
  try {
    if (req.cookies.sid) {
      // Check if session exists in database
      try {
        const rows = await db.any(
          `SELECT * FROM VALID_SESSION_ID WHERE SID = '${req.cookies.sid}'`
        );

        // Do nothing if already exists
        if (rows.length > 0) {
          res.end();
          return;
        }
      } catch (err) {
        res.status(400).end("Failed to check session table");
        return;
      }
    }

    // Generate an uuid in database and fetch it
    const row = await db.one(
      `INSERT INTO VALID_SESSION_ID VALUES (gen_random_uuid()) RETURNING SID`
    );

    // Send SID to client as cookie
    res.cookie("sid", row.sid, { httpOnly: true });
    console.log("New session created!");
    res.end();
  } catch (error) {
    res.status(500).send({ error: "Unable to set session" });
  }
});

app.use(async function sessionCheckMiddleware(req, res, next) {
  // Do not generate new session if already exists
  if (req.cookies.sid) {
    next();
    return;
  }
  res.status(500).send({ error: "Session does not exist" });
});

// Proxy all API requests to DP server and DO NOT parse multipart request
app.use("/api", (req, res, next) => {
  const isMultipartRequest = (req) => {
    const contentTypeHeader = req.headers["content-type"];
    return contentTypeHeader && contentTypeHeader.indexOf("multipart") > -1;
  };

  return proxy("http://localhost:5001", {
    parseReqBody: !isMultipartRequest(req),
    // your other fields here...
  })(req, res, next);
});

app.listen(port, () => {
  console.log(`Gateway server listening on port ${port}`);
});
