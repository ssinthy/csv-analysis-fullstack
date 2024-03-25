import { useEffect, useState } from "react";
import { CsvUploadForm } from "./components/CsvUploadForm";
import { FileMetadata } from "./types";
import axios from "axios";
import { Card, CardContent, Grid, List, Typography } from "@mui/material";
import { Visualizer } from "./components/Visualizer";
import { UploadedFileList } from "./components/UploadedFileList";

function App() {
  const [myFileList, setMyFileList] = useState<FileMetadata[]>([]);

  useEffect(() => {
    async function fetchSession() {
      try {
        await axios.get("/api/get-session");
      } catch (error) {
        // window.alert("Unable to set session. Please refresh!");
      }
    }

    fetchSession();
  }, []);

  useEffect(() => {
    async function fetchMyFileList() {
      try {
        const { data } = await axios.get("/api/myfiles");
        setMyFileList(data);
      } catch (error) {
        // window.alert("Unable to fetch my file list");
      }
    }

    fetchMyFileList();
  }, []);

  return (
    // <div>

    //   {/* <CsvUploadForm />
    //   <Visualizer myFileList={myFileList} /> */}
    // </div>
    <Grid
      container
      spacing={2}
      sx={{ flexGrow: 1 }}
      style={{
        width: "100%",
        margin: 0,
      }}
    >
      <Grid
        container
        xs={0}
        md={3}
        direction={"column"}
        display={{ xs: "none", md: "inherit" }}
      >
        <Grid
          item
          xs={0}
          md={1}
          display={{ xs: "none", md: "inherit" }}
          component={Card}
        >
          <CardContent>
            <Typography>Avaiable file list</Typography>
          </CardContent>
        </Grid>
        <Grid
          item
          xs={0}
          md={7}
          style={{ overflow: "auto" }}
          display={{ xs: "none", md: "inherit" }}
          direction={"column"}
          component={List}
        >
          <UploadedFileList myFileList={myFileList} />
        </Grid>
        <Grid item xs={0} md={4} style={{ backgroundColor: "yellow" }}>
          <CsvUploadForm />
        </Grid>
      </Grid>
      <Grid container xs={12} md={9} direction={"column"}>
        <Grid item xs={2} md={2} style={{ backgroundColor: "orange" }}></Grid>
        <Grid item xs={10} md={10} style={{ backgroundColor: "gray" }}></Grid>
      </Grid>
    </Grid>
  );
}

export default App;
