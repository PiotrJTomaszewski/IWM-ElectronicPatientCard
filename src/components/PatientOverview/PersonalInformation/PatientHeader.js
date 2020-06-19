import React from 'react';
import RawHtml from '../../RawHtml';

function PatientHeader(props) {
  console.log(props)
  var text = props.fhirClient.patientData.patient.getCurrent().toText();
  if (!text) {
    text = "Unspecified";
  }
  return (
    <div className="display-2 m-auto">
      <RawHtml>{text}</RawHtml>
    </div>
  )
}

export default PatientHeader;