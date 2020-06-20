import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import DateTimePicker from "react-datetime-picker";

import { capitalizeFirstLetter } from "../../../../Helpers";
import MedicationRequestModel from "../../../../models/MedicationRequestModel";

class MedicationRequestEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShown: false,
      currentRequest: this.props.currentRequest,
      newRequest: {
        status: this.props.currentRequest.status,
        intent: this.props.currentRequest.intent,
        authoredOn: new Date(this.props.currentRequest.authoredOn),
      },
    };
  }

  modalShowHandle = () => {
    this.setState({
      modalShown: true,
    });
  };

  modalCancelHandle = () => {
    this.setState({
      modalShown: false,
    });
  };

  onUpdateSuccess = (newVersion) => {
    this.props.parentOnVersionChangeHandle(newVersion);
    this.setState({
      modalShown: false,
    });
  };

  onUpdateFail = () => {};

  statusChangeHandle = (event) => {
    if (event && event.target) {
      const newStatus = event.target.value;
      this.setState((oldState) => {
        return {
          newRequest: {
            ...oldState.newRequest,
            status: newStatus,
          },
        };
      });
    }
  };

  intentChangeHandle = (event) => {
    if (event && event.target) {
      const newIntent = event.target.value;
      this.setState((oldState) => {
        return {
          newRequest: {
            ...oldState.newRequest,
            intent: newIntent,
          },
        };
      });
    }
  };

  authoredOnChangeHandle = (newDateTime) => {
    if (newDateTime) {
      this.setState((oldState) => {
        return {
          newRequest: {
            ...oldState.newRequest,
            authoredOn: newDateTime,
          },
        };
      });
    }
  };

  saveDataHandle = () => {
    const requestId = this.props.currentRequest.id;
    const newStatus = this.state.newRequest.status;
    const newIntent = this.state.newRequest.intent;
    const newAuthoredOn = this.state.newRequest.authoredOn;
    var patch = [];
    if (newStatus !== this.state.currentRequest.status) {
      patch.push({
        op: "replace",
        path: "/status",
        value: newStatus,
      });
    }
    if (newIntent !== this.state.currentRequest.intent) {
      patch.push({
        op: "replace",
        path: "/intent",
        value: newIntent,
      });
    }
    if (newAuthoredOn !== new Date(this.state.currentRequest.authoredOn)) {
      patch.push({
        op: "replace",
        path: "/authoredOn",
        value: newAuthoredOn,
      });
    }
    this.props.fhirClient.updateResource(
      "MedicationRequest",
      requestId,
      patch,
      this.onUpdateSuccess,
      this.onUpdateFail
    );
  };

  render() {
    var nextOptionKey = 0;
    return (
      <div className="ml-auto">
        <Button
          onClick={this.modalShowHandle}
          variant="link"
          className="p-0"
          title="Edit Medication Request"
        >
          <i className="fas fa-edit"></i>
        </Button>
        <Modal
          show={this.state.modalShown}
          onHide={this.modalCancelHandle}
          animation={false}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Medication Request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Current value</h5>
            <dl>
              <dt>Authored On</dt>
              <dd>
                {new Date(this.state.currentRequest.authoredOn).toLocaleString(
                  "en-US"
                )}
              </dd>
              <dt>Intent</dt>
              <dd>{capitalizeFirstLetter(this.state.currentRequest.intent)}</dd>
              <dt>Status</dt>
              <dd>{capitalizeFirstLetter(this.state.currentRequest.status)}</dd>
            </dl>
            <h5>New value</h5>
            <Form>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={this.state.newRequest.status}
                  onChange={this.statusChangeHandle}
                >
                  {Object.keys(MedicationRequestModel.statusCodes).map((code) => (
                    <option
                      value={MedicationRequestModel.statusCodes[code].code}
                      key={nextOptionKey++}
                    >
                      {MedicationRequestModel.statusCodes[code].display}
                    </option>
                  ))}
                </Form.Control>
                <Form.Label>Intent</Form.Label>
                <Form.Control
                  as="select"
                  value={this.state.newRequest.intent}
                  onChange={this.intentChangeHandle}
                >
                  {Object.keys(MedicationRequestModel.intentCodes).map((code) => (
                    <option
                     value={MedicationRequestModel.intentCodes[code].code}
                     key={nextOptionKey++}
                    >
                      {MedicationRequestModel.intentCodes[code].display}
                    </option>
                  ))}
                </Form.Control>
                <Form.Label>Authored On</Form.Label>
                <br/>
                <DateTimePicker
                  format="MM-dd-y h:mm:ss a"
                  maxDate={new Date()}
                  value={this.state.newRequest.authoredOn}
                  onChange={this.authoredOnChangeHandle}
                />
              </Form.Group>
            </Form>
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
