import React from "react";
import Timeline from "react-visjs-timeline";

import ObservationModal from "./ObservationModal";
import MedicationRequestModal from "./MedicationRequestModal";
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

  createModal(item, key) {
    if (item.type === "Observation") {
    return (
      <div key={key}>
        <ObservationModal modalHideHandle={this.modalHideHandle} modalShown={this.state.modalsShown[item.id]} fhirClient={this.props.fhirClient} multiverModel={this.props.fhirClient.patientData.observations[item.localId]} parentOnVersionChangeHandle={this.props.parentOnVersionChangeHandle}/>
      </div>
    );
    } else {
      return (
        <div key={key}>
          <MedicationRequestModal modalHideHandle={this.modalHideHandle} modalShown={this.state.modalsShown[item.id]} fhirClient={this.props.fhirClient} multiverModel={this.props.fhirClient.patientData.medicationRequests[item.localId]} parentOnVersionChangeHandle={this.props.parentOnVersionChangeHandle}/>
        </div>
      )
    }
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
        <div className="hidden">{this.state.modals}</div>
      </div>
    );
  }
}

export default TimelineComponent;
