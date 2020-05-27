import React from 'react';
import Badge from 'react-bootstrap/Badge';

function PatientActive(props) {
  var active = props.patient.getActive();
  if (active) {
    return (<Badge pill variant="success">Active patient</Badge>);
  }
  if (active === false) {
    return (<Badge pill variant="danger">Inactive patient</Badge>);
  }
  return (<Badge pill variant="warning">Unknown status</Badge>);
}

export default PatientActive;