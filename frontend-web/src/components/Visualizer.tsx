import { FileMetadata } from "../types";
import {
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

type Props = {
  myFileList: FileMetadata[];
};

function Visualizer(props: Props) {
  const { myFileList } = props;

  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);

  useEffect(() => {
    async function fetchFileContent() {
      try {
        const { data } = await axios.get("/api/filecontent", {
          params: {
            filename: selectedFile?.filename,
            file_type: selectedFile?.file_type,
            filters: {},
          },
        });
        console.log(data);
      } catch (error) {
        window.alert("Unable to fetch file content");
      }
    }

    if (selectedFile) {
      fetchFileContent();
    }
  }, [selectedFile]);

  return (
    <div style={{ border: "1px solid black" }}>
      <FormControl required>
        <InputLabel>File type</InputLabel>
        <Select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value as FileMetadata)}
        >
          {myFileList.map((item: FileMetadata) => {
            const label: string = `${item.file_type} | ${item.filename}`;
            return (
              //@ts-ignore - necessary to load object into value
              <MenuItem key={label} value={item}>
                {label}
              </MenuItem>
            );
          })}
        </Select>
        <FormHelperText>Select your file type</FormHelperText>
      </FormControl>
    </div>
  );
}

export { Visualizer };
