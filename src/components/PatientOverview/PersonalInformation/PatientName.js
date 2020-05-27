import React from "react";
import TableModalWithButton from "../TableModalWithButton";

class PatientName extends React.Component {
  getAllNames() {
    var id = 0;
    return this.props.patient.getAllNames().map((name) => {
      return (
        <tr key={'patientNameModal'+id++}>
          <td>{name.getUse(true)}</td>
          <td>{name.getFullName()}</td>
          <td>{name.getPeriod(true, "Unknown")}</td>
        </tr>
      );
    });
  }

  render() {
    var mainName = this.props.patient.getMainName();
    // Animation in version 1.0.1 of react-bootstrap usues an deprecated method so it has to be turned off unitil the library is updated
    return (
      <TableModalWithButton
        tooltip="Click to see other names"
        buttonText={mainName.getFullName()}
        modalTitle="Patient names"
        modalTableHeaderRow={
          <tr>
            <th scope="row">Use</th>
            <th scope="row">Name</th>
            <th scope="row">Period</th>
          </tr>
        }
        modalTableBody={this.getAllNames()}
      />
    );
  }
}

export default PatientName;
