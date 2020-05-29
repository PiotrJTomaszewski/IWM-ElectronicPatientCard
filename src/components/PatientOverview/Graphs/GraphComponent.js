import React from "react";

import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineMarkSeries,
} from "react-vis";

class GraphComponent extends React.Component {

  constructor(props) {
    super(props);
    console.log(props.data);
  }

  render() {
    return (
      <XYPlot width={800} height={600} xType="time">
        <HorizontalGridLines />
        <LineMarkSeries data={this.props.data.coords} />
        <XAxis />
        <YAxis />
      </XYPlot>
    );
  }
}

export default GraphComponent;
