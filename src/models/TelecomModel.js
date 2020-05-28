import React from "react";
import { helperGetPeriod } from "../Helpers";

class TelecomModel {
  constructor(telecom) {
    this.telecom = telecom;
  }

  getSystem() {
    return this.telecom.system;
  }

  getValue() {
    return this.telecom.value;
  }

  getUse() {
    return this.telecom.use;
  }

  getRank() {
    return this.telecom.rank;
  }

  getPeriod(asString = false, ifNotFound = undefined) {
    return helperGetPeriod(this.telecom.period, asString, ifNotFound);
  }

  getHtml(key, asTableRow = true) {
    var use = {
      isClass: false,
      text: "Other",
    };
    var title;
    switch (this.getUse()) {
      case "home":
        use = {
          isClass: true,
          text: "fas fa-home",
        };
        title = "Home";
        break;
      case "work":
        use = {
          isClass: true,
          text: "fas fa-briefcase",
        };
        title = "Work";
        break;
      case "temp":
        use = {
          isClass: false,
          text: "temp",
        };
        title = "Temporary";
        break;
      case "old":
        use = {
          isClass: false,
          text: "old",
        };
        title = "Old";
        break;
      case "mobile":
        use = {
          isClass: true,
          text: "fas fa-mobile-alt",
        };
        title = "Mobile";
        break;
      default:
        use = {
          isClass: false,
          text: "other",
        };
        title = "Other";
        break;
    }
    title += " ";
    var systemImgClass;
    switch (this.getSystem()) {
      case "phone":
        systemImgClass = "fas fa-phone";
        title += "phone number";
        break;
      case "fax":
        systemImgClass = "fas fa-fax";
        title += "fax number";
        break;
      case "email":
        systemImgClass = "fas fa-at";
        title += "email address";
        break;
      case "pager":
        systemImgClass = "fas fa-pager";
        title += "pager code";
        break;
      case "url":
        systemImgClass = "fas fa-link";
        title += "URL";
        break;
      case "sms":
        systemImgClass = "fas fa-sms";
        title += "SMS number";
        break;
      default:
        systemImgClass = "fas fa-address-book";
        title += "contact";
        break;
    }
    var value = this.getValue();
    var period = this.getPeriod(true, undefined);
    if (asTableRow) {
      return (
        <tr key={key} title={title}>
          <td>
            <i className={systemImgClass}></i>{" "}
            {use.isClass ? <i className={use.text}></i> : use.text} {value}{" "}
            {period}
          </td>
        </tr>
      );
    } else {
      return {
        title: title,
        html: (
          <div key={key}>
            <i className={systemImgClass}></i>{" "}
            {use.isClass ? <i className={use.text}></i> : use.text} {value}{" "}
            {period}
          </div>
        ),
      };
    }
  }
}

export default TelecomModel;
