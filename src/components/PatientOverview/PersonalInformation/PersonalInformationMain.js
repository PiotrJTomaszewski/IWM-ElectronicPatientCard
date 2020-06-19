import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import PersonalInformation from "./PersonalInformation";
import TelecomInformation from "./TelecomInformation";
import AddressInformation from "./AddressInformation";
import PatientHeader from "./PatientHeader";
import IdentifiersList from "./IdentifiersList/IdentifiersList";
import PatientVersionControl from "./PatientVersionControl";
// import ContactList from "./ContactList/ContactList";

class PersonalInformationMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fhirClient: props.fhirClient,
      currentPatientVersion: props.fhirClient.patientData.patient.currentVersion
    }
  }

  componentDidUpdate(oldProps) {
    if (JSON.stringify(this.props.fhirClient.patientData.patient) !== JSON.stringify(oldProps.fhirClient.patientData.patient)) {
      this.setState({
        fhirClient: this.props.fhirClient,
        currentPatientVersion: this.props.fhirClient.patient.currentVersion
      })
    }
  }

  patientVersionChangeHandle = (newPatientVersion) => {
    this.setState({
      currentPatientVersion: newPatientVersion
    })
  }

  render() {
    return (
      <Container>
        <Container>
          <Row className="m-4">
            <PatientHeader fhirClient={this.state.fhirClient} />
          </Row>
          <Row>
            <Col>
              <PersonalInformation fhirClient={this.state.fhirClient} parentOnVersionChangeHandle={this.patientVersionChangeHandle}/>
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
        <PatientVersionControl fhirClient={this.state.fhirClient} currentPatientVersion={this.state.currentPatientVersion} parentOnVersionChangeHandle={this.patientVersionChangeHandle}/>
      </Container>
    );
  }
}
export default PersonalInformationMain;
