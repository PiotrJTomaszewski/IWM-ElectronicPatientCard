import Model from "./Model";
import AddressModel from "./AddressModel";

export default class PatientExtensionModel extends Model {
  static extType = {
    "us-core-race": 0,
    "us-core-etnicity": 1,
    "patient-motherMaidenName": 2,
    "us-core-birthsex": 3,
    "patient-birthPlace": 4,
    "disability-adjusted-life-years": 5,
    "quality-adjusted-life-years": 6,
  };

  constructor(resource) {
    super();
    this.url = this._getPath(resource, "url");
    var extension = this._getPath(resource, "extension");
    switch (this.url) {
      case "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race":
        this.type = PatientExtensionModel.extType["us-core-race"];
        if (extension) {
          for (let i = 0; i < extension.length; i++) {
            if (extension[i].url === "text") {
              this.value = this._getPath(extension[i], "valueString");
              break;
            }
          }
        }
        break;
      case "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity":
        this.type = PatientExtensionModel.extType["us-core-etnicity"];
        if (extension) {
          for (let i = 0; i < extension.length; i++) {
            if (extension[i].url === "text") {
              this.value = this._getPath(extension[i], "valueString");
            }
          }
        }
        break;
      case "http://hl7.org/fhir/StructureDefinition/patient-mothersMaidenName":
        this.type = PatientExtensionModel.extType["patient-motherMaidenName"];
        this.value = this._getPath(resource, "valueString");
        break;
      case "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex":
        this.type = PatientExtensionModel.extType["us-core-birthsex"];
        this.value = this._getPath(resource, "valueCode");
        break;
      case "http://hl7.org/fhir/StructureDefinition/patient-birthPlace":
        this.type = PatientExtensionModel.extType["patient-birthPlace"];
        if (this._getPath(resource, "valueAddress") !== undefined) {
          this.value = new AddressModel(resource.valueAddress);
        }
        break;
      case "http://synthetichealth.github.io/synthea/disability-adjusted-life-years":
        this.type = PatientExtensionModel.extType["disability-adjusted-life-years"];
        this.value = this._getPath(resource, "valueDecimal");
        break;
      case "http://synthetichealth.github.io/synthea/quality-adjusted-life-years":
        this.type = PatientExtensionModel.extType["quality-adjusted-life-years"];
        this.value = this._getPath(resource, "valueDecimal")
        break;
      default:
        console.log("Unknown PatientExtension: ", this.url);
        break;
    }
  }

}
