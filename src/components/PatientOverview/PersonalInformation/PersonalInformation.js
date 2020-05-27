import React from "react";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Table from "react-bootstrap/Table";

import PatientActive from "./PatientActive";
import PatientName from "./PatientName";

function PersonalInformation(props) {
  var deceasedText = <span>{props.patient.getDeceased(true, "Unknown")}</span>;
  var partOfMultipleBirthText = (
    <span>{props.patient.getPartOfMultipleBirth(true, "Unknown")}</span>
  );
  return (
    <Card>
      {/* <Image src="https://thispersondoesnotexist.com/image" rounded/> */}
      <Card.Body>
        <PatientActive patient={props.patient} />
        <Table>
          <tbody>
            <tr>
              <th scope="col">Name</th>
              <td>
                <PatientName patient={props.patient} />
              </td>
            </tr>
            <tr>
              <th scope="col">Gender</th>
              <td>{props.patient.getGender(true)}</td>
            </tr>
            <tr>
              <th scope="col">Birth date</th>
              <td>{props.patient.getBirthdate()}</td>
            </tr>
            <tr>
              <th scope="col">Deceased</th>
              <td>{deceasedText}</td>
            </tr>
            <tr>
              <th scope="col">Part of a multiple birth</th>
              <td>{partOfMultipleBirthText}</td>
            </tr>
            <tr>
              <th scope="col">Marital status</th>
              <td>{props.patient.getMaritalStatus('Unknown')}</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default PersonalInformation;
