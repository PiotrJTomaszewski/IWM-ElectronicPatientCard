import PatientModel from "./models/PatientModel";
import ObservationModel from "./models/ObservationModel";
import MedicationRequestModel from "./models/MedicationRequestModel";
import MultiVersionPatientModel from "./models/MultiVersionPatientModel";
import $ from "jquery";

export default class FhirClient {
  API_URL = "http://192.168.100.130:8080/baseR4";

  fetchPatientsListNextPage(url, onSuccess, onFailure) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.patientList = this.patientList.concat(
          data.entry.map((entry) => new PatientModel(entry.resource))
        );
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
      });
  }

  fetchPatientDataNextPage(url, onSuccess, onFailure) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        data.entry.forEach((entry) => {
          switch (entry.resource.resourceType) {
            case "Patient":
              this.patientData.patient = new MultiVersionPatientModel();
              var patient = new PatientModel(entry.resource);
              var currVerId = patient.meta.versionId;
              this.patientData.patient.addVersion(currVerId, patient);
              for (var ver = currVerId - 1; ver >= 1; ver--) {
                this.historyToFetch.push({
                  resource: "Patient",
                  id: patient.id,
                  versionToFetch: ver,
                });
              }

              break;
            case "Observation":
              this.patientData.observations.push(
                new ObservationModel(entry.resource)
              );
              break;
            case "MedicationRequest":
              this.patientData.medicationRequests.push(
                new MedicationRequestModel(entry.resource)
              );
              break;
            default:
              break;
          }
        });
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
          this.fetchPatientDataHistory(onSuccess, onFailure);
        }
      })
      .catch((error) => {
        onFailure(error);
      });
  }

  async fetchPatientDataHistory(onSuccess, onFailure) {
    try {
      for (var entry of this.historyToFetch) {
        var url = `${this.API_URL}/${entry.resource}/${entry.id}/_history/${entry.versionToFetch}?_format=json`;
        await fetch(url, { mode: "cors" })
          .then((response) => response.json())
          .then((data) => {
            switch (data.resourceType) {
              case "Patient":
                var patient = new PatientModel(data);
                var currVerId = patient.meta.versionId;
                this.patientData.patient.addVersion(currVerId, patient);
                break;
              case "Observation":
                break;
              case "MedicationRequest":
                break;
              default:
                break;
            }
          });
      }
      this.historyToFetch = [];
      onSuccess();
    } catch {
      onFailure();
    }
  }

  fetchPatientsList(onSuccess, onFailure) {
    this.patientList = [];
    const url = `${this.API_URL}/Patient?_count=50&_format=json`;
    this.fetchPatientsListNextPage(url, onSuccess, onFailure);
  }

  fetchPatientData(patientId, onSuccess, onFailure) {
    this.patientData = {
      patient: {},
      observations: [],
      medicationRequests: [],
    };
    this.historyToFetch = [];
    const url = `${this.API_URL}/Patient/${patientId}/$everything?_count=50&_format=json`;
    this.fetchPatientDataNextPage(url, onSuccess, onFailure);
  }

  updateResource(resource, id, patch, onSuccess, onFailure) {
    const url = `${this.API_URL}/${resource}/${id}?_format=application/json-patch+json`;
    $.ajax({
      url: url,
      method: "PATCH",
      contentType: "application/json-patch+json",
      data: JSON.stringify(patch),
    })
      .done((data) => {
        var newVersion;
        switch(data.resourceType) {
          case "Patient":
            var newPatient = new PatientModel(data);
            newVersion = newPatient.meta.versionId;
            this.patientData.patient.addVersion(newVersion, newPatient);
            break;
          default:
            break;
        }
        onSuccess(newVersion);
      })
      .fail((error) => {
        onFailure();
        console.log(error);
      });
  }
}
