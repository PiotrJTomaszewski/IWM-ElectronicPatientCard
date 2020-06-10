import FHIR from "fhirclient";

class FhirClient {
  patientsList = {}
  patientData = {
    patient: {},
    observation: {},
    medicationStatement: {}
  }
  constructor(baseApiUrl) {
    this.client = FHIR.client(baseApiUrl);
  }

  downloadPatientsList(onSuccess, onFailure) {
    this.client
      .request("Patient", {
        pageLimit: 0,
        flat: true,
      })
      .then((entries) => {
        this.patientsList = entries;
        if (entries && entries.length > 0) {
          onSuccess();
        } else {
          onFailure();
        }
      });
  }

  downloadPatientData(patientId, onSuccess, onFailure) {
    // this._downloadEveryPatientData(patientId, onSuccess, onFailure);
    this._downloadNecessarryPatientData(patientId, onSuccess, onFailure);
  }

  _downloadEveryPatientData(patientId, onSuccess, onFailure) {
    this.client
      .request(`Patient/${patientId}/$everything`, {
        pageLimit: 0,
        flat: true,
        graph: true
      })
      .then((entries) => {
        // TODO: Save data
        if (entries && entries.length > 0) {
          onSuccess();
        } else {
          onFailure();
        }
      }).catch(() =>{
        // It seems that this operation isn't supported on most of the publicly available servers (most likely due to the high resource consumption)
        onFailure('everything');
        this._downloadNecessarryPatientData(patientId, onSuccess, onFailure);
    });
  }

  _downloadNecessarryPatientData(patientId, onSuccess, onFailure) {
    var leftToDownload = 3;
    this.client
      .request(`Patient/${patientId}`, {
        pageLimit: 0,
        flat: true,
        graph: true
      })
      .then((data) => {
        this.patientData.patient = data;
        leftToDownload--;
        if (leftToDownload === 0) {
          onSuccess();
        }
      })
      .catch(() => {onFailure('patient')});
    this.client
      .request(`Observation?patient=${patientId}`, {
        pageLimit: 0,
        flat: true
      })
      .then((data) => {
        this.patientData.observation = data;
        leftToDownload--;
        if (leftToDownload === 0) {
          onSuccess();
        }
      })
      .catch(() => {onFailure('observation')});
    this.client
      .request(`MedicationStatement?patient=${patientId}`, {
        pageLimit: 0,
        flat: true,
        resolveReferences: ["medication"],
        graph: true
      })
      .then((data) => {
        this.patientData.medicationStatement = data;
        leftToDownload--;
        if (leftToDownload === 0) {
          onSuccess();
        }
      })
      .catch(() => {onFailure('medicationStatement')});
  }

  getPatientsList() {
    return this.patientsList;
  }

  getPatient() {
    return this.patientData.patient;
  }

  getObservations() {
    return this.patientData.observation;
  }

  getMedicationStatements() {
    return this.patientData.medicationStatement;
  }

  getPath(object, path) {
    return this.client.getPath(object, path);
  }
}
export default FhirClient;
