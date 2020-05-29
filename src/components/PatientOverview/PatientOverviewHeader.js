import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

class PatientListHeader extends React.Component {
  onLinkClicked = (selectedKey) => {
    this.props.onLinkClicked(selectedKey);
    console.log("Link clicked", selectedKey);
  };

  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>
          {this.props.patient.getMainName().getFullName()}
        </Navbar.Brand>
        <Nav className="mr-auto" onSelect={this.onLinkClicked}>
          <Nav.Link eventKey="tab-patient-overview">Patient overview</Nav.Link>
          <Nav.Link eventKey="tab-timeline">Timeline</Nav.Link>
          <Nav.Link eventKey="tab-graphs">Graphs</Nav.Link>
          <Nav.Link eventKey="tab-debug">Debug menu</Nav.Link>
        </Nav>
      </Navbar>
    );
  }
}

export default PatientListHeader;
