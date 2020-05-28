import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

class TableModalWithButtons extends React.Component {
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
      tooltip, buttonText, modalTitle, modalTableHeaderRow, modalTableBody
    */
    // Animation in version 1.0.1 of react-bootstrap usues an deprecated method so it has to be turned off unitil the library is updated
    return (
      <div>
        <Button
          onClick={this.modalShowHandle}
          variant="link"
          className="p-0"
          title={this.props.tooltip}
        >
          {this.props.buttonText}
        </Button>
        <Modal
          show={this.state.modalShown}
          onHide={this.modalHideHandle}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.props.modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table>
              <thead>{this.props.modalTableHeaderRow}</thead>
              <tbody>{this.props.modalTableBody}</tbody>
            </Table>
          </Modal.Body>
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

export default TableModalWithButtons;
