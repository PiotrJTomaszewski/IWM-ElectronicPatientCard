import React from "react";

function PatientsListItem(props) {
  var patientId = props.patient.getId();
  switch (props.patient.getActive()) {
    case true:
      var active = "Active";
      break;
    case false:
      var active = "Inactive";
      break;
    default:
      var active = "Unspecified";
      break;
  }
  var mainName = props.patient.getMainName();
  return (
    <tr>
      <td>{mainName.getFamilyName()}</td>
      <td>{mainName.getGivenName(true)}</td>
      <td>{props.patient.getGender(true)}</td>
      <td>{props.patient.getBirthdate()}</td>
      <td>{active}</td>
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
