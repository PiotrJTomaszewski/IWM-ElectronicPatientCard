import React from "react";
import ModalWithButton from "../../ModalWithButton";
import Table from "react-bootstrap/Table";
import RawHtml from "../../../RawHtml";

class ContactItem extends React.Component {
  render() {
    var name = this.props.contact.getHumanName();
    var fullName = "Unknown";
    if (name) {
      fullName = name.getFullName();
    }
    //tooltip, buttonText, modalTitle, modalTableHeaderRow, modalTableBody
    var telecom = this.props.contact.getTelecoms();
    console.log(telecom);
    var telecomHtml = "Unknown";
    if (telecom) {
      if (telecom.length > 0 && telecom[0].getRank()) {
        telecom.sort((a, b) => {
          return a.getRank() - b.getRank();
        });
      }
      console.log('e', telecom);
      var key = 0;
      var telecomHtmls = telecom.map((element) => {
        return (
          <tr key={"telecomHtmls"+key++}>
            <td>{element.getHtml(key)}</td>
          </tr>
        );
      });
      var telecomData = telecom[0].getHtml('contactPartyMCM' + Math.random(), false);
      telecomHtml = (
        <ModalWithButton
          tooltip={telecomData.title + " (Click to see more contact options)"}
          buttonText={telecomData.html}
          modalTitle={"Contact details of " + fullName}
          modalBody={
            <Table>
              <thead></thead>
              <tbody>
                {telecomHtmls}
              </tbody>
            </Table>
          }
        />
      );
    }
    var address = this.props.contact.getAddress();
    var addressHtml = "Unknown";
    if (address) {
      addressHtml = address.getShortAddress();
      addressHtml = (
        <ModalWithButton
          tooltip={addressHtml.title + " (Click to see the full address)"}
          buttonText={addressHtml.html}
          modalTitle={"Address of " + fullName}
          modalBody={<RawHtml>{address.getFullAddressHtml()}</RawHtml>}
        />
      );
    }
    return (
      <tr>
        <td>
          {this.props.contact.getRelationships("Unknown", {
            boolean: true,
            concWith: ", ",
          })}
        </td>
        <td>{fullName}</td>
        <td>{telecomHtml}</td>
        <td>{addressHtml}</td>
        <td>{this.props.contact.getGender(true, 'Unknown')}</td>
        <td>{this.props.contact.getOrganization('Unknown')}</td>
        <td>{this.props.contact.getPeriod(true, 'Unknown')}</td>
      </tr>
    );
  }
}

export default ContactItem;
