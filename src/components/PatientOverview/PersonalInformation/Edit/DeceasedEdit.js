import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import DateTimePicker from "react-datetime-picker";

class DeceasedEdit extends React.Component {
  constructor(props) {
    super(props);
    const currentDeceasedBoolean = this.props.fhirClient.patientData.patient.getCurrent()
      .deceasedBoolean;
    const currentDeceasedDateTime = this.props.fhirClient.patientData.patient.getCurrent()
      .deceasedDateTime;
    const newIsDeceased = this.props.fhirClient.patientData.patient
      .getCurrent()
      .isDeceased();
    this.state = {
      modalShown: false,
      newIsDeceased: newIsDeceased,
      newDeceasedBoolean: currentDeceasedBoolean,
      newDeceasedDateTime: currentDeceasedDateTime,
    };
  }

  componentDidUpdate(oldProps) {
    const currentDeceasedBoolean = this.props.fhirClient.patientData.patient.getCurrent()
      .deceasedBoolean;
    const currentDeceasedDateTime = this.props.fhirClient.patientData.patient.getCurrent()
      .deceasedDateTime;
    const oldDeceasedBoolean = oldProps.fhirClient.patientData.patient.getCurrent()
      .deceasedBoolean;
    const oldDeceasedDateTime = oldProps.fhirClient.patientData.patient.getCurrent()
      .deceasedDateTime;
    if (
      currentDeceasedBoolean !== oldDeceasedBoolean ||
      currentDeceasedDateTime !== oldDeceasedDateTime
    ) {
      const newIsDeceased = this.props.fhirClient.patientData.patient
        .getCurrent()
        .isDeceased();
      this.setState({
        newDeceasedBoolean: currentDeceasedBoolean,
        newDeceasedDateTime: currentDeceasedDateTime,
        newIsDeceased: newIsDeceased,
      });
    }
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

  deceasedChangeHandle = (event) => {
    if (event && event.target) {
      const newDeceasedBoolean = event.target.checked;
      this.setState({
        newDeceasedBoolean: newDeceasedBoolean,
        newIsDeceased: newDeceasedBoolean,
      });
    }
  };

  deceasedDateTimeChangeHandle = (newDateTime) => {
    this.setState({
      newDeceasedDateTime: newDateTime,
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

  onUpdateFail = () => {};

  saveDataHandle = () => {
    const patientId = this.props.fhirClient.patientData.patient.getCurrent().id;
    const newDeceasedBoolean = this.state.newDeceasedBoolean;
    const newDeceasedDateTime = this.state.newDeceasedDateTime;
    var patch;
    if (!newDeceasedBoolean) {
      patch = [
        {
          op: "add",
          path: "/deceasedBoolean",
          value: false,
        },
      ];
    } else {
      patch = [
        {
          op: "add",
          path: "/deceasedDateTime",
          value: newDeceasedDateTime,
        },
      ];
    }

    this.props.fhirClient.updateResource(
      "Patient",
      patientId,
      patch,
      this.onUpdateSuccess,
      this.onUpdateFail
    );
  };

  render() {
    var patient = this.props.fhirClient.patientData.patient.getCurrent();
    console.log(patient.isDeceased());
    return (
      <div className="ml-auto">
        <Button
          onClick={this.modalShowHandle}
          variant="link"
          className="p-0"
          title="Edit Deceased Status"
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
            <Modal.Title>Edit Patient's Deceased Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <h5>Current value</h5>
              <span>
                {patient.deceasedDateTime
                  ? `Yes, ${new Date(patient.deceasedDateTime).toLocaleString(
                      "en-US"
                    )}`
                  : patient.deceasedBoolean === false
                  ? "No"
                  : "Unspecified"}
              </span>
              <h5>New value</h5>
              <Form>
                <Form.Group controlId="newDeceasedStatusGroup">
                  <Form.Label>Patient is deceased</Form.Label>
                  <Form.Control
                    type="checkbox"
                    onChange={this.deceasedChangeHandle}
                    checked={this.state.newIsDeceased}
                    className="small-checkbox"
                  />
                  <Form.Group controlId="newDeceasedDateTimeGroup">
                    <Form.Label>Deceased date time</Form.Label>
                    <br />
                    <DateTimePicker
                      format="y-MM-dd h:mm:ss a"
                      maxDate={new Date()}
                      value={this.state.newDeceasedDateTime}
                      onChange={this.deceasedDateTimeChangeHandle}
                      disabled={!this.state.newIsDeceased}
                    />
                  </Form.Group>
                </Form.Group>
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
