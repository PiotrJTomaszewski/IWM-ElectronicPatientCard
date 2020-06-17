import React from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";

class GraphDateRangeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateRange: this.props.dateRange,
      minMaxDateRange: this.props.minMaxDateRange,
    };
  }

  componentDidUpdate() {
    if (this.state.dateRange !== this.props.dateRange) {
      this.setState({
        dateRange: this.props.dateRange
      })
    }
    if (this.state.minMaxDateRange !== this.props.minMaxDateRange) {
      this.setState({
        minMaxDateRange: this.props.minMaxDateRange
      })
    }
  }

  onChange = (selectionRange) => {
    console.log(selectionRange);
    this.props.parentOnChange([
      selectionRange.selection.startDate,
      selectionRange.selection.endDate,
    ]);
  };

  render() {
    const ranges = [
      {
        startDate: this.state.dateRange[0],
        endDate: this.state.dateRange[1],
        key: "selection",
      },
    ];
    return (
      <div>
        <DateRangePicker
          onChange={(item) => this.onChange(item)}
          ranges={ranges}
          minDate={this.state.minMaxDateRange[0]}
          maxDate={this.state.minMaxDateRange[1]}
        />
      </div>
    );
  }
}

export default GraphDateRangeComponent;
