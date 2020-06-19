import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import IdentifiersItem from "./IdentifiersItem";

class IdentifiersList extends React.Component {
  createList = () => {
    var key=0;
    var identifiers = this.props.fhirClient.patientData.patient.getCurrent().identifiers;
    if (!identifiers) {
      return (<tr><td>No identifiers found</td></tr>);
    }
    return identifiers.map((element) => {
      return (<IdentifiersItem key={"IdentifiersItem"+key++} identifier={element}/>);
    })
  };

  render() {
    return (
      <div>
          <Card>
            <Card.Title className="text-center mt-4">
              <span className="h2">Identifiers</span>
            </Card.Title>
              <Card.Body>
                <Table>
                  <thead>
                    <tr>
                      {/* <th scope="col">Use</th> */}
                      <th scope="col">Type</th>
                      {/* <th scope="col">System</th> */}
                      <th scope="col">Value</th>
                      {/* <th scope="col">Assigner</th> */}
                      {/* <th scope="col">Period</th> */}
                    </tr>
                  </thead>
                  <tbody>{this.createList()}</tbody>
                </Table>
              </Card.Body>
          </Card>
      </div>
    );
  }
}

export default IdentifiersList;
