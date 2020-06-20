import React from "react";
import PatientsListItem from "./PatientsListItem";
import Loading from "../Loading";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import $ from "jquery";

import PatientListHeader from "./PatientListHeader";

class PatientsList extends React.Component {
  constructor(props) {
    super();
    this.state = {
      fhirClient: props.client,
      dataDownloaded: false,
      patients: [],
      patientsToDisplay: [],
    };
  }

  componentDidUpdate(oldProps) {
    if (oldProps.fhirClient !== this.props.fhirClient) {
      this.setState((state) => {
        return {
          ...state,
          fhirClient: this.props.fhirClient,
        };
      });
    }
  }

  onDownloadSuccess() {
    var patients = this.state.fhirClient.patientList.map((patientModel) => {
      return {
        id: patientModel.id,
        familyName: patientModel.names[0].family,
        component: (
          <PatientsListItem
            key={patientModel.id}
            patient={patientModel}
            patientSelectedCallback={this.props.patientSelectedCallback}
          />
        ),
      };
    });
    var patientsComponents = patients.map((patient) => {
      return patient.component;
    });
    this.setState((state) => {
      return {
        ...state,
        dataDownloaded: true,
        patients: patients,
        patientsToDisplay: patientsComponents
      };
    });
  }

  onDownloadFail(error) {
    console.log("Error while fetching patient data ", error);
  }

  componentDidMount() {
    this.state.fhirClient.fetchPatientsList(
      () => {
        this.onDownloadSuccess();
      },
      (error) => {
        this.onDownloadFail(error);
      }
    );
  }

  filterNames() {
    var currentFilter = $("#filter-box").val().toLowerCase();
    var filteredComponents = this.state.patients
      .filter((patient) => {
        return patient.familyName.toLowerCase().indexOf(currentFilter) > -1;
      })
      .map((patient) => patient.component);
    this.setState((state) => {
      return {
        ...state,
        patientsToDisplay: filteredComponents,
      };
    });
  }

  render() {
    if (this.state.dataDownloaded) {
      return (
        <div>
          <header>
            <nav>
              <PatientListHeader />
            </nav>
          </header>
          <main>
            <Container>
              <div className="md-form m-4">
                <input
                  onKeyUp={() => {this.filterNames()}}
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>{this.state.patientsToDisplay}</tbody>
              </Table>
            </Container>
          </main>
        </div>
      );
    } else {
      return <Loading />;
    }
  }
}

export default PatientsList;
