import React, { Component } from "react";
import "./App.css";
import CanvasJSReact from "./assets/canvasjs.react";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

/*

getTests = async () => {
    const res = await fetch("http://localhost:3100/api/analytics", {
      method: "GET"
    });
    const data = await res.json();
    this.setState({ data });
  };
*/

class Analytics extends Component {
  constructor() {
    super();
    this.toggleDataSeries = this.toggleDataSeries.bind(this);
    this.state = {
      data: []
    };
  }

  componentDidMount = () => {
    this.getTests();
  };

  getTests = async () => {
    const res = await fetch("http://localhost:3100/api/analytics", {
      method: "GET"
    });
    const data = await res.json();
    this.setState({ data }, () => console.log("data", this.state.data));
  };

  toggleDataSeries(e) {
    if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    this.chart.render();
  }
  render() {
    const options = {
      theme: "light2",
      animationEnabled: true,
      title: {
        text: "Средний рейтинг"
      },
      axisX: {
        title: "Active Users"
      },
      axisY: {
        title: "Рейтинг",
        suffix: "%"
      },
      legend: {
        cursor: "pointer",
        itemclick: this.toggleDataSeries
      },
      data: [
        {
          type: "scatter",
          name: "Server 1",
          markerType: "triangle",
          showInLegend: true,
          toolTipContent:
            '<span style="color:#4F81BC ">{name}</span><br>Active Users: {x}<br>CPU Utilization: {y}%',
          dataPoints: this.state.data
        }
        // {
        //   type: "scatter",
        //   name: "Server 2",
        //   showInLegend: true,
        //   markerType: "cross",
        //   toolTipContent:
        //     '<span style="color:#C0504E ">{name}</span><br>Active Users: {x}<br>CPU Utilization: {y}%',
        //   dataPoints: [
        //     { x: 100, y: 25 },
        //     { x: 150, y: 35 },
        //     { x: 190, y: 35 },
        //     { x: 250, y: 40 },
        //     { x: 310, y: 45 },
        //     { x: 400, y: 42 },
        //     { x: 500, y: 57 },
        //     { x: 510, y: 67 },
        //     { x: 600, y: 40 },
        //     { x: 700, y: 46 },
        //     { x: 800, y: 50 },
        //     { x: 900, y: 60 },
        //     { x: 1000, y: 66 },
        //     { x: 1100, y: 79 },
        //     { x: 1230, y: 60 },
        //     { x: 1300, y: 75 },
        //     { x: 1330, y: 80 },
        //     { x: 1400, y: 82 },
        //     { x: 1450, y: 88 },
        //     { x: 1500, y: 87 }
        //   ]
        // }
      ]
    };
    return (
      <div>
        <CanvasJSChart options={options} onRef={ref => (this.chart = ref)} />
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
      </div>
    );
  }
}

export default Analytics;
