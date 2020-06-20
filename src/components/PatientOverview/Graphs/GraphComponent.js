import React from "react";
import Form from "react-bootstrap/Form";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineMarkSeries,
  Highlight,
  Hint,
} from "react-vis";

class GraphComponent extends React.Component {
  constructor(props) {
    super(props);
    let yValues = this.props.data.coords.map((coord)=>coord.y);
    var dataMin = yValues[0];
    var dataMax = yValues[0];
    for (var y of yValues) {
      if (y > dataMax) dataMax = y;
      else if (y < dataMin) dataMin = y;
    }
    this.state = {
      data: this.props.data,
      hoverValue: null,
      zoomWithMouseEnabled: false,
      yDomain: [dataMin-(0.1*dataMin), dataMax+(0.1*dataMax)],
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
      let yValues = this.props.data.coords.map((coord)=>coord.y);
      var dataMin = yValues[0];
      var dataMax = yValues[0];
      for (var y of yValues) {
        if (y > dataMax) dataMax = y;
        else if (y < dataMin) dataMin = y;
      }
      this.setState({
        data: this.props.data,
        hoverValue: null,
        yDomain: [dataMin-(0.1*dataMin), dataMax+(0.1*dataMax)],
      });
    }
  }

  rememberValue = (value) => {
    this.setState({ hoverValue: value });
  };

  forgetValue = () => {
    this.setState({ hoverValue: null });
  };

  zoomWithMouseChangedHandle = (event) => {
    if (event && event.target) {
      this.setState((oldState) => {
        return {
          zoomWithMouseEnabled: !oldState.zoomWithMouseEnabled,
          hoverValue: null
        }
      })
    }
  }

  render() {
    return (
      <div>
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
          yDomain={
            this.state.yDomain
          }
          margin={{ bottom: 100 }}
        >
          <HorizontalGridLines />
          <LineMarkSeries
            data={this.state.data.coords}
            onValueMouseOver={this.rememberValue}
            onValueMouseOut={this.forgetValue}
          />
          <XAxis tickLabelAngle={-90} />
          <YAxis title={`[${this.state.data.unitY}]`} />
          {this.state.zoomWithMouseEnabled ? <Highlight onBrushEnd={this.onBrushEnd} onDrag={this.onDrag} />: null }
          {this.state.hoverValue ? (
            <Hint value={this.state.hoverValue} />
          ) : null}
        </XYPlot>
        <Form>
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Zoom with mouse"
            value={this.state.zoomWithMouseEnabled}
            onChange={this.zoomWithMouseChangedHandle}
          />
        </Form>
      </div>
    );
  }
}

export default GraphComponent;
