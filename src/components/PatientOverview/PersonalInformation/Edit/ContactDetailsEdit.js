import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import TelecomModel from "../../../../models/TelecomModel";

class ContactDetailsEdit extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.mode === "edit") {
      this.state = {
        modalShown: false,
        currentTelecom: this.props.currentTelecom,
        newTelecom: {
          system: this.props.currentTelecom.system,
          value: this.props.currentTelecom.value,
          use: this.props.currentTelecom.use,
        },
      };
    } else {
      this.state = {
        modalShown: false,
        currentTelecom: {
          system: "unspecified",
          value: "",
          use: "unspecified",
        },
        newTelecom: {
          system: "unspecified",
          value: "",
          use: "unspecified",
        },
      };
    }
  }

  componentDidUpdate(oldProps) {
    if (
      JSON.stringify(oldProps.currentTelecom) !==
      JSON.stringify(this.props.currentTelecom)
    ) {
      this.setState({
        currentTelecom: this.props.currentTelecom,
        newTelecom: this.props.currentTelecom,
      });
    }
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

  systemSelectedHandle = (event) => {
    if (event && event.target) {
      var newSystem = event.target.value;
      this.setState((oldState) => {
        var newTelecom = oldState.newTelecom;
        newTelecom.system = newSystem;
        return {
          newTelecom: newTelecom,
        };
      });
    }
  };

  useSelectHandle = (event) => {
    if (event && event.target) {
      var newUse = event.target.value;
      this.setState((oldState) => {
        var newTelecom = oldState.newTelecom;
        newTelecom.use = newUse;
        return {
          newTelecom: newTelecom,
        };
      });
    }
  };

  valueChangedHandle = (event) => {
    if (event && event.target) {
      var newValue = event.target.value;
      this.setState((oldState) => {
        var newTelecom = oldState.newTelecom;
        newTelecom.value = newValue;
        return {
          newTelecom: newTelecom,
        };
      });
    }
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
    const newContactDetail = this.state.newTelecom;
    const newSystem =
      newContactDetail.system !== "unspecified"
        ? newContactDetail.system
        : null;
    const newUse =
      newContactDetail.use !== "unspecified" ? newContactDetail.use : null;
    const newValue = newContactDetail.value;
    var patch;
    if (this.props.mode === "edit") {
      const path = `/telecom/${this.state.currentTelecom.localId}`;
      patch = [
        {
          op: "replace",
          path: path,
          value: {
            system: newSystem,
            use: newUse,
            value: newValue,
          },
        },
      ];
    } else {
      const path = `/telecom/${this.props.fhirClient.patientData.patient.getCurrent().getFreeLocalTelecomId()}`
      patch = [
        {
          op: "add",
          path: path,
          value: {
            system: newSystem,
            use: newUse,
            value: newValue,
          },
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
    var nextOptionKey = 0;
    return (
      <div className="ml-auto">
        <Button
          onClick={this.modalShowHandle}
          variant="link"
          className="p-0"
          title={this.props.mode === "edit" ? "Edit Contact Details": "Add Contact Details"}
        >
          {this.props.mode === "edit" ? (<i className="fas fa-edit"></i>) : (<i className="fas fa-plus"></i>)}
        </Button>
        <Modal
          show={this.state.modalShown}
          onHide={this.modalCancelHandle}
          animation={false}
          size={this.props.size ? this.props.size : ""}
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.props.mode === "edit" ? "Edit Patient's Contact Details" : "Add Patient's Contact Details"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              {this.props.mode === "edit" ? (
                <div>
                  <h5>Current value</h5>
                  <span>
                    {
                      <div
                        title={
                          this.state.currentTelecom.getHtml(0, null, false)
                            .title
                        }
                      >
                        {this.state.currentTelecom.getHtml(0, null, false).html}
                      </div>
                    }
                  </span>
                </div>
              ) : null}

              <h5>New value</h5>
              <Form>
                <Form.Group>
                  <Form.Label>System</Form.Label>
                  <Form.Control
                    as="select"
                    id="newTelecomSystemBox"
                    onChange={this.systemSelectedHandle}
                    value={this.state.newTelecom.system}
                  >
                    {Object.keys(TelecomModel.telecomSystems).map((code) => (
                      <option value={code} key={nextOptionKey++}>
                        {TelecomModel.telecomSystems[code].text}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Label>Use</Form.Label>
                  <Form.Control
                    as="select"
                    id="newTelecomUsesBox"
                    onChange={this.useSelectHandle}
                    value={this.state.newTelecom.use}
                  >
                    {Object.keys(TelecomModel.telecomUses).map((code) => (
                      <option value={code} key={nextOptionKey++}>
                        {TelecomModel.telecomUses[code].text}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Label>Value</Form.Label>
                  <Form.Control
                    type="text"
                    value={this.state.newTelecom.value}
                    onChange={this.valueChangedHandle}
                  ></Form.Control>
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

export default ContactDetailsEdit;
