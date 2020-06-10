import React from "react";
import "./App.css";
import PatientsList from "./components/PatientsList/PatientsList";
import PatientOverview from "./components/PatientOverview/PatientOverview";
import Footer from "./components/Footer";
import FhirClient from "./FhirClient";
import Container from "react-bootstrap/Container";

class App extends React.Component {
  state = {
    selectedPatientId: undefined,
  };

  constructor() {
    super();
    this.fhirClient = new FhirClient("http://demo.oridashi.com.au:8304");
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
      selectedPatientId: undefined
    });
  }

  render() {
    var callback = (patientId) => {
      this.patientSelectedCallback(patientId);
    };
    return (
      <div>
        {this.state.selectedPatientId === undefined ? (
          <PatientsList
            client={this.fhirClient}
            patientSelectedCallback={callback}
          />
        ) : (
          <PatientOverview
            client={this.fhirClient}
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
