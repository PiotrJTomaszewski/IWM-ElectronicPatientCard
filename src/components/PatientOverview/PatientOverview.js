import React from "react";
import Container from "react-bootstrap/Container";

import Patient from "../../models/PatientModel";
import Loading from "../Loading";
import PersonalInformationMain from "./PersonalInformation/PersonalInformationMain";
import DebugArea from "./DebugArea";
import PatientOverviewHeader from "./PatientOverviewHeader";
import TimelineMain from "./Timeline/TimelineMain";

class PatientOverview extends React.Component {
  state = {
    loading: true,
    patient: {},
    observations: {},
    medicationStatements: {},
    selectedTab: 'tab-patient-overview',
  };

  constructor(props) {
    super();
    this.fhirClient = props.client;
    this.patientId = props.patientId;
  }

  onDownloadSuccess() {
    var patientModel = new Patient(
      this.fhirClient,
      this.fhirClient.getPatient()
    );
    this.setState((state) => {
      return {
        ...state,
        loading: false,
        patient: patientModel,
        // observations: this.fhirClient.getObservations(),
        // medicationStatements: this.fhirClient.getMedicationStatements()
      };
    });
  }

  tabSelectedHandler = (selectedKey) => {
    this.setState((state) => {
      return { ...state, selectedTab: selectedKey };
    });
  };

  onDownloadFail(whatFailed) {
    switch (whatFailed) {
      case "everything":
        console.log(
          "Getting all of the patient data failed (Most likely, this operation isn't supported by the server). Trying downloading only necessarry information."
        );
        break;
      case "patient":
        console.log("Patient not found");
        break;
      case "observation":
        console.log("No observation found");
        break;
      case "medicationStatement":
        console.log("No medication statement found");
        break;
      default:
        console.log("Other error?!");
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
      return <Loading />;
    }
    var selectedPageComponent;
    switch (this.state.selectedTab) {
      case 'tab-patient-overview':
        selectedPageComponent = (
          <PersonalInformationMain patient={this.state.patient} />
        );
        break;
      case 'tab-timeline':
        selectedPageComponent = <TimelineMain patient={this.state.patient} />;
        break;
      case 'tab-debug':
        selectedPageComponent = <DebugArea patient={this.state.patient} />;
        break;
      default:
        console.log("Invalid tab selected" + this.state.selectedTab);
        break;
    }
    return (
      <div>
        <header>
          <nav>
            <PatientOverviewHeader
              patient={this.state.patient}
              onLinkClicked={this.tabSelectedHandler}
            />
          </nav>
        </header>
        <main>
          <Container>{selectedPageComponent}</Container>
        </main>
      </div>
    );
  }
}

export default PatientOverview;
