import React from "react";
import Timeline from 'react-visjs-timeline';

class TimelineComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
    <Timeline options={this.props.options} items={this.props.items} groups={this.props.groups} />
    )
  }
}

export default TimelineComponent;