import React from 'react';
import RawHtml from '../../RawHtml';

function PatientHeader(props) {
  console.log(props)
  var text = props.fhirClient.patientData.patient.toText();
  if (!text) {
    text = "Unspecified";
  }
  return (
    <div className="display-2 m-3">
      <RawHtml>{text}</RawHtml>
    </div>
  )
}

export default PatientHeader;