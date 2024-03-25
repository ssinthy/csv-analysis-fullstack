import { useEffect, useState } from "react";
import { CsvUploadForm } from "./components/CsvUploadForm";
import { FileMetadata } from "./types";
import axios from "axios";
import { Box, Card, CardContent, Grid, List, Typography } from "@mui/material";
import { Visualizer } from "./components/Visualizer";
import { UploadedFileList } from "./components/UploadedFileList";

function App() {
  const [myFileList, setMyFileList] = useState<FileMetadata[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);

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
    <Grid
      container
      spacing={2}
      sx={{ flexGrow: 1 }}
      style={{
        width: "100%",
        margin: 0,
        maxHeight: "100vh",
      }}
    >
      <Grid
        container
        xs={0}
        md={3}
        direction={"column"}
        display={{ xs: "none", md: "inherit" }}
        style={{ height: "100vh" }}
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
          md={6}
          style={{ overflow: "auto" }}
          display={{ xs: "none", md: "inherit" }}
          direction={"column"}
          component={List}
        >
          <UploadedFileList
            myFileList={myFileList}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        </Grid>
        <Grid
          item
          xs={0}
          md={5}
          component={Box}
          spacing={10}
          style={{ overflow: "auto" }}
          fontSize={"small"}
        >
          <CsvUploadForm />
        </Grid>
      </Grid>

      <Grid
        container
        xs={12}
        md={9}
        direction={"column"}
        style={{ height: "100vh" }}
        gap={10}
      >
        <Visualizer selectedFile={selectedFile} />
      </Grid>
    </Grid>
  );
}

export default App;
