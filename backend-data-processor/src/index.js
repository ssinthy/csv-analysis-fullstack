require("dotenv").config();
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
const db = pgp(`postgres://susu:potato@${env.POSTGRES_URL}/susu`);

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

app.get("/myfiles", async (req, res) => {
  try {
    const rows = await db.any(
      `SELECT FILENAME, FILE_TYPE FROM FILE_LIST WHERE SID = '${req.cookies.sid}'`
    );
    res.json(rows);
  } catch (error) {
    res.status(400).end("Failed to fetch file list");
  }
});

app.get("/filecontent", async (req, res) => {
  const filetype = req.query.file_type;
  try {
    const queryParams = req.query;

    let tablename,
      columns,
      filter = "";

    // Set filter range for cycle number
    if (queryParams.minCycleNumber && queryParams.maxCycleNumber) {
      filter += ` AND CYCLE_NUMBER >= ${queryParams.minCycleNumber} AND CYCLE_NUMBER <= ${queryParams.maxCycleNumber}`;
    }

    if (filetype == "CAPACITY") {
      tablename = "CAPACITY_INFO";
      columns = "CYCLE_NUMBER, CAPACITY";
    } else {
      tablename = "CYCLE_INFO";
      columns = "CYCLE_NUMBER, TIME, CURRENT, VOLTAGE";

      // Set filter range for time
      if (queryParams.minTime && queryParams.maxTime) {
        filter += ` AND TIME >= ${queryParams.minTime} AND TIME <= ${queryParams.maxTime}`;
      }
    }

    try {
      let query = `SELECT ${columns} FROM ${tablename} WHERE SID = '${req.cookies.sid}' AND filename = '${req.query.filename}' ${filter}`;
      const rows = await db.any(query);

      res.json(
        rows.map((data) => {
          for (let key in data) {
            data[key] = parseFloat(data[key]);
          }
          return data;
        })
      );
    } catch (error) {
      res.status(400).end("Failed to fetch file content");
    }
  } catch (error) {
    res.status(400).end("Failed to fetch file content");
  }
});

app.listen(port, () => {
  console.log(`Data processing server app listening on port ${port}`);
});
