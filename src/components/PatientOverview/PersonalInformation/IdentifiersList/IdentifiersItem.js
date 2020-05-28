import React from "react";

class IdentifiersItem extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.identifier.getUse(true, "Unknown")}</td>
        <td>{this.props.identifier.getTypeText("Unknown")}</td>
        {/* <td>{this.props.identifier.getSystem("Unknown")}</td> */}
        <td>{this.props.identifier.getValue("Unknown")}</td>
        <td>{this.props.identifier.getAssignerText("Unknown")}</td>
        <td>{this.props.identifier.getPeriod(true, "Unknown")}</td>
      </tr>
    );
  }
}

export default IdentifiersItem;
