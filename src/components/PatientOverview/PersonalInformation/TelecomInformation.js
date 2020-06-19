import React from "react";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";

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
        return element.getHtml('PatientTelecom'+key++);
      });
    }
  };

  render() {
    return (
      <Card>
        <Card.Title className="text-center mt-4">
          <span className="h2">Contact details</span>
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
