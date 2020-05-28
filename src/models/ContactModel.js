import HumanNameModel from "./HumanNameModel";
import TelecomModel from "./TelecomModel";
import AddressModel from "./AddressModel";
import { helperGetPeriod, capitalizeFirstLetter } from "../Helpers";

class ContactModel {
  humanName = undefined;
  telecoms = undefined;
  address = undefined;
  constructor(contact) {
    this.contact = contact;
    if (contact) {
      if (contact.name) {
        this.humanName = new HumanNameModel(contact.name);
      }
      if (contact.telecom) {
        this.telecoms = contact.telecom.map((element) => {
          return new TelecomModel(element);
        });
      }
      if (contact.address) {
        this.address = new AddressModel(contact.address);
      }
    }
  }

  getRelationships(
    ifNotFound = undefined,
    concatenate = { boolean: false, concWith: ", " }
  ) {
    if (this.contact.relationship && this.contact.relationship.length > 0) {
      var relationships = this.contact.relationship.map((element) => {
        var text;
        var display;
        if (element.text) {
          text = element.text;
        }
        if (element.coding && element.coding.length > 0 && element.coding[0].display) {
          display = element.coding[0].display;
        }
        if (text && display) {
          return `${text} (${display})`;
        } else if (text) {
          return text;
        } else if (display) {
          return display;
        } else {
          return ifNotFound;
        }
      });
      if (concatenate.boolean) {
        return relationships.join(concatenate.concWith);
      }
      return relationships;
    }
    return ifNotFound;
  }

  getHumanName() {
    return this.humanName;
  }

  getTelecoms() {
    return this.telecoms;
  }

  getAddress() {
    return this.address;
  }

  getGender(capitalize = false, ifNotFound = undefined) {
    if (this.contact.gender) {
      if (capitalize) return capitalizeFirstLetter(this.contact.gender);
      return this.contact.gender;
    }
    return ifNotFound;
  }

  getOrganization(ifNotFound = undefined) {
    if (this.contact.organization && this.contact.organization.display) {
      return this.contact.organization.display;
    }
    return ifNotFound;
  }

  getPeriod(asString = false, ifNotFound = undefined) {
    return helperGetPeriod(this.contact.period, asString, ifNotFound);
  }
}

export default ContactModel;
