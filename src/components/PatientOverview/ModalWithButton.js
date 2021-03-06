import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

class ModalWithButton extends React.Component {
  state = {
    modalShown: false,
  };

  modalShowHandle = () => {
    this.setState((state) => {
      return {
        ...state,
        modalShown: true,
      };
    });
    if (this.props.modalShowHandle) {
      this.props.modalShowHandle();
    }
  };

  modalHideHandle = () => {
    this.setState((state) => {
      return {
        ...state,
        modalShown: false,
      };
    });
    if (this.props.modalHideHandle) {
      this.props.modalHideHandle();
    }
  };

  render() {
    /* Props:
      tooltip, buttonText, modalTitle, modalBody
    */
    // Animation in version 1.0.1 of react-bootstrap usues an deprecated method so it has to be turned off unitil the library is updated
    return (
      <div>
        <Button
          onClick={this.modalShowHandle}
          variant={this.props.buttonVariant ? this.props.buttonVariant : "link"}
          className={this.props.buttonClass ? this.props.buttonClass : "p-0"}
          title={this.props.tooltip}
        >
          {this.props.buttonText}
        </Button>
        <Modal
          show={this.state.modalShown}
          onHide={this.modalHideHandle}
          animation={false}
          size={this.props.size ? this.props.size : ""}
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.props.modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.props.modalBody}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.modalHideHandle}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ModalWithButton;
