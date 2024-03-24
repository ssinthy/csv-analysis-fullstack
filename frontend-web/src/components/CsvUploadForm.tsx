import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { useCallback, useState } from "react";
import axios from "axios";

type CsvCategory = "CYCLE_INFO" | "CAPACITY";

function CsvUploadForm() {
  const [filename, setFilename] = useState<string | null>(null);
  const [filetype, setFiletype] = useState<CsvCategory | null>(null);
  const [filecontent, setFilecontent] = useState<File | null>(null);

  const [isUploading, setUploading] = useState<boolean>(false);

  const onSubmit = useCallback(
    async (event: React.SyntheticEvent) => {
      event.preventDefault();
      // TODO: show toast
      if (!filename || !filetype || !filecontent) return;

      let formData = new FormData();
      formData.append("name", filename);
      formData.append("type", filetype);
      formData.append("csv-file", filecontent);

      setUploading(true);

      try {
        await axios.post("/api/upload-csv", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setUploading(false);
        window.alert("Successfully uploaded!");
      } catch (error) {
        // TODO: handle error
        window.alert(error);
        setUploading(false);
      }
    },
    [filename, filetype, filecontent]
  );

  return (
    <form onSubmit={onSubmit}>
      <FormControl required>
        <InputLabel>File name</InputLabel>
        <TextField
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />
        <FormHelperText>Give your file a nice name</FormHelperText>
      </FormControl>
      <FormControl required>
        <InputLabel>File type</InputLabel>
        <Select
          value={filetype}
          onChange={(e) => setFiletype(e.target.value as CsvCategory)}
        >
          <MenuItem value={"CAPACITY"}>Capacity</MenuItem>
          <MenuItem value={"CYCLE_INFO"}>Cycle info</MenuItem>
        </Select>
        <FormHelperText>Select your file type</FormHelperText>
      </FormControl>
      <FormControl required>
        <Input
          type="file"
          inputProps={{ accept: ".csv" }}
          onChange={(e) => {
            let files = (e.target as HTMLInputElement).files;
            setFilecontent(files?.length ? files[0] : null);
          }}
        />
        <FormHelperText>Upload a csv file</FormHelperText>
      </FormControl>
      <Button
        variant="outlined"
        color="secondary"
        disabled={isUploading}
        type="submit"
      >
        {isUploading ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
}

export { CsvUploadForm };
