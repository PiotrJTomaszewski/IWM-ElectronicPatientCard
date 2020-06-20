import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { capitalizeFirstLetter } from "../../../Helpers";
import RawHtml from "../../RawHtml";
import VersionControl from "../../VersionControl";
import MedicationRequestEdit from "./Edit/MedicationRequestEdit";

class MedicationRequestModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVersion: this.props.multiverModel.currentVersion,
      multiverRequest: this.props.multiverModel,
      currentRequest: this.props.multiverModel.getCurrent(),
    };
  }

  versionChangeHandle = (newVersion) => {
    this.setState({
      currentVersion: newVersion,
      currentRequest: this.state.multiverRequest.modelVersions[newVersion],
    });
    this.props.parentOnVersionChangeHandle(newVersion);
  };

  render() {
    return (
      <Modal
        show={this.props.modalShown}
        onHide={this.props.modalHideHandle}
        animation={false}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>{this.state.currentRequest.toText()}</Modal.Title>
          <div className="d-flex">
            <i className="fas fa-pills fa-2x"></i>
            {this.state.multiverRequest.isCurrentTheLast() ? <MedicationRequestEdit
              fhirClient={this.props.fhirClient}
              currentRequest={this.state.currentRequest}
              localId={this.state.multiverRequest.localId}
              parentOnVersionChangeHandle={this.versionChangeHandle}
            /> : null}
          </div>
        </Modal.Header>
        <Modal.Body>
          <dl>
            <dt>Authored On</dt>
            <dd
              className={
                this.state.multiverRequest.isDifferentFromPrev("authoredOn")
                  ? "modal-field-differ"
                  : ""
              }
            >
              {new Date(this.state.currentRequest.authoredOn).toLocaleString(
                "en-US"
              )}
            </dd>
            <dt>Intent</dt>
            <dd
              className={
                this.state.multiverRequest.isDifferentFromPrev("intent")
                  ? "modal-field-differ"
                  : ""
              }
            >
              {capitalizeFirstLetter(this.state.currentRequest.intent)}
            </dd>
            <dt>Dosage</dt>
            <dd
              className={
                this.state.multiverRequest.isDifferentFromPrev(
                  "dosageInstructions"
                )
                  ? "modal-field-differ"
                  : ""
              }
            >
              <RawHtml>{this.state.currentRequest.getDosageHtml()}</RawHtml>
            </dd>
            <dt>Status</dt>
            <dd
              className={
                this.state.multiverRequest.isDifferentFromPrev("status")
                  ? "modal-field-differ"
                  : ""
              }
            >
              {capitalizeFirstLetter(this.state.currentRequest.status)}
            </dd>
            <dt>Requester</dt>
            <dd
              className={
                this.state.multiverRequest.isDifferentFromPrev(
                  "requester"
                )
                  ? "modal-field-differ"
                  : ""
              }
            >
              {this.state.currentRequest.requester}
            </dd>
          </dl>
          <VersionControl
            fhirClient={this.props.fhirClient}
            multiverModel={this.state.multiverRequest}
            currentModelVersion={this.state.currentVersion}
            parentOnVersionChangeHandle={this.versionChangeHandle}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={this.props.modalHideHandle}
            data-id={this.state.currentRequest.id}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default MedicationRequestModal;
