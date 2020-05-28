import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import IdentifiersItem from "./IdentifiersItem";

class IdentifiersList extends React.Component {
  createList = () => {
    var key=0;
    var identifiers = this.props.patient.getAllIdentifiers();
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
        <Accordion>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Identifiers
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Table>
                  <thead>
                    <tr>
                      <th scope="col">Use</th>
                      <th scope="col">Type</th>
                      {/* <th scope="col">System</th> */}
                      <th scope="col">Value</th>
                      <th scope="col">Assigner</th>
                      <th scope="col">Period</th>
                    </tr>
                  </thead>
                  <tbody>{this.createList()}</tbody>
                </Table>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );
  }
}

export default IdentifiersList;
