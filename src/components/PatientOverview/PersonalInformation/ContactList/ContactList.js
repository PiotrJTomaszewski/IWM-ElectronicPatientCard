import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import ContactItem from "./ContactItem";

class ContactList extends React.Component {
  createList = () => {
    var contacts = this.props.patient.getAllContacts();
    if (contacts) {
      var key = 0;
      return contacts.map((element) => {
        return <ContactItem key={"ContactItem"+key++} contact={element} />;
      });
    }
    return (
      <tr>
        <td>No contact parties found</td>
      </tr>
    );
  };

  render() {
    return (
      <div>
        <Accordion>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Contact parties
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Table>
                  <thead>
                    <tr>
                      <th scope="col">Relationship</th>
                      <th scope="col">Full Name</th>
                      {/* <th scope="col">System</th> */}
                      <th scope="col">Contact details</th>
                      <th scope="col">Address</th>
                      <th scope="col">Gender</th>
                      <th scope="col">Organization</th>
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

export default ContactList;