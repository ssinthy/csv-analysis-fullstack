import { FileMetadata } from "../types";
import {
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
  Input,
  FormGroup,
  Button,
} from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

type Props = {
  myFileList: FileMetadata[];
};

function Visualizer(props: Props) {
  const { myFileList } = props;

  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);

  const [minCycleNumber, setMinCycleNumber] = useState<number>(0);
  const [minTime, setMinTime] = useState<number>(0);
  const [maxCycleNumber, setMaxCycleNumber] = useState<number>(0);
  const [maxTime, setMaxTime] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);

  const onSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();

      setLoading(true);

      let filters: any = {
        minCycleNumber,
        maxCycleNumber,
      };

      if (selectedFile?.file_type === "CYCLE_INFO") {
        filters = {
          ...filters,
          minTime,
          maxTime,
        };
      }

      try {
        const { data } = await axios.get("/api/filecontent", {
          params: {
            filename: selectedFile?.filename,
            file_type: selectedFile?.file_type,
            ...filters,
          },
        });
        console.log(data);
      } catch (error) {
        window.alert("Unable to fetch file content");
      }

      setLoading(false);
    },
    [selectedFile, minCycleNumber, minTime, maxCycleNumber, maxTime]
  );

  return (
    <form style={{ border: "1px solid black" }} onSubmit={onSubmit}>
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
        <FormHelperText>Select your file </FormHelperText>
      </FormControl>

      <FormGroup row>
        <InputLabel>Cycle Number</InputLabel>
        <FormControl>
          <InputLabel>Min</InputLabel>
          <Input
            type="number"
            onChange={(e) => setMinCycleNumber(parseInt(e.target.value, 10))}
          />
        </FormControl>
        <FormControl>
          <InputLabel>Max</InputLabel>
          <Input
            type="number"
            onChange={(e) => setMaxCycleNumber(parseInt(e.target.value, 10))}
          />
        </FormControl>
      </FormGroup>

      {selectedFile?.file_type === "CYCLE_INFO" && (
        <FormGroup row>
          <InputLabel>Time</InputLabel>
          <FormControl>
            <InputLabel>Min</InputLabel>
            <Input
              type="number"
              onChange={(e) => setMinTime(parseInt(e.target.value, 10))}
            />
          </FormControl>
          <FormControl>
            <InputLabel>Max</InputLabel>
            <Input
              type="number"
              onChange={(e) => setMaxTime(parseInt(e.target.value, 10))}
            />
          </FormControl>
        </FormGroup>
      )}

      <Button
        variant="outlined"
        color="secondary"
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? "Loading..." : "Load"}
      </Button>
    </form>
  );
}

export { Visualizer };
