import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import DateTimePicker from "react-datetime-picker";

import { capitalizeFirstLetter } from "../../../../Helpers";
import ObservationModel from "../../../../models/ObservationModel";

class ContactDetailsEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShown: false,
      currentObservation: this.props.currentObservation,
      newObservation: {
        status: this.props.currentObservation.status,
        issued: new Date(this.props.currentObservation.issued),
        effectiveDateTime: new Date(this.props.currentObservation.effectiveDateTime),
        value: this.props.currentObservation.getValue(),
      },
    };
  }

  // componentDidUpdate(oldProps) {
  //   if (
  //     JSON.stringify(oldProps.currentTelecom) !==
  //     JSON.stringify(this.props.currentTelecom)
  //   ) {
  //     this.setState({
  //       currentTelecom: this.props.currentTelecom,
  //       newTelecom: this.props.currentTelecom,
  //     });
  //   }
  // }

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

  onUpdateFail = () => {};

  statusChangeHandle = (event) => {
    if (event && event.target) {
      const newStatus = event.target.value;
      this.setState((oldState) => {
        return {
          newObservation: {
            ...oldState.newObservation,
            status: newStatus,
          },
        };
      });
    }
  };

  issuedChangeHandle = (newDateTime) => {
    this.setState((oldState) => {
      return {
        newObservation: {
          ...oldState.newObservation,
          issued: newDateTime
        }
      }
    })
  };

  effectiveDateTimeChangeHandle = (newDateTime) => {
    this.setState((oldState) => {
      return {
        newObservation: {
          ...oldState.newObservation,
          effectiveDateTime: newDateTime
        }
      }
    })
  };

  valueChangeHandle = (event) => {
    event.persist();
    var newValue = parseFloat(event.target.value);
    if (newValue === NaN) {
      return;
    }
    var fieldId;
    if (event && event.target) {
      switch(this.state.currentObservation.valueType) {
        case ObservationModel.valueType["valueQuantity"]:
          this.setState((oldState) => {
            return {
              newObservation: {
                ...oldState.newObservation,
                value: newValue
              }
            }
          })
        break;
      case ObservationModel.valueType["valueCodeableConcept"]:
        // Not implemented
        break;
      case ObservationModel.valueType["valueComponents"]:
        fieldId = event.target.dataset["fieldId"];
        this.setState((oldState) => {
          var newObservationValue = oldState.newObservation.value;
          newObservationValue[fieldId] = newValue;
          return {
            newObservation: {
              ...oldState.newObservation,
              value: newObservationValue
            }
          }
        })
        break;
      default:
        break;
      }
    }
  };

  saveDataHandle = () => {
    const observationId = this.props.currentObservation.id;
    const newStatus = this.state.newObservation.status;
    const newIssued = this.state.newObservation.issued;
    const newEffectiveDateTime = this.state.newObservation.effectiveDateTime;
    var patch = []
    if (newStatus !== this.state.currentObservation.status) {
      patch.push({
        op: "replace",
        path: "/status",
        value: newStatus
      })
    }
    if (newIssued !== new Date(this.state.currentObservation.issued)) {
      patch.push({
        op: "replace",
        path: "/issued",
        value: newIssued
      })
    }
    if (newEffectiveDateTime !== new Date(this.state.currentObservation.effectiveDateTime)) {
      patch.push({
        op: "replace",
        path: "/effectiveDateTime",
        value: newEffectiveDateTime
      })
    }
    var newValue = this.state.newObservation.value;
    switch (this.props.currentObservation.valueType) {
      case ObservationModel.valueType["valueQuantity"]:
        if (newValue !== this.state.currentObservation.valueQuantity.value) {
          patch.push({
            op: "replace",
            path: "/valueQuantity/value",
            value: newValue
          })
        }
        break;
      case ObservationModel.valueType["valueCodeableConcept"]:
        // Not implemented
        break;
      case ObservationModel.valueType["valueComponents"]:
        this.state.currentObservation.components.forEach((comp, index) => {
          if (newValue[index] !== comp.valueQuantity.value) {
            patch.push({
              op: "replace",
              path: `/component/${index}/valueQuantity/value`,
              value: newValue[index]
            })
          }
        })
        break;
      default:
        break;
    }
    this.props.fhirClient.updateResource(
      "Observation",
      observationId,
      patch,
      this.onUpdateSuccess,
      this.onUpdateFail
    );
  };

  render() {
    var nextOptionKey = 0;
    var valueEditField;
    switch (this.state.currentObservation.valueType) {
      case ObservationModel.valueType.valueQuantity:
        valueEditField = (
          <div>
            <Form.Label>Value</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                value={this.state.newObservation.value}
                onChange={this.valueChangeHandle}
              />
              <InputGroup.Append>
                <InputGroup.Text>
                  {this.state.currentObservation.valueQuantity.unit}
                </InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </div>
        );
        break;
      case ObservationModel.valueType.valueComponents:
        valueEditField = (
          <div>
            <Form.Label>Value</Form.Label>
            {this.state.newObservation.value.map((value, index) => (
              <InputGroup key={index}>
                <InputGroup.Prepend>
                  <InputGroup.Text>{this.state.currentObservation.components[index].text}</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control type="text" value={value} data-field-id={index} onChange={this.valueChangeHandle}/>
                <InputGroup.Append>
                  <InputGroup.Text>
                    {
                      this.state.currentObservation.components[index]
                        .valueQuantity.unit
                    }
                  </InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            ))}
          </div>
        );
        break;
      case ObservationModel.valueType.valueCodeableConcept:
        // Not implemented
        break;
      default:
        break;
    }

    return (
      <div className="ml-auto">
        <Button
          onClick={this.modalShowHandle}
          variant="link"
          className="p-0"
          title="Edit Observation"
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
            <Modal.Title>Edit Observation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div>
                <h5>Current value</h5>
                <dl>
                  <dt>Status</dt>
                  <dd>
                    {capitalizeFirstLetter(
                      this.state.currentObservation.status
                    )}
                  </dd>
                  <dt>Issued</dt>
                  <dd>
                    {this.state.currentObservation.issued
                      ? new Date(
                          this.state.currentObservation.issued
                        ).toLocaleString("en-US")
                      : ""}
                  </dd>
                  <dt>Effective Date Time</dt>
                  <dd>
                    {this.state.currentObservation.effectiveDateTime
                      ? new Date(
                          this.state.currentObservation.effectiveDateTime
                        ).toLocaleString("en-US")
                      : ""}
                  </dd>
                  <dt>Value</dt>
                  <dd>{this.state.currentObservation.getValueText(false)}</dd>
                </dl>
              </div>
              <h5>New value</h5>
              <Form>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={this.state.newObservation.status}
                    onChange={this.statusChangeHandle}
                  >
                    {Object.keys(ObservationModel.statusCodes).map((status) => (
                      <option
                        value={ObservationModel.statusCodes[status].code}
                        key={nextOptionKey++}
                      >
                        {ObservationModel.statusCodes[status].display}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Label>Issued</Form.Label>
                  <br />
                  <DateTimePicker
                    format="MM-dd-y h:mm:ss a"
                    maxDate={new Date()}
                    value={this.state.newObservation.issued}
                    onChange={this.issuedChangeHandle}
                  />
                  <br />
                  <Form.Label>Effective Date Time</Form.Label>
                  <br />
                  <DateTimePicker
                    format="MM-dd-y h:mm:ss a"
                    maxDate={new Date()}
                    value={this.state.newObservation.effectiveDateTime}
                    onChange={this.effectiveDateTimeChangeHandle}
                  />
                  <br />
                  {valueEditField}
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
