import React from "react";
import Timeline from "react-visjs-timeline";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

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
    return (
      <div key={key}>
        <Modal
          show={this.state.modalsShown[item.id]}
          onHide={this.modalHideHandle}
          animation={false}
        >
          <Modal.Header>
            <Modal.Title>{item.modalTitle}</Modal.Title>
            {item.modalHeader}
          </Modal.Header>
          <Modal.Body>{item.modalBody}</Modal.Body>
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
            return element.item;
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
