import { useEffect, useState } from "react";
import { CsvUploadForm } from "./components/CsvUploadForm";
import axios from "axios";

function App() {
  useEffect(() => {
    async function fetchSession() {
      try {
        await axios.get("/api/get-session");
      } catch (error) {
        window.alert("Unable to set session. Please refresh!");
      }
    }

    fetchSession();
  }, []);

  useEffect(() => {
    async function fetchMyFileList() {
      try {
        const { data } = await axios.get("/api/myfiles");
        console.log(data);
      } catch (error) {
        window.alert("Unable to fetch my file list");
      }
    }

    fetchMyFileList();
  });

  return (
    <div>
      <CsvUploadForm />
    </div>
  );
}

export default App;
