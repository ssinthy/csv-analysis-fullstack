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

type CsvCategory = "CYCLE_INFO" | "CAPACITY";

function CsvUploadForm() {
  const [filename, setFilename] = useState<string | null>(null);
  const [filetype, setFiletype] = useState<CsvCategory | null>(null);
  const [filecontent, setFilecontent] = useState<File | null>(null);

  const onSubmit = useCallback(() => {}, [filename, filetype, filecontent]);

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

      <Button variant="outlined" color="secondary" type="submit">
        Upload
      </Button>
    </form>
  );
}

export { CsvUploadForm };
