import React from "react";

import Loading from "../Loading";
import PersonalInformationMain from "./PersonalInformation/PersonalInformationMain";
import DebugArea from "./DebugArea";
import PatientOverviewHeader from "./PatientOverviewHeader";
import TimelineMain from "./Timeline/TimelineMain";
import GraphsMain from "./Graphs/GraphsMain";

class PatientOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataDownloaded: false,
      patientId: props.patientId,
      fhirClient: props.client,
      selectedTab: "tab-patient-overview",
    };
  }

  onDownloadSuccess() {
    this.setState((state) => {
      return {
        ...state,
        dataDownloaded: true
      }
    })
  }

  onDownloadFailure(error) {
    console.log("Error while downloading data ", error);
  }

  downloadPatientData() {
    this.state.fhirClient.fetchPatientData(
      this.state.patientId,
      () => {
        this.onDownloadSuccess();
      },
      (error) => {
        this.onDownloadFailure(error);
      }
    );
  }

  componentDidUpdate(oldProps) {
    if (oldProps.patientId !== this.props.patientId) {
      this.setState((state) => {
        return {
          ...state,
          patientId: this.props.patientId,
          dataDownloaded: false
        };
      });
      this.downloadPatientData();
    }
  }

  componentDidMount() {
    this.downloadPatientData();
  }

  tabSelectedHandler = (selectedKey) => {
    this.setState((state) => {
      return { ...state, selectedTab: selectedKey };
    });
  };

  getSelectedPageComponent() {
    var selectedPageComponent;
    switch (this.state.selectedTab) {
      case "tab-back-to-list":
        this.props.backToListCallback();
        break;
      case "tab-patient-overview":
        selectedPageComponent = (
          <PersonalInformationMain fhirClient={this.state.fhirClient} />
        );
        break;
      case "tab-timeline":
        selectedPageComponent = (
          <TimelineMain
            fhirClient={this.state.fhirClient}
          />
        );
        break;
      case "tab-graphs":
        selectedPageComponent = (
          <GraphsMain fhirClient={this.state.fhirClient} />
        );
        break;
      case "tab-debug":
        selectedPageComponent = (<div></div>)
        // selectedPageComponent = <DebugArea patient={this.state.patient} />;
        break;
      default:
        console.log("Invalid tab selected" + this.state.selectedTab);
        break;
    }
    return selectedPageComponent;
  }

  render() {
    if (this.state.dataDownloaded) {
      return (
        <div>
          <header>
            <nav>
              <PatientOverviewHeader
                patient={this.state.fhirClient.patientData.patient}
                onLinkClicked={this.tabSelectedHandler}
              />
            </nav>
          </header>
          <main>{this.getSelectedPageComponent()}</main>
        </div>
      );
    } else {
      return <Loading />;
    }
  }
}

export default PatientOverview;
