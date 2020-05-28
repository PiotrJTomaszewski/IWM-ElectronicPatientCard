import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import PersonalInformation from "./PersonalInformation";
import TelecomInformation from "./TelecomInformation";
import AddressInformation from "./AddressInformation";
import PatientHeader from "./PatientHeader";
import IdentifiersList from "./IdentifiersList/IdentifiersList";
import ContactList from "./ContactList/ContactList";

class PersonalInformationMain extends React.Component {
  render() {
    return (
      <Container>
        <Container>
          <Row>
            <PatientHeader patient={this.props.patient} />
          </Row>
          <Row>
            <Col>
              <PersonalInformation patient={this.props.patient} />
            </Col>
            <Col>
              <TelecomInformation patient={this.props.patient} />
            </Col>
            <Col>
              <AddressInformation patient={this.props.patient} />
            </Col>
          </Row>
        </Container>
        <Container>
          <IdentifiersList patient={this.props.patient} />
          <ContactList patient={this.props.patient} />
        </Container>
      </Container>
    );
  }
}
export default PersonalInformationMain;
