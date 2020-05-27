import React from "react";
import "./App.css";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
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

  render() {
    var callback = (patientId) => {
      this.patientSelectedCallback(patientId);
    };
    return (
      <div>
        <header>
          <Header />
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Navbar />
          </nav>
        </header>
        <main>
          <Container>
            {this.state.selectedPatientId === undefined ? (
              <PatientsList
                client={this.fhirClient}
                patientSelectedCallback={callback}
              />
            ) : (
              <PatientOverview
                client={this.fhirClient}
                patientId={this.state.selectedPatientId}
              />
            )}
          </Container>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    );
  }
}

export default App;
