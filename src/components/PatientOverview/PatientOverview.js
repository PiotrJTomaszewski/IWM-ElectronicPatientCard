import React from "react";

import PatientModel from "../../models/PatientModel";
import ObservationModel from "../../models/ObservationModel";
import MedicationStatementModel from "../../models/MedicationStatementModel";
import Loading from "../Loading";
import PersonalInformationMain from "./PersonalInformation/PersonalInformationMain";
import DebugArea from "./DebugArea";
import PatientOverviewHeader from "./PatientOverviewHeader";
import TimelineMain from "./Timeline/TimelineMain";
import GraphsMain from "./Graphs/GraphsMain";

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
    var patientModel = new PatientModel(
      this.fhirClient,
      this.fhirClient.getPatient()
    );
    console.log("Patient loaded");
    var observationsRaw = this.fhirClient.getObservations();
    var observationModels;
    if (observationsRaw && observationsRaw.length > 0) {
      observationModels = observationsRaw.map((element) => {
        return new ObservationModel(this.fhirClient, element);
      })
    }
    console.log("Observations loaded");
    var medicationStatementsRaw = this.fhirClient.getMedicationStatements();
    var medicationStatementModels;
    if (medicationStatementsRaw && medicationStatementsRaw.length > 0) {
      medicationStatementModels = medicationStatementsRaw.map((element) => {
        return new MedicationStatementModel(this.fhirClient, element);
      })
    }
    console.log("Medical statements loaded");
    this.setState((state) => {
      return {
        ...state,
        loading: false,
        patient: patientModel,
        observations: observationModels,
        medicationStatements: medicationStatementModels
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
        selectedPageComponent = <TimelineMain observations={this.state.observations} medicationStatements={this.state.medicationStatements} />;
        break;
      case 'tab-graphs':
        selectedPageComponent = <GraphsMain observations={this.state.observations}/>;
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
          {selectedPageComponent}
        </main>
      </div>
    );
  }
}

export default PatientOverview;
