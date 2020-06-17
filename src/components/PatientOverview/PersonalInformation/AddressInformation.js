import React from "react";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";

import ModalWithButton from "../ModalWithButton";
import RawHtml from "../../RawHtml";

class AddressInformation extends React.Component {
  createList = () => {
    var patient = this.props.fhirClient.patientData.patient;
    var addresses = patient.addresses;
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
      var map;
      if (
        address.latLong !== undefined &&
        address.latLong.latitude !== undefined &&
        address.latLong.longitude !== undefined
      ) {
        var position = [
          address.latLong.latitude,
          address.latLong.longitude,
        ];
        console.log(position);
        map = (
          <Map center={position} zoom={13} className="map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>{patient.getMainName().getFullName()}</Popup>
            </Marker>
          </Map>
        );
      }
      return (
        <tr key={"AddressInformationModal" + key++}>
          <td>
            <ModalWithButton
              tooltip={"Click to see the full address"}
              buttonText={shortAddress}
              modalTitle="Address details"
              modalBody={
                <div className="flex-col">
                  <RawHtml>{address.getFullAddressHtml()}</RawHtml>
                  {(map !== undefined)? map: ''}
                </div>
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
        <Card.Title className="text-center mt-4">
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
