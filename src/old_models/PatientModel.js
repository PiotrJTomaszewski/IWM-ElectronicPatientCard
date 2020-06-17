import {capitalizeFirstLetter} from "../Helpers";
import Model from "./Model";
import HumanNameModel from './HumanNameModel';
import TelecomModel from "./TelecomModel";
import AddressModel from "./AddressModel";
import IdentifierModel from "./IdentifierModel";
import ContactModel from "./ContactModel";

class PatientModel extends Model {
  humanNames = undefined
  telecom = undefined
  addresses = undefined
  identifiers = undefined
  contacts = undefined
  constructor(fhirClient, resource) {
    super(fhirClient, resource);
    var tmp = this._getPath('name');
    if (tmp !== undefined) {
      this.humanNames = tmp.map((element) => {
        return new HumanNameModel(element);
      });
    }
    tmp = this._getPath('telecom');
    if (tmp !== undefined) {
      this.telecom = tmp.map((element) => {
        return new TelecomModel(element);
      })
    }
    tmp = this._getPath('address');
    if (tmp !== undefined) {
      this.addresses = tmp.map((element) => {
        return new AddressModel(element);
      })
    }
    tmp = this._getPath('identifier');
    if (tmp !== undefined) {
      this.identifiers = tmp.map((element) => {
        return new IdentifierModel(element);
      })
    }
    tmp = this._getPath('contact');
    if (tmp !== undefined) {
      this.contacts = tmp.map((element) => {
        return new ContactModel(element);
      });
    }
  }

  getId() {
    return this._getPath("id");
  }

  getText() {
    // Patient text in Synthea is garbage
    // var text = this._getPath(`text.div`);
    // if (!text) {
    var mainName = this.getMainName();
    var givenName = mainName.getGivenName(false)[0];
    var familyName = mainName.getFamilyName();
    var gender = this.getGender();
    var age = this.getAge();
    // text = `${familyName}, ${givenName} (${gender} ${age}y)`;
    // }
    return `${familyName}, ${givenName} (${gender} ${age}y)`;
  }

  getAllIdentifiers() {
    return this.identifiers;
  }

  getActive() {
    return this._getPath("active");
  }

  getMainName() {
    var officialName;
    var usualName;
    var name;
    for (name of this.humanNames) {
      switch(name.getUse()) {
        case 'official':
          officialName = name;
          break;
        case 'usual':
          usualName = name;
          break;
        default:
          break;
      }
    }
    if (officialName) return officialName;
    if (usualName) return usualName;
    return this.humanNames[0];
  }

  getAllNames() {
    return this.humanNames;
  }

  getGender(capitalize = false) {
    var gender = this._getPath("gender");
    if (capitalize && gender) {
      return capitalizeFirstLetter(gender);
    }
    return gender;
  }

  getBirthdate() {
    return this._getPath("birthDate");
  }

  getAge() {
    var ageDiffMilliseconds = Date.now() - new Date(this.getBirthdate());
    var ageDate = new Date(ageDiffMilliseconds);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  getDeceased(asString=false, ifNotFound=undefined) {
    var deceased;
    var deceasedBoolean = this._getPath('deceasedBoolean');
    if (deceasedBoolean === false) {
      deceased = [false, ifNotFound];
    } else {
      var deceasedDateTime = this._getPath('deceasedDateTime');
      if (deceasedDateTime) {
        deceased = [true, deceasedDateTime];
      } else {
        deceased = [deceasedBoolean, ifNotFound];
      }
    }
    if (asString) {
      var deceasedText = ifNotFound;
      if (deceased[1] !== ifNotFound) {
        deceasedText = 'Yes, ' + deceased[1];
      } else if (deceased[0] === true) {
        deceasedText = 'Yes';
      } else if (deceased[0] === false) {
        deceasedText = 'No';
      }
      return deceasedText;
    }
    return deceased;
  }

  getPartOfMultipleBirth(asString=false, ifNotFound=undefined) {
    var multipleBirthBoolean = this._getPath('multipleBirthBoolean');
    var multipleBirth;
    if (multipleBirthBoolean === false) {
      multipleBirth = [false, 0];
    } else {
      var multipleBirthInteger = this._getPath('multipleBirthInteger');
      if (multipleBirthInteger) {
        multipleBirth = [true, multipleBirthInteger];
      } else {
        multipleBirth = [multipleBirthBoolean, ifNotFound];
      }
    }
    if (asString[0]) {
      var multipleBirthText = ifNotFound;
      if (multipleBirth[1] !== ifNotFound && multipleBirth[1] > 0) {
        multipleBirthText = 'Yes, ' + multipleBirth[1];
      } else if (multipleBirth[0] === true) {
        multipleBirthText = 'Yes';
      } else if (multipleBirth[0] === false) {
        multipleBirthText = 'No';
      }
      return multipleBirthText;
    }
    return multipleBirth;
  }

  getMaritalStatus(ifNotFound=undefined) {
    var maritalStatus = this._getPath('maritalStatus.text');
    if (maritalStatus === undefined) {
        maritalStatus = this._getPath('maritalStatus.coding.0.display');
    }
    if (maritalStatus !== undefined) {
      return capitalizeFirstLetter(maritalStatus);
    }
    return ifNotFound;
  }

  getAllTelecom() {
    return this.telecom;
  }

  getAllAddresses() {
    return this.addresses;
  }

  getAllContacts() {
    return this.contacts;
  }
}

export default PatientModel;