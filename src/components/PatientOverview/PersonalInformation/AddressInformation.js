import React from "react";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import ModalWithButton from "../ModalWithButton";
import RawHtml from '../../RawHtml';

class AddressInformation extends React.Component {
  createList = () => {
    var addresses = this.props.patient.getAllAddresses();
    if (addresses === undefined) {
      return (
        <tr>
          <td>No address found</td>
        </tr>
      );
    }
    var key = 0;
    return addresses.map((address) => {
      var shortAddress = address.getShortAddress();
      return (
        <tr key={"AddressInformationModal" + key++}>
          <td>
            <ModalWithButton
              tooltip={shortAddress.title + " (Click to see the full address)"}
              buttonText={shortAddress.html}
              modalTitle="Address details"
              modalBody={
                <RawHtml>{address.getFullAddressHtml()}</RawHtml>
              }
            />
          </td>
        </tr>
      );
    });
  };

  render() {
    return (
      <Card>
        <Card.Title>
          <span className="h2">Addressess</span>
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

export default AddressInformation;
