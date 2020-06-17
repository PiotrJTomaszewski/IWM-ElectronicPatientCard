import PatientModel from "./models/PatientModel";
import ObservationModel from "./models/ObservationModel";
import MedicationRequestModel from "./models/MedicationRequestModel";

export default class FhirClient {
  API_URL = "http://192.168.100.130:8080/baseR4/";

  fetchPatientsListNextPage(url, onSuccess, onFailure) {
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
      this.patientList = this.patientList.concat(data.entry.map((entry) => new PatientModel(entry.resource)));
      var nextUrl = undefined;
      if (data.link && data.link.length > 0) {
        for (let i = 0; i < data.link.length; i++) {
          if (data.link[i].relation === "next") {
            nextUrl = data.link[i].url;
            break;
          }
        }
      }
      if (nextUrl !== undefined) {
        this.fetchPatientsListNextPage(nextUrl, onSuccess, onFailure);
      } else {
        onSuccess();
      }
    })
    .catch((error) => {
      onFailure(error);
    })
  }

  fetchPatientDataNextPage(url, onSuccess, onFailure) {
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
      data.entry.forEach((entry) => {
      switch(entry.resource.resourceType) {
        case 'Patient':
          this.patientData.patient = new PatientModel(entry.resource);
          break;
        case 'Observation':
          this.patientData.observations.push(new ObservationModel(entry.resource));
          break;
        case 'MedicationRequest':
          this.patientData.medicationRequests.push(new MedicationRequestModel(entry.resource));
          break;
        default:
          break;
      }
      })
      var nextUrl = undefined;
      if (data.link && data.link.length > 0) {
        for (let i = 0; i < data.link.length; i++) {
          if (data.link[i].relation === "next") {
            nextUrl = data.link[i].url;
            break;
          }
        }
      }
      if (nextUrl !== undefined) {
        this.fetchPatientDataNextPage(nextUrl, onSuccess, onFailure);
      } else {
        console.log(this.patientData);
        onSuccess();
      }
    })
    .catch((error) => {
      onFailure(error);
    })
  }



  fetchPatientsList(onSuccess, onFailure) {
    this.patientList = [];
    const url = `${this.API_URL}Patient?&_count=50&_format=json`;
    this.fetchPatientsListNextPage(url, onSuccess, onFailure);
  }

  fetchPatientData(patientId, onSuccess, onFailure) {
    this.patientData = {
      patient: {},
      observations: [],
      medicationRequests: [],
    };
    const url = `${this.API_URL}Patient/${patientId}/$everything?_count=50&_format=json`;
    this.fetchPatientDataNextPage(url, onSuccess, onFailure);
  }
}
