import React from "react";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import ContactDetailsEdit from "./Edit/ContactDetailsEdit";

class TelecomInformation extends React.Component {
  createList = () => {
    var patient = this.props.fhirClient.patientData.patient.getCurrent();
    var telecom = patient.telecoms;
    if (telecom === undefined || telecom.length === 0) {
      return (
        <tr>
          <td>No detail found</td>
        </tr>
      );
    } else {
      // if (telecom[0].getRank() !== undefined) {
      //   telecom.sort((a, b) => {
      //     return a.getRank() - b.getRank();
      //   });
      // }
      var key = 0;
      return telecom.map((element) => {
        var extra = this.props.fhirClient.patientData.patient.isCurrentTheLast() ? <ContactDetailsEdit mode="edit" fhirClient={this.props.fhirClient} currentTelecom={element} parentOnVersionChangeHandle={this.props.parentOnVersionChangeHandle}/> : null;
        return element.getHtml('PatientTelecom'+key++, extra);
      });
    }
  };

  render() {
    return (
      <Card>
        <Card.Title className="text-center mt-4">
          <div><span className="h2">Contact details {this.props.fhirClient.patientData.patient.isCurrentTheLast() ? (<ContactDetailsEdit mode="add" fhirClient={this.props.fhirClient} currentTelecom={null} parentOnVersionChangeHandle={this.props.parentOnVersionChangeHandle}/>) : null}</span></div>
        </Card.Title>
        <Card.Body>
          <Table>
            <thead></thead>
            <tbody>{this.createList()}</tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  }
}

export default TelecomInformation;
