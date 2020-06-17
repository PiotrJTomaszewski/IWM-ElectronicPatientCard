import React from "react";

import Model from "./Model";

export default class TelecomModel extends Model {
    constructor(resource) {
        super();
        this.system = this._getPath(resource, "system");
        this.value = this._getPath(resource, "value");
        this.use = this._getPath(resource, "use");
    }

    getHtml(key, asTableRow = true) {
        var use = {
          isClass: false,
          text: "Other",
        };
        var title;
        switch (this.use) {
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
        switch (this.system) {
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
        var value = this.value;
        if (asTableRow) {
          return (
            <tr key={key} title={title}>
              <td>
                <i className={systemImgClass}></i>{" "}
                {use.isClass ? <i className={use.text}></i> : use.text} {value}{" "}
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
              </div>
            ),
          };
        }
      }
}