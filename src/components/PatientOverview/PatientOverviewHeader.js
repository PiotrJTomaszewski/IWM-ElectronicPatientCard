import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

class PatientOverviewHeader extends React.Component {
  onLinkClicked = (selectedKey) => {
    this.props.onLinkClicked(selectedKey);
  };

  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Nav onSelect={this.onLinkClicked}>
          <Nav.Link eventKey="tab-back-to-list"><i className="fas fa-arrow-left"></i></Nav.Link>
        </Nav>
        <Navbar.Brand>
          {this.props.patient ? this.props.patient.getMainName().getFullName(): ""}
        </Navbar.Brand>
        <Nav className="mr-auto" onSelect={this.onLinkClicked}>
          <Nav.Link eventKey="tab-patient-overview">Patient overview</Nav.Link>
          <Nav.Link eventKey="tab-timeline">Timeline</Nav.Link>
          <Nav.Link eventKey="tab-graphs">Graphs</Nav.Link>
        </Nav>
      </Navbar>
    );
  }
}

export default PatientOverviewHeader;
