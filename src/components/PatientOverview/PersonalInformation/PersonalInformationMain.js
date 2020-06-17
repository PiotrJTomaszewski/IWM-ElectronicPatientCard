import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import PersonalInformation from "./PersonalInformation";
import TelecomInformation from "./TelecomInformation";
import AddressInformation from "./AddressInformation";
import PatientHeader from "./PatientHeader";
import IdentifiersList from "./IdentifiersList/IdentifiersList";
// import ContactList from "./ContactList/ContactList";

class PersonalInformationMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fhirClient: props.fhirClient
    }
  }

  componentDidUpdate(oldProps) {
    if (this.props.fhirClient !== oldProps.fhirClient) {
      this.setState({
        fhirClient: this.props.fhirClient
      })
    }
  }

  render() {
    return (
      <Container>
        <Container>
          <Row>
            <PatientHeader fhirClient={this.state.fhirClient} />
          </Row>
          <Row>
            <Col>
              <PersonalInformation fhirClient={this.state.fhirClient} />
            </Col>
            <Col>
              <TelecomInformation fhirClient={this.state.fhirClient} />
              <AddressInformation fhirClient={this.state.fhirClient} />
            </Col>
          </Row>
        </Container>
        <Container>
          <IdentifiersList fhirClient={this.state.fhirClient} />
          {/* <ContactList patient={this.props.patient} /> */}
        </Container>
      </Container>
    );
  }
}
export default PersonalInformationMain;
