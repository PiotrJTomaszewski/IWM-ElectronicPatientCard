import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import MedicationRequestModel from "../../../../models/MedicationRequestModel";

class MedicationRequestEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShown: false,
    };
  }

  componentDidUpdate() {

  }

  modalShowHandle = () => {
    this.setState((state) => {
      return {
        modalShown: true,
      };
    });
  };

  modalCancelHandle = () => {
    this.setState((state) => {
      return {
        modalShown: false,
      };
    });
  };

  onUpdateSuccess = (newVersion) => {
    this.props.parentOnVersionChangeHandle(newVersion);
    this.setState((state) => {
      return {
        modalShown: false,
      };
    });
  };

  onUpdateFail = () => {

  }

  saveDataHandle = () => {
    // const patientId = this.props.fhirClient.patientData.patient.getCurrent().id;
    // const newCode = this.state.newMaritalStatusCode;
    // const newText = MaritalStatusModel.maritalStatusCodes[newCode];
    // const patch = [{
    //   op: "replace",
    //   path: "/maritalStatus",
    //   value: {
    //     // In synthea dataset both text and display are the same as code but on update we're changing them to an actual text representation
    //     coding: [{system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus", code: newCode, display: newText}],
    //     text: newText
    //   }
    // }]
    // this.props.fhirClient.updateResource("Patient", patientId, patch, this.onUpdateSuccess, this.onUpdateFail);
  };

  render() {
    var patient = this.props.fhirClient.patientData.patient.getCurrent();
    var nextOptionKey = 0;
    return (
      <div className="ml-auto">
        <Button
          onClick={this.modalShowHandle}
          variant="link"
          className="p-0"
          title="Edit Marital Status"
        >
          {<i className="fas fa-edit"></i>}
        </Button>
        <Modal
          show={this.state.modalShown}
          onHide={this.modalCancelHandle}
          animation={false}
          size={this.props.size ? this.props.size : ""}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Patient's Marital Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <h5>Current value</h5>
              <span>{patient.maritalStatus.toText()}</span>
              <h5>New value</h5>
              <Form>
                <Form.Group controlId="newMaritalStatusFormGroup" />
                <Form.Control
                  as="select"
                  id="newMaritalStatusBox"
                  onChange={this.newValueHandle}
                  value={this.state.newMaritalStatusCode}
                >
                  {Object.keys(MaritalStatusModel.maritalStatusCodes).map(
                    (code) => (
                      <option value={code} key={nextOptionKey++}>
                        {MaritalStatusModel.maritalStatusCodes[code]}
                      </option>
                    )
                  )}
                </Form.Control>
              </Form>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.saveDataHandle}>
              Save
            </Button>
            <Button variant="secondary" onClick={this.modalCancelHandle}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default MedicationRequestEdit;
