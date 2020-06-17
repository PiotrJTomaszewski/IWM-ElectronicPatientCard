import React from "react";
import TableModalWithButton from "../TableModalWithButton";

import {capitalizeFirstLetter} from "../../../Helpers";

class PatientName extends React.Component {
  getAllNames() {
    var patient = this.props.fhirClient.patientData.patient;
    var id = 0;
    return patient.names.map((name) => {
      return (
        <tr key={'patientNameModal'+id++}>
          <td>{capitalizeFirstLetter(name.use)}</td>
          <td>{name.getFullName()}</td>
        </tr>
      );
    });
  }

  render() {
    var patient = this.props.fhirClient.patientData.patient;
    var mainName = patient.getMainName();
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
          </tr>
        }
        modalTableBody={this.getAllNames()}
      />
    );
  }
}

export default PatientName;
