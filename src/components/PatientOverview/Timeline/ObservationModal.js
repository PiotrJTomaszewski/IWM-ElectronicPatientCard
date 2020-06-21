import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { capitalizeFirstLetter } from "../../../Helpers";
import VersionControl from "../../VersionControl";
import ObservationEdit from "./Edit/ObservationEdit";

class ObservationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVersion: this.props.multiverModel.currentVersion,
      multiverObservation: this.props.multiverModel,
      currentObservation: this.props.multiverModel.getCurrent(),
    };
  }

  versionChangeHandle = (newVersion) => {
    this.setState({
      currentVersion: newVersion,
      currentObservation: this.state.multiverObservation.modelVersions[
        newVersion
      ],
    });
    this.props.parentOnVersionChangeHandle(newVersion);
  };

  render() {
    var modalTitle = this.state.currentObservation.code.text;
    var modalHeader = (
      <div className="d-flex">
        {this.state.currentObservation.getCategoryLogo()}
        {this.state.multiverObservation.isCurrentTheLast() ? (
          <ObservationEdit
            fhirClient={this.props.fhirClient}
            currentObservation={this.state.currentObservation}
            localId={this.state.multiverObservation.localId}
            parentOnVersionChangeHandle={this.versionChangeHandle}
          />
        ) : null}
      </div>
    );
    return (
      <Modal
        show={this.props.modalShown}
        onHide={this.props.modalHideHandle}
        animation={false}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>{modalTitle}</Modal.Title>
          {modalHeader}
        </Modal.Header>
        <Modal.Body>
          <div>
            <dl>
              <dt>Status</dt>
              <dd
                className={
                  this.state.multiverObservation.isDifferentFromPrev("status")
                    ? "modal-field-differ"
                    : ""
                }
              >
                {capitalizeFirstLetter(this.state.currentObservation.status)}
              </dd>
              {/* <dt>Issued</dt>
              <dd
                className={
                  this.state.multiverObservation.isDifferentFromPrev("issued")
                    ? "modal-field-differ"
                    : ""
                }
              >
                {this.state.currentObservation.issued
                  ? new Date(
                      this.state.currentObservation.issued
                    ).toLocaleString("en-US")
                  : ""}
              </dd> */}
              <dt>Effective Date Time</dt>
              <dd
                className={
                  this.state.multiverObservation.isDifferentFromPrev(
                    "effectiveDateTime"
                  )
                    ? "modal-field-differ"
                    : ""
                }
              >
                {this.state.currentObservation.effectiveDateTime
                  ? new Date(
                      this.state.currentObservation.effectiveDateTime
                    ).toLocaleString("en-US")
                  : ""}
              </dd>
              <dt>Value</dt>
              <dd
                className={
                  this.state.multiverObservation.isDifferentFromPrev(
                    "valueQuantity"
                  ) ||
                  this.state.multiverObservation.isDifferentFromPrev(
                    "valueCodeableConcept"
                  ) ||
                  this.state.multiverObservation.isDifferentFromPrev(
                    "components"
                  )
                    ? "modal-field-differ"
                    : ""
                }
              >
                {this.state.currentObservation.getValueText(false)}
              </dd>
            </dl>
            <VersionControl
              fhirClient={this.props.fhirClient}
              multiverModel={this.state.multiverObservation}
              currentModelVersion={this.state.currentVersion}
              parentOnVersionChangeHandle={this.versionChangeHandle}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={this.props.modalHideHandle}
            data-id={this.state.currentObservation.id}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ObservationModal;
