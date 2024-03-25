import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { CsvCategory } from "../types";
import axios from "axios";

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
    <form
      onSubmit={onSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        gap: 15,
      }}
    >
      <Typography>Upload a CSV file</Typography>
      <TextField
        label="File name"
        color="secondary"
        focused
        required
        value={filename}
        size="small"
        onChange={(e) => setFilename(e.target.value)}
      />
      <FormControl required>
        <InputLabel id="type-dd">File type</InputLabel>
        <Select
          label="File type"
          labelId="type-dd"
          value={filetype}
          onChange={(e) => setFiletype(e.target.value as CsvCategory)}
        >
          <MenuItem value={"CAPACITY"}>Capacity</MenuItem>
          <MenuItem value={"CYCLE_INFO"}>Cycle info</MenuItem>
        </Select>
      </FormControl>

      <FormControl
        required
        style={{ border: "1px solid lightgray", padding: 15, borderRadius: 10 }}
      >
        <Input
          type="file"
          size="small"
          inputProps={{ accept: ".csv" }}
          style={{ fontSize: "small" }}
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
        size="small"
        type="submit"
      >
        {isUploading ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
}

export { CsvUploadForm };
