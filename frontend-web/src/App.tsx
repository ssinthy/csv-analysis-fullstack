import { useEffect, useState } from "react";
import { CsvUploadForm } from "./components/CsvUploadForm";
import axios from "axios";

function App() {
  useEffect(() => {
    axios
      .get("/api/get-session")
      .catch(() => window.alert("Unable to set session. Please refresh!"));
  }, []);

  return (
    <div>
      <CsvUploadForm />
    </div>
  );
}

export default App;
