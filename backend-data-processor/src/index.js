const express = require("express");
const app = express();
const port = 5001;
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const cookieParser = require("cookie-parser");
const { parse } = require("csv-parse");
const { finished } = require("stream/promises");
const fs = require("fs");
const pgp = require("pg-promise")();
const db = pgp("postgres://susu:potato@localhost:9000/susu");

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "5000mb" }));
app.use(cookieParser());

async function readCsv(filename) {
  const records = [];
  const parser = fs
    .createReadStream(`${__dirname}/../uploads/${filename}`)
    .pipe(parse({}));

  parser.on("readable", function () {
    let record;
    while ((record = parser.read()) !== null) {
      // Work with each record
      records.push(record);
    }
  });
  await finished(parser);
  return records;
}

function isCapacityCsvHeader(headers) {
  return (
    headers.length === 2 &&
    headers[0].toLowerCase() === "cycle_number" &&
    headers[1].toLowerCase() === "capacity"
  );
}

function isCycleInfoCsvHeader(headers) {
  return (
    headers.length === 4 &&
    headers[0].toLowerCase() === "cycle_number" &&
    headers[1].toLowerCase() === "time" &&
    headers[2].toLowerCase() === "current" &&
    headers[3].toLowerCase() === "voltage"
  );
}

app.post("/upload-csv", upload.single("csv-file"), async (req, res) => {
  let sid = req.cookies.sid;

  // If not exist SID then 400
  if (!sid) {
    res.status(400).end("Session does not exist");
    return;
  }

  try {
    if (req.body.type === "CAPACITY") {
      // Read csv lines
      const [csv_header, ...csv_lines] = await readCsv(req.file.filename);

      // Reject if csv format is not actually capacity type
      if (!isCapacityCsvHeader(csv_header)) {
        res.status(400).end("CSV file is not capacity type");
        return;
      }

      // Push each line to DB
      await Promise.all(
        csv_lines.map((elem) =>
          db.none(
            `INSERT INTO CAPACITY_INFO VALUES ('${sid}', '${req.body.name}', ${elem[0]}, ${elem[1]})`
          )
        )
      );
    } else if (req.body.type === "CYCLE_INFO") {
      // Read csv lines
      const [csv_header, ...csv_lines] = await readCsv(req.file.filename);

      // Reject if csv format is not actually cycle info type
      if (!isCycleInfoCsvHeader(csv_header)) {
        res.status(400).end("CSV file is not cycle info type");
        return;
      }

      // Push each line to DB
      await Promise.all(
        csv_lines.map((elem) =>
          db.none(
            `INSERT INTO CYCLE_INFO VALUES ('${sid}', '${req.body.name}', ${elem[0]}, ${elem[1]}, ${elem[2]}, ${elem[3]})`
          )
        )
      );
    }

    await db.none(
      `INSERT INTO FILE_LIST VALUES ('${sid}', '${req.body.name}', '${req.body.type}')`
    );

    res.end("Success!");
  } catch (error) {
    res.status(400).end("Failed to insert all / some rows from CSV!");
  }
});

app.get("/api/myfiles", async (req, res) => {
  try {
    const rows = await db.any(
      `SELECT FILENAME, FILE_TYPE FROM FILE_LIST WHERE SID = '${req.cookies.sid}'`
    );
    res.json(rows);
  } catch (error) {
    res.end("Failed to fetch file list");
  }
});

app.listen(port, () => {
  console.log(`Data processing server app listening on port ${port}`);
});
