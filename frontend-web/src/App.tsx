import { useEffect, useState } from "react";
import { CsvUploadForm } from "./components/CsvUploadForm";
import { FileMetadata } from "./types";
import axios from "axios";

function App() {
  const [myFileList, setMyFileList] = useState<FileMetadata[]>([]);

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
        setMyFileList(data);
      } catch (error) {
        window.alert("Unable to fetch my file list");
      }
    }

    fetchMyFileList();
  }, []);

  return (
    <div>
      <CsvUploadForm />
    </div>
  );
}

export default App;
