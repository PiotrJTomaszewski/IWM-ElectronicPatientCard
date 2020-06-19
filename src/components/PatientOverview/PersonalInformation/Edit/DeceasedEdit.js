import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";


class DeceasedEdit extends React.Component {
  constructor(props) {
    super(props);
    const currentMaritalStatus = this.props.fhirClient.patientData.patient.getCurrent().maritalStatus;
    this.state = {
      modalShown: false,
      newMaritalStatusCode: currentMaritalStatus.code,
    };
  }

  modalShowHandle = () => {
    this.setState((state) => {
      return {
        modalShown: true,
      };
    });
    if (this.props.modalShowHandle) {
      this.props.modalShowHandle();
    }
  };

  modalCancelHandle = () => {
    this.setState((state) => {
      return {
        modalShown: false,
      };
    });
    if (this.props.modalHideHandle) {
      this.props.modalHideHandle();
    }
  };

  newValueHandle = (event) => {
    if (event && event.target && event.target.value) {
      this.setState({
        newMaritalStatusCode: event.target.value,
      });
    }
  };

  onUpdateSuccess = () => {

  }

  onUpdateFail = () => {

  }

  saveDataHandle = () => {
    const patientId = this.props.fhirClient.patientData.patient.getCurrent().id;
    const newCode = this.state.newMaritalStatusCode;
    const newText = MaritalStatusModel.maritalStatusCodes[newCode];
    console.log(newCode, newText);
    const patch = [{
      op: "add",
      path: "/maritalStatus",
      value: {
        // In synthea dataset both text and display are the same as code but on update we're changing them to an actual text representation
        coding: [{system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus", code: newCode, display: newText}],
        text: newText
      }
    }]
    this.props.fhirClient.updateResource("Patient", patientId, patch, this.onUpdateSuccess, this.onUpdateFail);
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
          title={this.props.tooltip}
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

export default DeceasedEdit;
