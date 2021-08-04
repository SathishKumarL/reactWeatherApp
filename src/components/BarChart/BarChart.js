import * as React from "react";
import Paper from "@material-ui/core/Paper";
import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation } from "@devexpress/dx-react-chart";

const BarChart = ({ chartData }) => {
  console.log('barchart data');
  console.log(chartData);
  return (
    <Paper>
      <Chart data={chartData}>
        <ArgumentAxis />
        <ValueAxis max={6} />
        <BarSeries valueField="temp" argumentField="time" />
        <Title text="Days Weather Chart" />
        <Animation />
      </Chart>
    </Paper>
  );
};
export default BarChart;
