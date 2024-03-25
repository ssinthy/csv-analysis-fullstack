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
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
const data = [
  { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
  { name: "Page A", uv: 450, pv: 2420, amt: 2410 },
  { name: "Page A", uv: 500, pv: 3400, amt: 3400 },
];

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

      <Box padding={5}>
        <LineChart
          width={600}
          height={300}
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </Box>
    </Grid>
  );
}

export { Visualizer };
