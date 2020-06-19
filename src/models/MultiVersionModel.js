export default class MultiVersionModel {
  currentVersion = 1; // Version numbering begins at 1
  versionNo = 0;
  modelVersions = [];

  constructor(localId) {
    this.localId = localId;
  }

  addVersion(versionPar, model) {
    var version = parseInt(versionPar);
    if (version > this.currentVersion) {
      this.currentVersion = version;
    }
    this.versionNo++;
    this.modelVersions[version] = model;
  }

  getCurrent() {
    return this.modelVersions[this.currentVersion];
  }

  getLast() {
    return this.modelVersions[this.versionNo];
  }

  isDifferentFromPrev(fieldName) {
    if (this.currentVersion === 1) {
      return false;
    }
    var currVal;
    var prevVal;
    if (this.modelVersions[this.currentVersion]) {
      currVal = this.modelVersions[this.currentVersion][fieldName];
    }
    if (this.modelVersions[this.currentVersion - 1]) {
      prevVal = this.modelVersions[this.currentVersion - 1][fieldName];
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

  isCurrentTheLast() {
    return this.currentVersion === this.versionNo;
  }
}
