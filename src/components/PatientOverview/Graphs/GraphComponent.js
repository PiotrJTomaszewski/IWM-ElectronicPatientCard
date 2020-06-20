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
    this.state = {
      data: this.props.data,
      hoverValue: null,
      zoomWithMouseEnabled: false
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
          zoomWithMouseEnabled: !oldState.zoomWithMouseEnabled
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
