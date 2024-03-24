import { useEffect, useState } from "react";
import { CsvUploadForm, type CsvCategory } from "./components/CsvUploadForm";
import axios from "axios";

type FileMetadata = {
  filename: string;
  fileType: CsvCategory;
};

function App() {
  const [myFileList, setMyFileList] = useState<FileMetadata[] | null>(null);

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
        console.log(data);
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
