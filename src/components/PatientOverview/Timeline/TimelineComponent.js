import React from "react";
import Timeline from "react-visjs-timeline";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { capitalizeFirstLetter } from "../../../Helpers";
import RawHtml from "../../RawHtml";
import ObservationEdit from "./Edit/ObservationEdit";
import ObservationModalBody from "./ObservationModalBody";

import "./Timeline.css";

class TimelineComponent extends React.Component {
  state = {
    modalsShown: [],
  };

  constructor(props) {
    super(props);
    var modalsShown = {};
    this.props.items.forEach((item) => {
      modalsShown[String(item.id)] = false;
    });
    var next_key = 0;
    const modals = this.props.items.map((item) => {
      return this.createModal(item, next_key++);
    });
    this.state = {
      modalsShown: modalsShown,
      modals: modals,
    };
  }

  updateModals() {
    var next_key = 0;
    const modals = this.props.items.map((item) => {
      return this.createModal(item, next_key++);
    });
    this.setState((state) => {
      return {
        ...state,
        modals: modals,
      };
    });
  }

  getRequestModalBody(request) {
    return (
      <dl>
        <dt>Authored On</dt>
        <dd>{new Date(request.authoredOn).toLocaleString("en-US")}</dd>
        <dt>Intent</dt>
        <dd>{capitalizeFirstLetter(request.intent)}</dd>
        <dt>Dosage</dt>
        <dd>
          <RawHtml>{request.getDosageHtml()}</RawHtml>
        </dd>
        <dt>Status</dt>
        <dd>{capitalizeFirstLetter(request.status)}</dd>
        <dt>Requester</dt>
        <dd>{request.requester}</dd>
      </dl>
    );
  }

  createModal(item, key) {
    var modalTitle;
    var modalHeader;
    var modalBody;
    var currentModel;
    if (item.type === "Observation") {
      currentModel = this.props.fhirClient.patientData.observations[
        item.localId
      ].getCurrent();
      modalTitle = currentModel.code.text;
      modalHeader = (
        <div className="d-flex">
          {currentModel.category.toText()}
          <i className="fas fa-user-md fa-2x ml-3"></i>
          <ObservationEdit
            fhirClient={this.props.fhirClient}
            currentObservation={currentModel}
            localId={item.localId}
            parentOnVersionChangeHandle={this.props.parentOnVersionChangeHandle}
          />
        </div>
      );
      modalBody = <ObservationModalBody fhirClient={this.props.fhirClient} multiverModel={this.props.fhirClient.patientData.observations[item.localId]} />;
    } else {
      // Medication Request
      currentModel = this.props.fhirClient.patientData.medicationRequests[
        item.localId
      ].getCurrent();
      modalTitle = currentModel.toText();
      modalHeader = <i className="fas fa-pills fa-2x"></i>;
      modalBody = this.getRequestModalBody(currentModel);
    }
    return (
      <div key={key}>
        <Modal
          show={this.state.modalsShown[item.id]}
          onHide={this.modalHideHandle}
          animation={false}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>{modalTitle}</Modal.Title>
            {modalHeader}
          </Modal.Header>
          <Modal.Body>{modalBody}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={this.modalHideHandle}
              data-id={item.id}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  modalHideHandle = (event) => {
    if (!event || !event.target) return;
    var newModalsShown = this.state.modalsShown;
    newModalsShown[event.target.dataset["id"]] = false;
    this.setState((state) => {
      return {
        ...state,
        modalsShown: newModalsShown,
      };
    });
    this.updateModals();
  };

  clickHandler = (event) => {
    if (!event.event.shiftKey) return;
    const item_id = event.item;
    if (item_id) {
      this.setState((state) => {
        var newModalsShown = state.modalsShown;
        newModalsShown[item_id] = true;
        return {
          ...state,
          modalsShown: newModalsShown,
        };
      });
      this.updateModals();
    }
  };

  render() {
    return (
      <div>
        <Timeline
          options={this.props.options}
          items={this.props.items.map((element) => {
            return element.timelineItem;
          })}
          groups={this.props.groups}
          clickHandler={this.clickHandler}
        />
        {this.state.modals}
      </div>
    );
  }
}

export default TimelineComponent;
