import React from "react";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";

import ModalWithButton from "../ModalWithButton";
import RawHtml from "../../RawHtml";
// import PatientActive from "./PatientActive";
import PatientName from "./PatientName";
import PatientExtensionModel from "../../../models/PatientExtensionModel";
import { capitalizeFirstLetter } from "../../../Helpers";
import MaritalStatusEdit from "./Edit/MaritalStatusEdit";
import DeceasedEdit from "./Edit/DeceasedEdit";

function PersonalInformation(props) {
  var patient = props.fhirClient.patientData.patient.getCurrent();
  var multiVerPatient = props.fhirClient.patientData.patient;
  var birthPlace = patient.getPatientExtension(
    PatientExtensionModel.extType["patient-birthPlace"]
  );
  var birthPlaceWithModal;
  if (birthPlace) {
    var shortAddress = birthPlace.getShortAddress();
    var map;
    if (
      birthPlace.latLong !== undefined &&
      birthPlace.latLong.latitude !== undefined &&
      birthPlace.latLong.longitude !== undefined
    ) {
      var position = [
        birthPlace.latLong.latitude,
        birthPlace.latLong.longitude,
      ];
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
    birthPlaceWithModal = (
      <ModalWithButton
        tooltip={"Click to see the full address"}
        buttonText={shortAddress}
        modalTitle="Address details"
        modalBody={
          <div className="flex-col">
            <RawHtml>{birthPlace.getFullAddressHtml()}</RawHtml>
            {map !== undefined ? map : ""}
          </div>
        }
      />
    );
  }
  const birthSex = patient.getPatientExtension(
    PatientExtensionModel.extType["us-core-birthsex"]
  );
  var birthSexText;
  switch (birthSex) {
    case "F":
      birthSexText = "Female";
      break;
    case "M":
      birthSexText = "Male";
      break;
    case "UNK":
      birthSexText = "Unknown";
      break;
    default:
      break;
  }
  return (
    <Card>
      <Card.Title className="text-center mt-4">
        <span className="h2">Personal Information</span>
      </Card.Title>
      {/* <Image src="" rounded/> */}
      <Card.Body>
        {/* <PatientActive fhirClient={props.patient} /> */}
        <Table className="card-table">
          <tbody>
            <tr>
              <th scope="col">Name</th>
              <td
                className={
                  multiVerPatient.isDifferentFromPrev("names")
                    ? "pers-inf-field-differ"
                    : ""
                }
              >
                <PatientName fhirClient={props.fhirClient} />
              </td>
            </tr>
            <tr>
              <th scope="col">Gender</th>
              <td
                className={
                  multiVerPatient.isDifferentFromPrev("gender")
                    ? "pers-inf-field-differ"
                    : ""
                }
              >
                {capitalizeFirstLetter(patient.gender)}
              </td>
            </tr>
            <tr>
              <th scope="col">Birth date</th>
              <td
                className={
                  multiVerPatient.isDifferentFromPrev("birthDate")
                    ? "pers-inf-field-differ"
                    : ""
                }
              >
                {new Date(patient.birthDate).toLocaleDateString("en-US")}
              </td>
            </tr>
            <tr>
              <th scope="col">Deceased</th>
              <td
                className={
                  multiVerPatient.isDifferentFromPrev("deceasedDateTime") ||
                  multiVerPatient.isDifferentFromPrev("deceasedBoolean")
                    ? "d-flex pers-inf-field-differ"
                    : "d-flex"
                }
              >
                {patient.deceasedDateTime
                  ? `Yes, ${new Date(patient.deceasedDateTime).toLocaleString(
                      "en-US"
                    )}`
                  : patient.deceasedBoolean === false
                  ? "No"
                  : "Unspecified"}
                {props.fhirClient.patientData.patient.isCurrentTheLast() ? (
                  <DeceasedEdit
                    fhirClient={props.fhirClient}
                    parentOnVersionChangeHandle={
                      props.parentOnVersionChangeHandle
                    }
                  />
                ) : null}
              </td>
            </tr>
            <tr>
              <th scope="col">Part of a multiple birth</th>
              <td
                className={
                  multiVerPatient.isDifferentFromPrev("multipleBirthBoolean")
                    ? "pers-inf-field-differ"
                    : ""
                }
              >
                {patient.isPartOfMultipleBirthText()}
              </td>
            </tr>
            <tr>
              <th scope="col">Marital status</th>
              <td
                className={
                  multiVerPatient.isDifferentFromPrev("maritalStatus")
                    ? "d-flex pers-inf-field-differ"
                    : "d-flex"
                }
              >
                {patient.maritalStatus.toText()}
                {props.fhirClient.patientData.patient.isCurrentTheLast() ? (
                  <MaritalStatusEdit
                    fhirClient={props.fhirClient}
                    parentOnVersionChangeHandle={
                      props.parentOnVersionChangeHandle
                    }
                  />
                ) : null}
              </td>
            </tr>
            <tr>
              <th scope="col">Communication</th>
              <td>{patient.communication.map((comm, index) => <div key={index}>{comm.toText()}</div>)}</td>
            </tr>
            <tr>
              <th scope="col">Race</th>
              <td>
                {patient.getPatientExtension(
                  PatientExtensionModel.extType["us-core-race"]
                )}
              </td>
            </tr>
            <tr>
              <th scope="col">Ethnicity</th>
              <td>
                {patient.getPatientExtension(
                  PatientExtensionModel.extType["us-core-etnicity"]
                )}
              </td>
            </tr>
            <tr>
              <th scope="col">Mother's maiden name</th>
              <td>
                {patient.getPatientExtension(
                  PatientExtensionModel.extType["patient-motherMaidenName"]
                )}
              </td>
            </tr>
            <tr>
              <th scope="col">Birth Sex</th>
              <td>{birthSexText}</td>
            </tr>
            <tr>
              <th scope="col">Birth Place</th>
              <td>
                {birthPlaceWithModal !== undefined ? birthPlaceWithModal : ""}
              </td>
            </tr>
            <tr>
              <th scope="col">Disability Adjusted Life Years</th>
              <td>
                {patient.getPatientExtension(
                  PatientExtensionModel.extType[
                    "disability-adjusted-life-years"
                  ]
                )}
              </td>
            </tr>
            <tr>
              <th scope="col">Quality Adjusted Life Years</th>
              <td>
                {patient.getPatientExtension(
                  PatientExtensionModel.extType["quality-adjusted-life-years"]
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default PersonalInformation;
