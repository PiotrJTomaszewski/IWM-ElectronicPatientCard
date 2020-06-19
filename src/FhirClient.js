import PatientModel from "./models/PatientModel";
import ObservationModel from "./models/ObservationModel";
import MedicationRequestModel from "./models/MedicationRequestModel";
import MultiVersionModel from "./models/MultiVersionModel";
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
          var currVerId;
          var ver;
          switch (entry.resource.resourceType) {
            case "Patient":
              this.patientData.patient = new MultiVersionModel();
              var newPatient = new PatientModel(entry.resource);
              currVerId = newPatient.meta.versionId;
              this.patientData.patient.addVersion(currVerId, newPatient);
              for (ver = currVerId - 1; ver >= 1; ver--) {
                this.historyToFetch.push({
                  resource: "Patient",
                  id: newPatient.id,
                  versionToFetch: ver,
                });
              }
              break;
            case "Observation":
              var observationLocalId = this.patientData.observations.length;
              this.patientData.observations[observationLocalId] = new MultiVersionModel(observationLocalId);
              var newObservation = new ObservationModel(entry.resource);
              currVerId = newObservation.meta.versionId;
              this.patientData.observations[observationLocalId].addVersion(currVerId, newObservation);
              for (ver = currVerId - 1; ver >= 1; ver--) {
                this.historyToFetch.push({
                  resource: "Observation",
                  id: newObservation.id,
                  versionToFetch: ver,
                  localId: observationLocalId
                })
              }
              break;
            case "MedicationRequest":
              var medicationRequestLocalId = this.patientData.medicationRequests.length;
              this.patientData.medicationRequests[medicationRequestLocalId] = new MultiVersionModel(medicationRequestLocalId);
              var newMedicationRequest = new MedicationRequestModel(entry.resource);
              currVerId = newMedicationRequest.meta.versionId;
              this.patientData.medicationRequests[medicationRequestLocalId].addVersion(currVerId, newMedicationRequest);
              for (ver = currVerId - 1; ver >= 1; ver--) {
                this.historyToFetch.push({
                  resource: "MedicationRequest",
                  id: newMedicationRequest.id,
                  versionToFetch: ver,
                  localId: medicationRequestLocalId
                })
              }
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
        this.tmpEntry = entry;
        var url = `${this.API_URL}/${entry.resource}/${entry.id}/_history/${entry.versionToFetch}?_format=json`;
        await fetch(url, { mode: "cors" })
          .then((response) => response.json())
          .then((data) => {
            switch (data.resourceType) {
              case "Patient":
                var newPatient = new PatientModel(data)
                this.patientData.patient.addVersion(newPatient.meta.versionId, newPatient);
                break;
              case "Observation":
                var newObservationModel = new ObservationModel(data);
                this.patientData.observations[this.tmpEntry.localId].addVersion(newObservationModel.meta.versionId, newObservationModel);
                break;
              case "MedicationRequest":
                var medicationRequestModel = new MedicationRequestModel(data);
                this.patientData.medicationRequests[this.tmpEntry.localId].addVersion(medicationRequestModel.meta.versionId, medicationRequestModel);
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
