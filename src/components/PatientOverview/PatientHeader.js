import React from 'react';
import RawHtml from '../RawHtml';
function PatientHeader(props) {
  var text = props.patient.getText();
  console.log(text);
  if (!text) {
    text = "Brak";
  }
  return (
    <div className="display-2">
      <RawHtml>{text}</RawHtml>
    </div>
  )
}

export default PatientHeader;