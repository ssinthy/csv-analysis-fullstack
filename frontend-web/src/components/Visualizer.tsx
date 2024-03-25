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
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { keys } from "lodash";

type Props = {
  selectedFile: FileMetadata | null;
};

function Visualizer(props: Props) {
  const { selectedFile } = props;

  const [minCycleNumber, setMinCycleNumber] = useState<number>(0);
  const [minTime, setMinTime] = useState<number>(0);
  const [maxCycleNumber, setMaxCycleNumber] = useState<number>(50);
  const [maxTime, setMaxTime] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);

  const [chartData, setChartData] = useState<object[]>([]);
  const [XAxisArg, setXAxisArg] = useState<string | null>(null);
  const [YAxisArg, setYAxisArg] = useState<string | null>(null);

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
        setChartData(data);
      } catch (error) {
        window.alert("Unable to fetch file content");
      }

      setLoading(false);
    },
    [selectedFile, minCycleNumber, minTime, maxCycleNumber, maxTime]
  );

  const chartDataProps = useMemo(() => {
    if (chartData.length === 0) return [];
    return keys(chartData[0]);
  }, [chartData]);

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
                value={minCycleNumber}
                onChange={(e) =>
                  setMinCycleNumber(parseInt(e.target.value, 10))
                }
              />
              <TextField
                label="Max"
                type="number"
                size="small"
                value={maxCycleNumber}
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
                  value={minTime}
                  onChange={(e) => setMinTime(parseInt(e.target.value, 10))}
                />
                <TextField
                  label="Max"
                  size="small"
                  type="number"
                  value={maxTime}
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

      {chartData.length > 0 && (
        <Box component={"form"}>
          <FormControl required style={{ minWidth: "100px" }} size="small">
            <InputLabel id="type-dd1">X Axis</InputLabel>
            <Select
              label="File type"
              labelId="type-dd1"
              value={XAxisArg}
              onChange={(e) => setXAxisArg(e.target.value)}
            >
              {chartDataProps.map((arg) => (
                <MenuItem key={arg} value={arg}>
                  {arg}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl required style={{ minWidth: "100px" }} size="small">
            <InputLabel id="type-dd2">Y Axis</InputLabel>
            <Select
              label="File type"
              labelId="type-dd2"
              value={YAxisArg}
              onChange={(e) => setYAxisArg(e.target.value)}
            >
              {chartDataProps.map((arg) => (
                <MenuItem key={arg} value={arg}>
                  {arg}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <Box padding={5}>
        <LineChart
          width={600}
          height={300}
          data={chartData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          {YAxisArg && XAxisArg && (
            <>
              <Line type="monotone" dataKey={YAxisArg} stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey={XAxisArg} label={XAxisArg} />
              <YAxis label={YAxisArg} />
              <Tooltip />
            </>
          )}
        </LineChart>
      </Box>
    </Grid>
  );
}

export { Visualizer };
