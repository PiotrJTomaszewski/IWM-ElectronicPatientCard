import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

class PatientListHeader extends React.Component {
  onLinkClicked = (selectedKey) => {
    console.log("Link clicked", selectedKey);
  };

  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>
          {this.props.patient.getMainName().getFullName()}
        </Navbar.Brand>
        <Nav className="mr-auto" onSelect={this.onLinkClicked}>
          <Nav.Link eventKey="link-patient-overview">Patient overview</Nav.Link>
          <Nav.Link eventKey="link-patient-timeline">Timeline</Nav.Link>
          <Nav.Link eventKey="link-patient-sth">???</Nav.Link>
        </Nav>
      </Navbar>
    );
  }
}

export default PatientListHeader;
