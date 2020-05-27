import React from "react";
import helperGetPeriod from "../Helpers";

class AddressModel {
  constructor(address) {
    this.address = address;
  }

  getUse(ifNotFound = undefined) {
    if (this.address.use === undefined) {
      return ifNotFound;
    }
    return this.address.use;
  }

  getType(ifNotFound = undefined) {
    if (this.address.type === undefined) {
      return ifNotFound;
    }
    return this.address.type;
  }

  getText(ifNotFound = undefined) {
    if (this.address.text === undefined) {
      return ifNotFound;
    }
    return this.address.text;
  }

  getLines(
    ifNotFound = undefined,
    concatenate = {boolean: false, concWith: " " }
  ) {
    if (this.address.line === undefined || this.address.line.length === 0) {
      return ifNotFound;
    }
    if (concatenate.boolean) {
      return this.address.line.join(concatenate.concWith);
    }
    return this.address.line;
  }

  getCity(ifNotFound = undefined) {
    if (this.address.city === undefined) {
      return ifNotFound;
    }
    return this.address.city;
  }

  getDistrict(ifNotFound = undefined) {
    if (this.address.district === undefined) {
      return ifNotFound;
    }
    return this.address.city;
  }

  getState(ifNotFound = undefined) {
    if (this.address.state === undefined) {
      return ifNotFound;
    }
    return this.address.state;
  }

  getPostalCode(ifNotFound = undefined) {
    if (this.address.postalCode === undefined) {
      return ifNotFound;
    }
    return this.address.postalCode;
  }

  getCountry(ifNotFound = undefined) {
    if (this.address.country === undefined) {
      return ifNotFound;
    }
    return this.address.country;
  }

  getPeriod(asString = false, ifNotFound = undefined) {
    return helperGetPeriod(this.address.period, asString, ifNotFound);
  }

  getShortAddress() {
    var use;
    var title;
    switch (this.getUse()) {
      case "home":
        use = { isClass: true, text: "fas fa-home" };
        title = "Home";
        break;
      case "work":
        use = { isClass: true, text: "fas fa-briefcase" };
        title = "Work";
        break;
      case "temp":
        use = { isClass: false, text: "temp" };
        title = "Temporary";
        break;
      case "old":
        use = { isClass: false, text: "old" };
        title = "Old";
        break;
      case "billing":
        use = { isClass: true, text: "fas fa-dollar-sign" };
        title = "Billing";
        break;
      default:
        use = { isClass: false, text: "other" };
        title = "Other";
        break;
    }
    title += " ";
    var type;
    switch (this.getType()) {
      case "postal":
        type = { isClass: true, text: ["fas fa-mail-bulk"] };
        title += "postal";
        break;
      case "physical":
        type = { isClass: true, text: ["fas fa-building"] };
        title += "physical";
        break;
      case "both":
        type = {
          isClass: true,
          text: ["fas fa-mail-bulk", "fas fa-building"],
        };
        title += "postal & physical";
        break;
      default:
        type = { isClass: false, text: ["unknown"] };
        title += "unknown";
        break;
    }
    title += " address";
    var text =
      this.getLines("", { boolean: true, concWith: " " }) +
      ", " +
      this.getCity("");
    return {
      title: title,
      html: (
        <div>
          {use.isClass ? <i className={use.text}></i> : use.text}{" "}
          {type.isClass ? <i className={type.text[0]}></i> : type.text[0]}{" "}
          {type.text.length === 2 ? (
            <i className={type.text[1]}></i>
          ) : undefined}{" "}
          {text} {this.getPeriod(true, undefined)}
        </div>
      ),
    };
  }

  getFullAddressHtml() {
    var html = this.getText();
    if (html !== undefined) {
      return (html);
    }
    var lines = this.getLines(undefined, {
      boolean: true,
      concWith: "<br/>",
    });
    var city = this.getCity(undefined);
    var district = this.getDistrict(undefined);
    var state = this.getState(undefined);
    var postalCode = this.getPostalCode(undefined);
    var country = this.getCountry(undefined);

    html = lines + "<br/>";
    if (district !== undefined) {
      html += district + "<br/>";
    }
    if (city !== undefined) {
      html += city + ", ";
    }
    if (postalCode !== undefined) {
      html += postalCode;
    }
    html += "<br/>";
    if (state !== undefined) {
      html += state + "<br/>";
    }
    if (country !== undefined) {
      html += country;
    }
    return html;
  }
}

export default AddressModel;
