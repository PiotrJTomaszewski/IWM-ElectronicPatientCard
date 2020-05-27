import React from 'react';

function PatientHeader(props) {
  var text = props.patient.getText();
  console.log(text);
  if (!text) {
    text = "Brak";
  }
  return (
    <div className="display-2">
        <div dangerouslySetInnerHTML={insertHtml(text)}></div>
    </div>
  )
}

function insertHtml(text) {
  return {__html: text};
}

export default PatientHeader;