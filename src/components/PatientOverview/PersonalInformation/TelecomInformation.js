import React from "react";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import insertHtml from "../../../Helpers";

class TelecomInformation extends React.Component {
  createList = () => {
    var key = 0;
    var telecom = this.props.patient.getAllTelecom();
    if (telecom === undefined || telecom.length === 0) {
      return (
        <tr>
          <td>No detail found</td>
        </tr>
      );
    } else {
      return telecom.map((element) => {
        var use = {
          isClass: false,
          text: 'Other',
        };
        var title;
        switch (element.getUse()) {
          case "home":
            use = {
              isClass: true,
              text: 'fas fa-home'
            };
            title = "Home";
            break;
          case "work":
            use = {
              isClass: true,
              text: 'fas fa-briefcase'
            };
            title = "Work";
            break;
          case "temp":
            use = {
              isClass: false,
              text: "temp"
            };
            title = "Temporary";
            break;
          case "old":
            use = {
              isClass: false,
              text: "old"
            };
            title = "Old";
            break;
          case "mobile":
            use = {
              isClass: true,
              text: 'fas fa-mobile-alt'
            };
            title = "Mobile";
            break;
          default:
            use = {
              isClass: false,
              text: "other"
            };
            title = "Other";
            break;
        }
        title += " ";
        var systemImgClass;
        switch (element.getSystem()) {
          case "phone":
            systemImgClass = "fas fa-phone";
            title += "phone number";
            break;
          case "fax":
            systemImgClass = "fas fa-fax";
            title += "fax number";
            break;
          case "email":
            systemImgClass = "fas fa-envelope";
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
        var value = element.getValue();
        var period = element.getPeriod(true, "Unknown");
        return (
          <tr key={key++} title={title}>
            {/* <td>
              <i className={systemImgClass}></i>
            </td>
            <td>
              {use.isClass ? <i className={use.text}></i> : use.text}
            </td>
            <td>{value}</td>
            <td>{period}</td> */}
            <td><i className={systemImgClass}></i> {use.isClass ? <i className={use.text}></i> : use.text} {value} {period}</td>
          </tr>
        );
      });
    }
  };

  render() {
    return (
      <Card>
        <Card.Title>
          <span className="h2">Contact details</span>
        </Card.Title>
        <Card.Body>
          <Table>
            <thead></thead>
            <tbody>{this.createList()}</tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  }
}

export default TelecomInformation;
