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
  Box,
  Typography,
  Grid,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

type Props = {
  selectedFile: FileMetadata | null;
};

function Visualizer(props: Props) {
  const { selectedFile } = props;

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

  if (!selectedFile) {
    return <Typography color={"red"}>No file selected</Typography>;
  }

  return (
    <Grid item padding={5}>
      <Typography variant="h4" marginBottom={2}>
        {selectedFile.filename}
      </Typography>

      <form onSubmit={onSubmit}>
        <div
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          <Box margin={"5px"}>
            <InputLabel>Cycle Number</InputLabel>
            <FormGroup row>
              <TextField
                label="Min"
                type="number"
                size="small"
                onChange={(e) =>
                  setMinCycleNumber(parseInt(e.target.value, 10))
                }
              />
              <TextField
                label="Max"
                type="number"
                size="small"
                onChange={(e) =>
                  setMaxCycleNumber(parseInt(e.target.value, 10))
                }
              />
            </FormGroup>
          </Box>

          {selectedFile?.file_type === "CYCLE_INFO" && (
            <Box margin={"5px"}>
              <InputLabel>Time</InputLabel>
              <FormGroup row>
                <TextField
                  label="Min"
                  type="number"
                  size="small"
                  onChange={(e) => setMinTime(parseInt(e.target.value, 10))}
                />
                <TextField
                  label="Max"
                  size="small"
                  type="number"
                  onChange={(e) => setMaxTime(parseInt(e.target.value, 10))}
                />
              </FormGroup>
            </Box>
          )}
        </div>
        <Box margin={"5px"}>
          <Button
            variant="outlined"
            color="secondary"
            disabled={isLoading}
            type="submit"
            size="small"
          >
            {isLoading ? "Loading..." : "Load"}
          </Button>
        </Box>
      </form>
    </Grid>
  );
}

export { Visualizer };
