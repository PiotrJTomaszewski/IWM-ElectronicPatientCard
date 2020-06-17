import React from "react";

class IdentifiersItem extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.identifier.text}</td>
        <td>{this.props.identifier.value}</td>
      </tr>
    );
  }
}

export default IdentifiersItem;
