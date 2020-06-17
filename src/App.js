import React from "react";
import "./App.css";
import PatientsList from "./components/PatientsList/PatientsList";
import PatientOverview from "./components/PatientOverview/PatientOverview";
import Footer from "./components/Footer";
import FhirClient from "./FhirClient";

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      dataDownloaded: false,
      fhirClient: new FhirClient()
    }
  }

  patientSelectedCallback(patientId) {
    if (this.state.selectedPatientId === undefined) {
      this.setState({
        selectedPatientId: patientId,
      });
    }
  }

  backToPatientListCallback = () => {
    this.setState({
      selectedPatientId: undefined,
    });
  };

  render() {
    var callback = (patientId) => {
      this.patientSelectedCallback(patientId);
    };
    return (
      <div>
        {this.state.selectedPatientId === undefined ? (
          <PatientsList
            client={this.state.fhirClient}
            patientSelectedCallback={callback}
          />
        ) : (
          <PatientOverview
            client={this.state.fhirClient}
            patientId={this.state.selectedPatientId}
            backToListCallback={this.backToPatientListCallback}
          />
        )}
        <footer>
          <Footer />
        </footer>
      </div>
    );
  }
}

export default App;
