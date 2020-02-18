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
      analyticsData: [],
      predictedPoints: []
    };
  }

  componentDidMount = () => {
    this.getTests();
  };

  getTests = async () => {
    const res = await fetch("http://localhost:3100/api/analytics", {
      method: "GET"
    });
    const { analyticsData, predictedPoints } = await res.json();
    this.setState({ analyticsData, predictedPoints });
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
        title: "Семестр"
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
          name: "Средняя оценка",
          markerType: "triangle",
          showInLegend: true,
          toolTipContent:
            '<span style="color:#4F81BC ">{name}</span><br>Active Users: {x}<br>CPU Utilization: {y}%',
          dataPoints: this.state.analyticsData
        },
        {
          type: "scatter",
          name: "Прогнозируемая оценка",
          showInLegend: true,
          markerType: "cross",
          toolTipContent:
            '<span style="color:#C0504E ">{name}</span><br>Active Users: {x}<br>CPU Utilization: {y}%',
          dataPoints: this.state.predictedPoints
        }
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
