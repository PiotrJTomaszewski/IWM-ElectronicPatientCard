export default class MultiVersionPatientModel {
  currentVersion = 1;
  versionNo = 0;
  patientVersions = [];

  addVersion(versionPar, model) {
    var version = parseInt(versionPar);
    if (version > this.currentVersion) {
      this.currentVersion = version;
    }
    this.versionNo++;
    this.patientVersions[version] = model;
  }

  getCurrent() {
    return this.patientVersions[this.currentVersion];
  }

  isDifferentFromPrev(fieldName) {
    if (this.currentVersion === 1) {
      return false;
    }
    var currVal;
    var prevVal;
    if (this.patientVersions[this.currentVersion]) {
      currVal = this.patientVersions[this.currentVersion][fieldName];
    }
    if (this.patientVersions[this.currentVersion - 1]) {
      prevVal = this.patientVersions[this.currentVersion - 1][fieldName];
    }
    return JSON.stringify(currVal) !== JSON.stringify(prevVal);
  }

  switchToVersion(newVersionText) {
    switch (newVersionText) {
      case "first":
        this.currentVersion = 1;
        break;
      case "next":
        this.currentVersion++;
        break;
      case "prev":
        this.currentVersion--;
        break;
      case "last":
        this.currentVersion = this.versionNo;
        break;
      default:
        this.currentVersion = parseInt(newVersionText);
        break;
    }
    return this.currentVersion;
  }
}
