import React from "react";
import Patient from "../../models/PatientModel";
import PatientsListItem from "./PatientsListItem";
import Loading from "../Loading";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import $ from "jquery";

import PatientListHeader from "./PatientListHeader";

class PatientsList extends React.Component {
  patients = [];
  state = {
    loading: true,
    patientsToDisplay: [],
  };
  fhirClient = {};

  constructor(props) {
    super();
    this.fhirClient = props.client;
  }

  onDownloadSuccess() {
    this.patients = this.fhirClient.getPatientsList().map((resource) => {
      var patient = new Patient(this.fhirClient, resource);
      return {
        id: patient.getId(),
        familyName: patient.getMainName().getFamilyName(),
        display: (
          <PatientsListItem
            key={patient.getId()}
            patient={patient}
            patientSelectedCallback={this.props.patientSelectedCallback}
          />
        ),
      };
    });
    this.setState((state) => {
      return {
        ...state,
        loading: false,
        patientsToDisplay: this.patients.map((patient) => {
          return patient.display;
        }),
      };
    });
  }

  onDownloadFail() {
    console.log("No patients found");
  }

  componentDidMount() {
    this.fhirClient.downloadPatientsList(
      () => {
        this.onDownloadSuccess();
      },
      () => {
        this.onDownloadFail();
      }
    );
  }

  filterNames() {
    var currentFilter = $("#filter-box").val().toLowerCase();
    var filteredDisplay = [];
    this.patients.forEach((patient) => {
      if (patient.familyName.toLowerCase().indexOf(currentFilter) > -1) {
        filteredDisplay.push(patient.display);
      }
    });
    this.setState((state) => {
      return {
        ...state,
        patientsToDisplay: filteredDisplay,
      };
    });
  }

  render() {
    var filterNamesCallback = () => {
      this.filterNames();
    };
    if (this.state.loading) {
      return <Loading />;
    } else {
      return (
        <div>
          <header>
            <nav><PatientListHeader/></nav>
          </header>
          <main>
            <Container>
              <div className="md-form m-4">
                <input
                  onKeyUp={filterNamesCallback}
                  id="filter-box"
                  className="form-control"
                  type="text"
                  placeholder="Filter family names"
                  aria-label="Filter family names"
                />
              </div>
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Family name</th>
                    <th>Given name(s)</th>
                    <th>Gender</th>
                    <th>Date of birth</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>{this.state.patientsToDisplay}</tbody>
              </Table>
            </Container>
          </main>
        </div>
      );
    }
  }
}

export default PatientsList;
