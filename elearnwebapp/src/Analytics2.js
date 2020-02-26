import React, { Component } from "react";

import "./App.css";
import CanvasJSReact from "./assets/canvasjs.react";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Graph extends Component {
  render() {
    const options = {
      exportEnabled: true,
      animationEnabled: true,
      title: {
        text: "Общие показатели"
      },
      data: [
        {
          type: "pie",
          startAngle: 75,
          toolTipContent: "<b>{label}</b>: {y}%",
          showInLegend: "true",
          legendText: "{label}",
          indexLabelFontSize: 16,
          indexLabel: "{label} - {y}%",
          dataPoints: [
            { y: 18, label: "5" },
            { y: 40, label: "4" },
            { y: 18, label: "3" },
            { y: 5, label: "2" },
            { y: 19, label: "1" }
          ]
        }
      ]
    };
    return (
      <div>
        <CanvasJSChart
          options={options}
          /* onRef={ref => this.chart = ref} */
        />
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
      </div>
    );
  }
}

export default Graph;
