import React from 'react';
import Patient from '../../models/Patient';
import Loading from '../Loading';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PatientHeader from './PatientHeader';
import PersonalInformation from './PersonalInformation/PersonalInformation';
import Card from 'react-bootstrap/Card';

class PatientOverview extends React.Component {
  state = {
    loading: true,
    patient: {},
    observations: {},
    medicationStatements: {}
  }

  constructor(props) {
    super();
    this.fhirClient = props.client;
    this.patientId = props.patientId;
  }

  onDownloadSuccess() {
    var patientModel = new Patient(this.fhirClient, this.fhirClient.getPatient());
    this.setState((state) => {
      return {
        ...state,
        loading: false,
        patient: patientModel,
        // observations: this.fhirClient.getObservations(),
        // medicationStatements: this.fhirClient.getMedicationStatements()
      }
    })
  }

  onDownloadFail(whatFailed) {
    switch (whatFailed) {
      case 'everything':
        console.log("Getting all of the patient data failed (Most likely, this operation isn't supported by the server). Trying downloading only necessarry information.");
        break;
      case 'patient':
        console.log('Patient not found');
        break;
      case 'observation':
        console.log('No observation found');
        break;
      case 'medicationStatement':
        console.log('No medication statement found');
        break;
      default:
        console.log('Other error?!');
        break;
    }
  }

  componentDidMount() {
    this.fhirClient.downloadPatientData(
      this.props.patientId,
      () => {
        this.onDownloadSuccess();
      },
      (whatFailed) => {
        this.onDownloadFail(whatFailed);
      }
    );
  }


  render() {
    if (this.state.loading) {
      return <Loading/>;
    }
    console.log(this.state.patient.getText());
    return (
        <Container>
          <Row>
            <PatientHeader patient={this.state.patient}/>
          </Row>
          <Row>
            <Col>
              <PersonalInformation patient={this.state.patient}/>
            </Col>
          </Row>
        </Container>
      );
  }
}

export default PatientOverview