import React from "react";

import { capitalizeFirstLetter } from "../../Helpers";

function PatientsListItem(props) {
  var patientId = props.patient.id;
  var mainName = props.patient.getMainName();
  return (
    <tr>
      <td>{mainName.family}</td>
      <td>{mainName.getJoinedGiven()}</td>
      <td>{capitalizeFirstLetter(props.patient.gender)}</td>
      <td>{props.patient.birthDate}</td>
      <td>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => props.patientSelectedCallback(patientId)}
        >
          Show info
        </button>
      </td>
    </tr>
  );
}

export default PatientsListItem;
