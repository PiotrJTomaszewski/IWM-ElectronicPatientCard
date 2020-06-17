import React from "react";

import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineMarkSeries,
  Highlight,
  // Crosshair,
} from "react-vis";

class GraphComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      crosshairValues: [],
    };
  }

  onBrushEnd = (area) => {
    const left = area ? area.left : null;
    const right = area ? area.right : null;
    this.props.parentOnRangeChange([left, right]);
  };

  onDrag = (area) => {
    this.props.parentOnRangeChange([
      this.props.dateRange[0] - (area.right - area.left),
      this.props.dateRange[1] - (area.right - area.left),
    ]);
  };

  componentDidUpdate(oldProps) {
    if (oldProps.data !== this.props.data) {
      this.setState({
        data: this.props.data,
        crosshairValues: [],
      });
    }
  }

  // onMouseLeave = () => {
  //   this.setState({
  //     crosshairValues: [],
  //   });
  // };

  // onNearestX = (value, { index }) => {
  //   console.log(value, index);

  //   console.log(this.state.data);
  //   console.log(this.state.crosshairValues);
  //   this.setState({
  //     crosshairValues: this.state.data.coords.map((d) => d),
  //   });
  // };

  render() {
    return (
      <XYPlot
        width={800}
        height={600}
        xType="time"
        animation
        xDomain={
          this.props.dateRange && [
            this.props.dateRange[0],
            this.props.dateRange[1],
          ]
        }
        // onMouseLeave={this.onMouseLeave}
        margin={{ bottom: 100 }}
      >
        <HorizontalGridLines />
        <LineMarkSeries
          data={this.state.data.coords}
          // onNearestX={this.onNearestX}
        />
        <XAxis tickLabelAngle={-90} />
        <YAxis />
        <Highlight onBrushEnd={this.onBrushEnd} onDrag={this.onDrag} />
        {/* <Crosshair values={this.state.crosshairValues} /> */}
      </XYPlot>
    );
  }
}

export default GraphComponent;
